<?php

namespace Tests\Unit\FunctionalTestcase;

use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Services\FunctionalTestcase\QuizRules;
use Carbon\Carbon;
use Tests\TestCase;

/**
 * Whitebox Test – FR-5 Quiz Attempt
 *
 * Menguji semua cabang internal QuizRules::startDecision()
 * dan QuizRules::scoreFor() berdasarkan TC-QUIZ-001 s/d 009.
 */
class WhiteboxTest extends TestCase
{
    private QuizRules $rules;

    private Carbon $now;

    private Quiz $publishedQuiz;

    protected function setUp(): void
    {
        parent::setUp();

        $this->rules = new QuizRules;
        $this->now = Carbon::parse('2026-06-07 12:00:00');

        $this->publishedQuiz = new Quiz([
            'status' => 'Diterbitkan',
            'open_datetime' => '2026-06-07 11:00:00',
            'close_datetime' => '2026-06-07 13:00:00',
            'attempts_allowed' => 3,
        ]);
    }

    // ──────────────────────────────────────────────
    //  QUIZ ATTEMPT BRANCHES  (TC-QUIZ-001 s/d 006)
    // ──────────────────────────────────────────────

    /**
     * TC-QUIZ-001 [WBT] Semua kondisi terpenuhi → action=start.
     */
    public function test_tc_quiz_001_all_conditions_met_creates_new_attempt(): void
    {
        $decision = $this->rules->startDecision($this->publishedQuiz, true, true, null, 0, $this->now);

        $this->assertTrue($decision['allowed']);
        $this->assertSame(QuizRules::ACTION_START, $decision['action']);
    }

    /**
     * TC-QUIZ-002 [WBT] Status Draf → cabang status ditolak.
     */
    public function test_tc_quiz_002_draft_status_is_rejected(): void
    {
        $draftQuiz = $this->publishedQuiz->replicate()->forceFill(['status' => 'Draf']);
        $decision = $this->rules->startDecision($draftQuiz, true, true, null, 0, $this->now);

        $this->assertFalse($decision['allowed']);
        $this->assertSame(QuizRules::ERROR_DRAFT, $decision['message']);
    }

    /**
     * TC-QUIZ-003 [WBT] Belum masuk open_datetime → cabang waktu ditolak.
     */
    public function test_tc_quiz_003_before_open_datetime_is_rejected(): void
    {
        $futureQuiz = $this->publishedQuiz->replicate()->forceFill([
            'open_datetime' => '2026-06-07 12:01:00',
            'close_datetime' => '2026-06-07 13:00:00',
        ]);
        $decision = $this->rules->startDecision($futureQuiz, true, true, null, 0, $this->now);

        $this->assertFalse($decision['allowed']);
        $this->assertSame(QuizRules::ERROR_NOT_OPEN, $decision['message']);
    }

    /**
     * TC-QUIZ-004 [WBT] Melewati close_datetime → cabang waktu ditolak.
     */
    public function test_tc_quiz_004_after_close_datetime_is_rejected(): void
    {
        $closedQuiz = $this->publishedQuiz->replicate()->forceFill([
            'open_datetime' => '2026-06-07 10:00:00',
            'close_datetime' => '2026-06-07 11:59:00',
        ]);
        $decision = $this->rules->startDecision($closedQuiz, true, true, null, 0, $this->now);

        $this->assertFalse($decision['allowed']);
        $this->assertSame(QuizRules::ERROR_CLOSED, $decision['message']);
    }

    /**
     * TC-QUIZ-005 [WBT] Attempt habis → cabang limit ditolak.
     */
    public function test_tc_quiz_005_max_attempts_reached_is_rejected(): void
    {
        $maxAttemptQuiz = $this->publishedQuiz->replicate()->forceFill(['attempts_allowed' => 2]);
        $decision = $this->rules->startDecision($maxAttemptQuiz, true, true, null, 2, $this->now);

        $this->assertFalse($decision['allowed']);
        $this->assertSame(QuizRules::ERROR_MAX_ATTEMPT, $decision['message']);
    }

    /**
     * TC-QUIZ-006 [WBT] Attempt in_progress → cabang resume.
     */
    public function test_tc_quiz_006_in_progress_attempt_is_resumed(): void
    {
        $activeAttempt = new QuizAttempt(['status' => 'in_progress']);
        $activeAttempt->id = 'attempt-in-progress';

        $decision = $this->rules->startDecision($this->publishedQuiz, true, true, $activeAttempt, 0, $this->now);

        $this->assertTrue($decision['allowed']);
        $this->assertSame(QuizRules::ACTION_RESUME, $decision['action']);
    }

    // ──────────────────────────────────────────────
    //  AUTO-GRADING BRANCHES  (TC-QUIZ-007 s/d 009)
    // ──────────────────────────────────────────────

    /**
     * TC-QUIZ-007 [WBT] Semua benar → cabang correct, score=100.
     */
    public function test_tc_quiz_007_all_correct_answers_score_100(): void
    {
        $questions = collect([
            $this->question('q-a', 'pilihan_ganda', [
                ['text' => 'A', 'is_correct' => false],
                ['text' => 'B', 'is_correct' => true],
            ]),
            $this->question('q-b', 'benar_salah', [
                ['text' => 'True', 'is_correct' => true],
                ['text' => 'False', 'is_correct' => false],
            ]),
        ]);

        $score = $this->rules->scoreFor($questions, [
            ['question_id' => 'q-a', 'answer_text' => 'B'],
            ['question_id' => 'q-b', 'answer_text' => 'True'],
        ]);

        $this->assertEquals(100.0, $score);
    }

    /**
     * TC-QUIZ-008 [WBT] Semua salah → cabang incorrect, score=0.
     */
    public function test_tc_quiz_008_all_wrong_answers_score_0(): void
    {
        $questions = collect([
            $this->question('q-a', 'pilihan_ganda', [
                ['text' => 'A', 'is_correct' => false],
                ['text' => 'B', 'is_correct' => true],
            ]),
            $this->question('q-b', 'benar_salah', [
                ['text' => 'True', 'is_correct' => true],
                ['text' => 'False', 'is_correct' => false],
            ]),
        ]);

        $score = $this->rules->scoreFor($questions, [
            ['question_id' => 'q-a', 'answer_text' => 'A'],
            ['question_id' => 'q-b', 'answer_text' => 'False'],
        ]);

        $this->assertEquals(0.0, $score);
    }

    /**
     * TC-QUIZ-009 [WBT] Soal esai → cabang skip, score=null.
     */
    public function test_tc_quiz_009_essay_question_score_is_null(): void
    {
        $essay = $this->question('q-essay', 'esai', []);

        $score = $this->rules->scoreFor(collect([$essay]), [
            ['question_id' => 'q-essay', 'answer_text' => 'Jawaban esai siswa'],
        ]);

        $this->assertNull($score);
    }

    // ──────────────────────────────────────────────
    //  HELPER
    // ──────────────────────────────────────────────

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
