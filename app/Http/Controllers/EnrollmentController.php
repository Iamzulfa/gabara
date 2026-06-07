<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Services\FunctionalTestcase\EnrollmentRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(
            [
                'enrollment_code' => EnrollmentRules::codeRules(),
            ],
            EnrollmentRules::codeMessages()
        );

        $user = Auth::user();

        if ($user->role !== 'student') {
            abort(403, 'Hanya student yang dapat melakukan pendaftaran kelas.');
        }

        $class = ClassModel::where('enrollment_code', $request->enrollment_code)->first();

        if (! $class) {
            return back()->withErrors(['enrollment_code' => EnrollmentRules::ERROR_NOT_FOUND]);
        }

        $alreadyEnrolled = Enrollment::where('class_id', $class->id)
            ->where('student_id', $user->id)
            ->exists();

        $decision = app(EnrollmentRules::class)->decide($class, $alreadyEnrolled);
        if (! $decision['allowed']) {
            return back()->withErrors(['enrollment_code' => $decision['message']]);
        }

        Enrollment::create([
            'class_id' => $class->id,
            'student_id' => $user->id,
        ]);

        return redirect()->route('classes.index')->with('success', EnrollmentRules::SUCCESS_ENROLLED);
    }
}
