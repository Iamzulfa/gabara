<?php

namespace Tests\Unit;

use App\Models\Assignment;
use App\Models\ClassModel;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Services\FunctionalTestcase\EnrollmentRules;
use App\Services\FunctionalTestcase\QuizRules;
use App\Services\FunctionalTestcase\SubmissionRules;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class LegacyFunctionalTestcaseRulesTest extends TestCase
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

        $this->assertTrue($emptyCode->fails());
        $this->assertSame(EnrollmentRules::ERROR_REQUIRED, $emptyCode->errors()->first('enrollment_code'));

        $this->assertSame(
            ['allowed' => true, 'message' => EnrollmentRules::SUCCESS_ENROLLED],
            $rules->decide($publicClass, false)
        );

        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_NOT_FOUND],
            $rules->decide(null, false)
        );

        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_PRIVATE],
            $rules->decide($privateClass, false)
        );

        $this->assertSame(
            ['allowed' => false, 'message' => EnrollmentRules::ERROR_DUPLICATE],
            $rules->decide($publicClass, true)
        );
    }

    public function test_assignment_file_bva_rules_follow_tc_assign_001_until_005(): void
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

        $this->assertFalse($rules->isPastDeadline($beforeDeadline, $now));
        $this->assertTrue($rules->isPastDeadline($afterDeadline, $now));
    }

    public function test_quiz_decision_table_rules_follow_tc_quiz_001_until_006(): void
    {
        $rules = new QuizRules;
        $now = Carbon::parse('2026-06-07 12:00:00');

        $publishedQuiz = new Quiz([
            'status' => 'Diterbitkan',
            'open_datetime' => '2026-06-07 11:00:00',
            'close_datetime' => '2026-06-07 13:00:00',
            'attempts_allowed' => 3,
        ]);

        $this->assertSame(
            QuizRules::ACTION_START,
            $rules->startDecision($publishedQuiz, true, true, null, 0, $now)['action'],
            'TC-QUIZ-001 semua kondisi terpenuhi membuat attempt baru'
        );

        $draftQuiz = $publishedQuiz->replicate()->forceFill(['status' => 'Draf']);
        $this->assertSame(
            QuizRules::ERROR_DRAFT,
            $rules->startDecision($draftQuiz, true, true, null, 0, $now)['message'],
            'TC-QUIZ-002 status Draf ditolak'
        );

        $futureQuiz = $publishedQuiz->replicate()->forceFill([
            'open_datetime' => '2026-06-07 12:01:00',
            'close_datetime' => '2026-06-07 13:00:00',
        ]);
        $this->assertSame(
            QuizRules::ERROR_NOT_OPEN,
            $rules->startDecision($futureQuiz, true, true, null, 0, $now)['message'],
            'TC-QUIZ-003 belum masuk open_datetime ditolak'
        );

        $closedQuiz = $publishedQuiz->replicate()->forceFill([
            'open_datetime' => '2026-06-07 10:00:00',
            'close_datetime' => '2026-06-07 11:59:00',
        ]);
        $this->assertSame(
            QuizRules::ERROR_CLOSED,
            $rules->startDecision($closedQuiz, true, true, null, 0, $now)['message'],
            'TC-QUIZ-004 melewati close_datetime ditolak'
        );

        $maxAttemptQuiz = $publishedQuiz->replicate()->forceFill(['attempts_allowed' => 2]);
        $this->assertSame(
            QuizRules::ERROR_MAX_ATTEMPT,
            $rules->startDecision($maxAttemptQuiz, true, true, null, 2, $now)['message'],
            'TC-QUIZ-005 attempt habis ditolak'
        );

        $activeAttempt = new QuizAttempt(['status' => 'in_progress']);
        $activeAttempt->id = 'attempt-in-progress';

        $this->assertSame(
            QuizRules::ACTION_RESUME,
            $rules->startDecision($publishedQuiz, true, true, $activeAttempt, 0, $now)['action'],
            'TC-QUIZ-006 attempt in_progress dilanjutkan'
        );
    }

    public function test_quiz_scoring_rules_follow_tc_quiz_007_until_009(): void
    {
        $rules = new QuizRules;

        $questionA = $this->question('q-a', 'pilihan_ganda', [
            ['text' => 'A', 'is_correct' => false],
            ['text' => 'B', 'is_correct' => true],
        ]);

        $questionB = $this->question('q-b', 'benar_salah', [
            ['text' => 'True', 'is_correct' => true],
            ['text' => 'False', 'is_correct' => false],
        ]);

        $this->assertEquals(100.0, $rules->scoreFor(collect([$questionA, $questionB]), [
            ['question_id' => 'q-a', 'answer_text' => 'B'],
            ['question_id' => 'q-b', 'answer_text' => 'True'],
        ]));

        $this->assertEquals(0.0, $rules->scoreFor(collect([$questionA, $questionB]), [
            ['question_id' => 'q-a', 'answer_text' => 'A'],
            ['question_id' => 'q-b', 'answer_text' => 'False'],
        ]));

        $essay = $this->question('q-essay', 'esai', []);

        $this->assertNull($rules->scoreFor(collect([$essay]), [
            ['question_id' => 'q-essay', 'answer_text' => 'Jawaban esai siswa'],
        ]));
    }

    private function question(string $id, string $type, array $options): Question
    {
        $question = new Question([
            'question_text' => 'Pertanyaan '.$id,
            'type' => $type,
            'options' => $options,
        ]);
        $question->id = $id;

        return $question;
    }
}
