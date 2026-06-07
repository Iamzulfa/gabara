<?php

namespace Tests\Unit\FunctionalTestcase\Enrollment;

use App\Models\ClassModel;
use App\Services\FunctionalTestcase\EnrollmentRules;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

/**
 * Equivalence Class Partitioning (ECP) – FR-2 Enrollment
 *
 * Berdasarkan Test Design Sheet:
 *   P1 – Kode valid, kelas visible, belum enroll        → TC-ENROLL-001
 *   P2 – Kode tidak ada di database                     → TC-ENROLL-002
 *   P3 – Kode valid tapi kelas visibility=false          → TC-ENROLL-003
 *   P4 – Kode valid tapi student sudah terdaftar         → TC-ENROLL-004
 *   P5 – Input kosong (empty string)                    → TC-ENROLL-006
 */
class EnrollmentEcpTest extends TestCase
{
    private EnrollmentRules $rules;

    protected function setUp(): void
    {
        parent::setUp();
        $this->rules = new EnrollmentRules;
    }

    /**
     * TC-ENROLL-001 [ECP P1] Kode valid, kelas visible, belum terdaftar → diterima.
     */
    public function test_tc_enroll_001_valid_code_public_class_not_enrolled_is_accepted(): void
    {
        $publicClass = new ClassModel(['visibility' => true]);

        $this->assertSame(
            ['allowed' => true, 'message' => EnrollmentRules::SUCCESS_ENROLLED],
            $this->rules->decide($publicClass, false)
        );
    }

    /**
     * TC-ENROLL-002 [ECP P2] Kode tidak ditemukan di database → ditolak.
     */
    public function test_tc_enroll_002_code_not_found_is_rejected(): void
    {
        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_NOT_FOUND],
            $this->rules->decide(null, false)
        );
    }

    /**
     * TC-ENROLL-003 [ECP P3] Kode valid tapi kelas visibility=false → ditolak.
     */
    public function test_tc_enroll_003_private_class_is_rejected(): void
    {
        $privateClass = new ClassModel(['visibility' => false]);

        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_PRIVATE],
            $this->rules->decide($privateClass, false)
        );
    }

    /**
     * TC-ENROLL-004 [ECP P4] Student sudah terdaftar (duplikat) → ditolak.
     */
    public function test_tc_enroll_004_duplicate_enrollment_is_rejected(): void
    {
        $publicClass = new ClassModel(['visibility' => true]);

        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_DUPLICATE],
            $this->rules->decide($publicClass, true)
        );
    }

    /**
     * TC-ENROLL-006 [ECP P5] Input enrollment_code kosong → validasi gagal.
     */
    public function test_tc_enroll_006_empty_code_fails_validation(): void
    {
        $validator = Validator::make(
            ['enrollment_code' => ''],
            ['enrollment_code' => EnrollmentRules::codeRules()],
            EnrollmentRules::codeMessages()
        );

        $this->assertTrue($validator->fails());
        $this->assertSame(
            EnrollmentRules::ERROR_REQUIRED,
            $validator->errors()->first('enrollment_code')
        );
    }
}
