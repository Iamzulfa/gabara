<?php

namespace App\Services\FunctionalTestcase;

use App\Models\Assignment;
use Carbon\Carbon;
use Carbon\CarbonInterface;

class SubmissionRules
{
    public const ERROR_FILE_EMPTY = 'File tidak boleh kosong';

    public const ERROR_FILE_TYPE = 'Tipe file tidak didukung. Hanya PDF dan DOCX yang diizinkan';

    public const ERROR_FILE_MAX = 'Ukuran file maksimal 2 MB';

    public const ERROR_DEADLINE = 'Batas waktu pengumpulan telah lewat';

    public const ERROR_GRADE_MIN = 'Nilai minimal adalah 0.';

    public const ERROR_GRADE_MAX = 'Nilai maksimal adalah 100.';

    public const SUCCESS_SUBMITTED = 'Tugas berhasil dikumpulkan';

    public const SUCCESS_UPDATED = 'Submission berhasil diperbarui';

    public const SUCCESS_GRADED = 'Nilai berhasil disimpan!';

    public static function fileRules(): array
    {
        return ['required', 'file', 'mimes:pdf,docx', 'min:1', 'max:2048'];
    }

    public static function fileMessages(): array
    {
        return [
            'file.required' => self::ERROR_FILE_EMPTY,
            'file.min' => self::ERROR_FILE_EMPTY,
            'file.mimes' => self::ERROR_FILE_TYPE,
            'file.max' => self::ERROR_FILE_MAX,
        ];
    }

    public static function gradeRules(): array
    {
        return [
            'grade' => ['required', 'numeric', 'min:0', 'max:100'],
            'feedback' => ['nullable', 'string', 'max:255'],
        ];
    }

    public static function gradeMessages(): array
    {
        return [
            'grade.required' => 'Nilai harus diisi.',
            'grade.numeric' => 'Nilai harus berupa angka.',
            'grade.min' => self::ERROR_GRADE_MIN,
            'grade.max' => self::ERROR_GRADE_MAX,
            'feedback.max' => 'Feedback maksimal 255 karakter.',
        ];
    }

    public function isPastDeadline(Assignment $assignment, ?CarbonInterface $now = null): bool
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

        return ($now ?? now())->greaterThan($deadline);
    }
}
