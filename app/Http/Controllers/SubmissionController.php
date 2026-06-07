<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Submission;
use App\Services\FunctionalTestcase\SubmissionRules;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    public function store(Request $request, $classId, $assignmentId)
    {
        $request->validate(
            [
                'file' => SubmissionRules::fileRules(),
            ],
            SubmissionRules::fileMessages()
        );

        $assignment = Assignment::findOrFail($assignmentId);

        if (app(SubmissionRules::class)->isPastDeadline($assignment)) {
            return redirect()->back()->withErrors([
                'file' => SubmissionRules::ERROR_DEADLINE,
            ]);
        }

        $student = auth()->user();

        $existingSubmission = Submission::where('assignment_id', $assignmentId)
            ->where('student_id', $student->id)
            ->first();

        if ($existingSubmission) {
            return redirect()->back()->with('error', 'Anda sudah mengirimkan tugas ini!');
        }

        try {
            DB::beginTransaction();

            $file = $request->file('file');
            $uploadedFile = Cloudinary::uploadApi()->upload(
                $file->getRealPath(),
                ['folder' => 'submissions']
            );

            $publicId = $uploadedFile['public_id'];
            $fileLink = $uploadedFile['secure_url'];

            Submission::create([
                'assignment_id' => $assignmentId,
                'student_id' => $student->id,
                'submission_content' => $fileLink,
                'public_id' => $publicId,
                'submitted_at' => now(),
            ]);

            DB::commit();

            return redirect()->back()->with('success', SubmissionRules::SUCCESS_SUBMITTED);
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal mengirim tugas: '.$e->getMessage());
        }
    }

    public function update(Request $request, $classId, $assignmentId, $submissionId)
    {
        $submission = Submission::where('id', $submissionId)
            ->where('student_id', auth()->id())
            ->firstOrFail();

        $request->validate(
            [
                'file' => SubmissionRules::fileRules(),
            ],
            SubmissionRules::fileMessages()
        );

        $assignment = Assignment::findOrFail($assignmentId);

        if (app(SubmissionRules::class)->isPastDeadline($assignment)) {
            return redirect()->back()->withErrors([
                'file' => SubmissionRules::ERROR_DEADLINE,
            ]);
        }

        try {
            DB::beginTransaction();

            if (! empty($submission->public_id)) {
                Cloudinary::uploadApi()->destroy($submission->public_id);
            }

            $file = $request->file('file');

            $uploadedFile = Cloudinary::uploadApi()->upload(
                $file->getRealPath(),
                ['folder' => 'submissions']
            );

            $publicId = $uploadedFile['public_id'];
            $fileLink = $uploadedFile['secure_url'];

            $submission->update([
                'submission_content' => $fileLink,
                'public_id' => $publicId,
                'submitted_at' => now(),
            ]);

            DB::commit();

            return redirect()->back()->with('success', SubmissionRules::SUCCESS_UPDATED);
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal memperbarui tugas: '.$e->getMessage());
        }
    }

    public function destroy($classId, $assignmentId, $submissionId)
    {
        $submission = Submission::where('id', $submissionId)
            ->where('student_id', auth()->id())
            ->firstOrFail();

        try {
            DB::beginTransaction();

            if (! empty($submission->public_id)) {
                Cloudinary::uploadApi()->destroy($submission->public_id);
            }

            $submission->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Tugas berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menghapus tugas: '.$e->getMessage());
        }
    }

    public function updateGrade(Request $request, $classId, $assignmentId, $submissionId)
    {
        $request->validate(
            SubmissionRules::gradeRules(),
            SubmissionRules::gradeMessages()
        );

        $submission = Submission::findOrFail($submissionId);
        $submission->update([
            'grade' => $request->grade,
            'feedback' => $request->feedback,
        ]);

        return redirect()->back()->with('success', SubmissionRules::SUCCESS_GRADED);
    }
}
