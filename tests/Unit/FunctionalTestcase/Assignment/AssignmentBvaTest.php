<?php

namespace Tests\Unit\FunctionalTestcase\Assignment;

use App\Models\Assignment;
use App\Services\FunctionalTestcase\SubmissionRules;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class AssignmentBvaTest extends TestCase
{
    public function test_assignment_file_size_and_type_bva_rules_follow_tc_assign_001_until_005(): void
    {
        $cases = [
            'TC-ASSIGN-001 file 0 KB ditolak' => [
                UploadedFile::fake()->create('submission.pdf', 0, 'application/pdf'),
                false,
                SubmissionRules::ERROR_FILE_EMPTY,
            ],
            'TC-ASSIGN-002 file lebih dari 1 KB valid' => [
                UploadedFile::fake()->create('submission.pdf', 2, 'application/pdf'),
                true,
                null,
            ],
            'TC-ASSIGN-003 file tepat 2048 KB valid' => [
                UploadedFile::fake()->create('submission.pdf', 2048, 'application/pdf'),
                true,
                null,
            ],
            'TC-ASSIGN-004 file 2049 KB ditolak' => [
                UploadedFile::fake()->create('submission.pdf', 2049, 'application/pdf'),
                false,
                SubmissionRules::ERROR_FILE_MAX,
            ],
            'TC-ASSIGN-005 JPG ditolak' => [
                UploadedFile::fake()->create('submission.jpg', 500, 'image/jpeg'),
                false,
                SubmissionRules::ERROR_FILE_TYPE,
            ],
        ];

        foreach ($cases as $label => [$file, $shouldPass, $expectedError]) {
            $validator = Validator::make(
                ['file' => $file],
                ['file' => SubmissionRules::fileRules()],
                SubmissionRules::fileMessages()
            );

            $this->assertSame($shouldPass, $validator->passes(), $label);

            if (! $shouldPass) {
                $this->assertSame($expectedError, $validator->errors()->first('file'), $label);
            }
        }
    }

    public function test_assignment_grade_bva_rules_follow_tc_assign_006_until_009(): void
    {
        $cases = [
            'TC-ASSIGN-006 nilai -1 ditolak' => [-1, false, SubmissionRules::ERROR_GRADE_MIN],
            'TC-ASSIGN-007 nilai 0 valid' => [0, true, null],
            'TC-ASSIGN-008 nilai 100 valid' => [100, true, null],
            'TC-ASSIGN-009 nilai 101 ditolak' => [101, false, SubmissionRules::ERROR_GRADE_MAX],
        ];

        foreach ($cases as $label => [$grade, $shouldPass, $expectedError]) {
            $validator = Validator::make(
                ['grade' => $grade],
                SubmissionRules::gradeRules(),
                SubmissionRules::gradeMessages()
            );

            $this->assertSame($shouldPass, $validator->passes(), $label);

            if (! $shouldPass) {
                $this->assertSame($expectedError, $validator->errors()->first('grade'), $label);
            }
        }
    }

    public function test_assignment_deadline_bva_rules_follow_tc_assign_010_and_011(): void
    {
        $rules = new SubmissionRules;
        $now = Carbon::parse('2026-06-07 12:00:00');

        $beforeDeadline = new Assignment([
            'date_close' => '2026-06-07',
            'time_close' => '12:01:00',
        ]);

        $afterDeadline = new Assignment([
            'date_close' => '2026-06-07',
            'time_close' => '11:59:00',
        ]);

        $this->assertFalse($rules->isPastDeadline($beforeDeadline, $now), 'TC-ASSIGN-010 T-1 menit masih valid');
        $this->assertTrue($rules->isPastDeadline($afterDeadline, $now), 'TC-ASSIGN-011 T+1 menit ditolak');
    }
}
