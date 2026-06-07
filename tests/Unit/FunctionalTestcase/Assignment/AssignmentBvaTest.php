<?php

namespace Tests\Unit\FunctionalTestcase\Assignment;

use App\Models\Assignment;
use App\Services\FunctionalTestcase\SubmissionRules;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

/**
 * Boundary Value Analysis (BVA) – FR-4 Assignment & Submission
 *
 * Berdasarkan Test Design Sheet:
 *   2.1 BVA File Size (1–2048 KB):
 *     TC-ASSIGN-001  0 KB    MIN-1 → DITOLAK
 *     TC-ASSIGN-002  1 KB    MIN   → DITERIMA
 *     TC-ASSIGN-003  2048 KB MAX   → DITERIMA
 *     TC-ASSIGN-004  2049 KB MAX+1 → DITOLAK
 *     TC-ASSIGN-005  JPG 500KB     → DITOLAK (tipe invalid)
 *
 *   2.2 BVA Grade (0–100):
 *     TC-ASSIGN-006  -1   MIN-1 → DITOLAK
 *     TC-ASSIGN-007   0   MIN   → DITERIMA
 *     TC-ASSIGN-008  100  MAX   → DITERIMA
 *     TC-ASSIGN-009  101  MAX+1 → DITOLAK
 *
 *   BVA Deadline:
 *     TC-ASSIGN-010  T-1 menit → berhasil
 *     TC-ASSIGN-011  T+1 menit → ditolak
 */
class AssignmentBvaTest extends TestCase
{
    // ──────────────────────────────────────────────
    //  FILE SIZE & TYPE  (TC-ASSIGN-001 s/d 005)
    // ──────────────────────────────────────────────

    /**
     * TC-ASSIGN-001 [BVA MIN-1] File 0 KB (di bawah batas minimum) → ditolak.
     */
    public function test_tc_assign_001_file_0kb_is_rejected(): void
    {
        $file = UploadedFile::fake()->create('submission.pdf', 0, 'application/pdf');
        $validator = $this->fileValidator($file);

        $this->assertTrue($validator->fails());
        $this->assertSame(SubmissionRules::ERROR_FILE_EMPTY, $validator->errors()->first('file'));
    }

    /**
     * TC-ASSIGN-002 [BVA MIN] File 1 KB+ (batas minimum valid) → diterima.
     */
    public function test_tc_assign_002_file_1kb_pdf_is_accepted(): void
    {
        $file = UploadedFile::fake()->create('submission.pdf', 2, 'application/pdf');
        $validator = $this->fileValidator($file);

        $this->assertTrue($validator->passes());
    }

    /**
     * TC-ASSIGN-003 [BVA MAX] File tepat 2048 KB (batas maksimum) → diterima.
     */
    public function test_tc_assign_003_file_2048kb_pdf_is_accepted(): void
    {
        $file = UploadedFile::fake()->create('submission.pdf', 2048, 'application/pdf');
        $validator = $this->fileValidator($file);

        $this->assertTrue($validator->passes());
    }

    /**
     * TC-ASSIGN-004 [BVA MAX+1] File 2049 KB (melewati batas atas) → ditolak.
     */
    public function test_tc_assign_004_file_2049kb_is_rejected(): void
    {
        $file = UploadedFile::fake()->create('submission.pdf', 2049, 'application/pdf');
        $validator = $this->fileValidator($file);

        $this->assertTrue($validator->fails());
        $this->assertSame(SubmissionRules::ERROR_FILE_MAX, $validator->errors()->first('file'));
    }

    /**
     * TC-ASSIGN-005 [BVA Tipe File Invalid] File JPG meski ukuran valid → ditolak.
     */
    public function test_tc_assign_005_jpg_file_is_rejected(): void
    {
        $file = UploadedFile::fake()->create('submission.jpg', 500, 'image/jpeg');
        $validator = $this->fileValidator($file);

        $this->assertTrue($validator->fails());
        $this->assertSame(SubmissionRules::ERROR_FILE_TYPE, $validator->errors()->first('file'));
    }

    // ──────────────────────────────────────────────
    //  GRADE  (TC-ASSIGN-006 s/d 009)
    // ──────────────────────────────────────────────

    /**
     * TC-ASSIGN-006 [BVA MIN-1] Grade -1 (di bawah batas minimum 0) → ditolak.
     */
    public function test_tc_assign_006_grade_minus1_is_rejected(): void
    {
        $validator = $this->gradeValidator(-1);

        $this->assertTrue($validator->fails());
        $this->assertSame(SubmissionRules::ERROR_GRADE_MIN, $validator->errors()->first('grade'));
    }

    /**
     * TC-ASSIGN-007 [BVA MIN] Grade 0 (batas minimum valid) → diterima.
     */
    public function test_tc_assign_007_grade_0_is_accepted(): void
    {
        $validator = $this->gradeValidator(0);

        $this->assertTrue($validator->passes());
    }

    /**
     * TC-ASSIGN-008 [BVA MAX] Grade 100 (batas maksimum valid) → diterima.
     */
    public function test_tc_assign_008_grade_100_is_accepted(): void
    {
        $validator = $this->gradeValidator(100);

        $this->assertTrue($validator->passes());
    }

    /**
     * TC-ASSIGN-009 [BVA MAX+1] Grade 101 (di atas batas maksimum) → ditolak.
     */
    public function test_tc_assign_009_grade_101_is_rejected(): void
    {
        $validator = $this->gradeValidator(101);

        $this->assertTrue($validator->fails());
        $this->assertSame(SubmissionRules::ERROR_GRADE_MAX, $validator->errors()->first('grade'));
    }

    // ──────────────────────────────────────────────
    //  DEADLINE  (TC-ASSIGN-010 & 011)
    // ──────────────────────────────────────────────

    /**
     * TC-ASSIGN-010 [BVA Waktu Batas Atas Valid] T-1 menit (sebelum deadline) → berhasil.
     */
    public function test_tc_assign_010_before_deadline_is_allowed(): void
    {
        $rules = new SubmissionRules;
        $now = Carbon::parse('2026-06-07 12:00:00');

        $assignment = new Assignment([
            'date_close' => '2026-06-07',
            'time_close' => '12:01:00',
        ]);

        $this->assertFalse($rules->isPastDeadline($assignment, $now));
    }

    /**
     * TC-ASSIGN-011 [BVA Waktu Melewati Batas] T+1 menit (setelah deadline) → ditolak.
     */
    public function test_tc_assign_011_after_deadline_is_rejected(): void
    {
        $rules = new SubmissionRules;
        $now = Carbon::parse('2026-06-07 12:00:00');

        $assignment = new Assignment([
            'date_close' => '2026-06-07',
            'time_close' => '11:59:00',
        ]);

        $this->assertTrue($rules->isPastDeadline($assignment, $now));
    }

    // ──────────────────────────────────────────────
    //  HELPERS
    // ──────────────────────────────────────────────

    private function fileValidator(UploadedFile $file): \Illuminate\Validation\Validator
    {
        return Validator::make(
            ['file' => $file],
            ['file' => SubmissionRules::fileRules()],
            SubmissionRules::fileMessages()
        );
    }

    private function gradeValidator(int|float $grade): \Illuminate\Validation\Validator
    {
        return Validator::make(
            ['grade' => $grade],
            SubmissionRules::gradeRules(),
            SubmissionRules::gradeMessages()
        );
    }
}
