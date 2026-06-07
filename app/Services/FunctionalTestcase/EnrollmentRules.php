<?php

namespace App\Services\FunctionalTestcase;

use App\Models\ClassModel;

class EnrollmentRules
{
    public const ERROR_REQUIRED = 'Kode kelas wajib diisi';

    public const ERROR_NOT_FOUND = 'Kode kelas tidak ditemukan';

    public const ERROR_PRIVATE = 'Kelas tidak tersedia untuk pendaftaran';

    public const ERROR_DUPLICATE = 'Anda sudah terdaftar di kelas ini';

    public const SUCCESS_ENROLLED = 'Berhasil mendaftar kelas';

    public static function codeRules(): array
    {
        return ['required', 'string'];
    }

    public static function codeMessages(): array
    {
        return [
            'enrollment_code.required' => self::ERROR_REQUIRED,
        ];
    }

    public function decide(?ClassModel $class, bool $alreadyEnrolled): array
    {
        if (! $class) {
            return ['allowed' => false, 'message' => self::ERROR_NOT_FOUND];
        }

        if ($alreadyEnrolled) {
            return ['allowed' => false, 'message' => self::ERROR_DUPLICATE];
        }

        if (! $class->visibility) {
            return ['allowed' => false, 'message' => self::ERROR_PRIVATE];
        }

        return ['allowed' => true, 'message' => self::SUCCESS_ENROLLED];
    }
}
