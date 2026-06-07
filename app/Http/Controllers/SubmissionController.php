<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Submission;
use Carbon\Carbon;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    public function store(Request $request, $classId, $assignmentId)
    {
        $request->validate(
            [
                'file' => 'required|file|mimes:pdf,docx|min:1|max:2048',
            ],
            [
                'file.required' => 'File tidak boleh kosong',
                'file.min' => 'File tidak boleh kosong',
                'file.mimes' => 'Tipe file tidak didukung. Hanya PDF dan DOCX yang diizinkan',
                'file.max' => 'Ukuran file maksimal 2 MB',
            ]
        );

        $assignment = Assignment::findOrFail($assignmentId);

        if ($this->isPastDeadline($assignment)) {
            return redirect()->back()->withErrors([
                'file' => 'Batas waktu pengumpulan telah lewat',
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

            return redirect()->back()->with('success', 'Tugas berhasil dikumpulkan');
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
                'file' => 'required|file|mimes:pdf,docx|min:1|max:2048',
            ],
            [
                'file.required' => 'File tidak boleh kosong',
                'file.min' => 'File tidak boleh kosong',
                'file.mimes' => 'Tipe file tidak didukung. Hanya PDF dan DOCX yang diizinkan',
                'file.max' => 'Ukuran file maksimal 2 MB',
            ]
        );

        $assignment = Assignment::findOrFail($assignmentId);

        if ($this->isPastDeadline($assignment)) {
            return redirect()->back()->withErrors([
                'file' => 'Batas waktu pengumpulan telah lewat',
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

            return redirect()->back()->with('success', 'Submission berhasil diperbarui');
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
        $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string|max:255',
        ], [
            'grade.required' => 'Nilai harus diisi.',
            'grade.numeric' => 'Nilai harus berupa angka.',
            'grade.min' => 'Nilai minimal adalah 0.',
            'grade.max' => 'Nilai maksimal adalah 100.',
            'feedback.max' => 'Feedback maksimal 255 karakter.',
        ]);

        $submission = Submission::findOrFail($submissionId);
        $submission->update([
            'grade' => $request->grade,
            'feedback' => $request->feedback,
        ]);

        return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
    }

    private function isPastDeadline(Assignment $assignment): bool
    {
        if (! $assignment->date_close || ! $assignment->time_close) {
            return false;
        }

        $date = Carbon::parse($assignment->date_close)->toDateString();
        $time = trim((string) $assignment->time_close);

        if (str_contains($time, ' ')) {
            $time = Carbon::parse($time)->format('H:i:s');
        }

        $deadline = Carbon::parse($date.' '.$time);

        return now()->greaterThan($deadline);
    }
}
