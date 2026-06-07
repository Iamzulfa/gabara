<?php

namespace Tests\Unit\FunctionalTestcase\Enrollment;

use App\Models\ClassModel;
use App\Services\FunctionalTestcase\EnrollmentRules;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class EnrollmentEcpTest extends TestCase
{
    public function test_enrollment_ecp_rules_follow_tc_enroll_001_until_005(): void
    {
        $rules = new EnrollmentRules;
        $publicClass = new ClassModel(['visibility' => true]);
        $privateClass = new ClassModel(['visibility' => false]);

        $emptyCode = Validator::make(
            ['enrollment_code' => ''],
            ['enrollment_code' => EnrollmentRules::codeRules()],
            EnrollmentRules::codeMessages()
        );

        $this->assertTrue($emptyCode->fails(), 'TC-ENROLL-005 kode kosong ditolak');
        $this->assertSame(EnrollmentRules::ERROR_REQUIRED, $emptyCode->errors()->first('enrollment_code'));

        $this->assertSame(
            ['allowed' => true, 'message' => EnrollmentRules::SUCCESS_ENROLLED],
            $rules->decide($publicClass, false),
            'TC-ENROLL-001 kode valid, kelas visible, belum enroll diterima'
        );

        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_NOT_FOUND],
            $rules->decide(null, false),
            'TC-ENROLL-002 kode tidak ditemukan ditolak'
        );

        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_PRIVATE],
            $rules->decide($privateClass, false),
            'TC-ENROLL-003 kelas privat ditolak'
        );

        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_DUPLICATE],
            $rules->decide($publicClass, true),
            'TC-ENROLL-004 enrollment duplikat ditolak'
        );
    }
}
