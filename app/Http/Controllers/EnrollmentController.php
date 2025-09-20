<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(
            [
                'enrollment_code' => 'required|string',
            ],
            [
                'enrollment_code.required' => 'Kode enrollment tidak boleh kosong.'
            ]
        );

        $user = Auth::user();

        if ($user->role !== 'student') {
            abort(403, 'Hanya student yang dapat melakukan pendaftaran kelas.');
        }

        $class = ClassModel::where('enrollment_code', $request->enrollment_code)->first();

        if (!$class) {
            return back()->withErrors(['enrollment_code' => 'Kode enrollment tidak valid.']);
        }

        $alreadyEnrolled = Enrollment::where('class_id', $class->id)
            ->where('student_id', $user->id)
            ->exists();

        if ($alreadyEnrolled) {
            return back()->withErrors(['enrollment_code' => 'Anda sudah terdaftar di kelas ini.']);
        }

        if (!$class->visibility) {
            return back()->withErrors(['enrollment_code' => 'Status kelas masih privat.']);
        }

        Enrollment::create([
            'class_id' => $class->id,
            'student_id' => $user->id,
        ]);

        return redirect()->route('classes.index')->with('success', 'Berhasil bergabung ke kelas.');
    }
}
