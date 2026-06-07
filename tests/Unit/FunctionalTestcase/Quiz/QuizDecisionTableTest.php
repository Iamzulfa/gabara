<?php

namespace Tests\Unit\FunctionalTestcase\Quiz;

use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Services\FunctionalTestcase\QuizRules;
use Carbon\Carbon;
use Tests\TestCase;

class QuizDecisionTableTest extends TestCase
{
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
        ]), 'TC-QUIZ-007 semua jawaban benar menghasilkan skor 100');

        $this->assertEquals(0.0, $rules->scoreFor(collect([$questionA, $questionB]), [
            ['question_id' => 'q-a', 'answer_text' => 'A'],
            ['question_id' => 'q-b', 'answer_text' => 'False'],
        ]), 'TC-QUIZ-008 semua jawaban salah menghasilkan skor 0');

        $essay = $this->question('q-essay', 'esai', []);

        $this->assertNull($rules->scoreFor(collect([$essay]), [
            ['question_id' => 'q-essay', 'answer_text' => 'Jawaban esai siswa'],
        ]), 'TC-QUIZ-009 quiz esai menunggu penilaian manual');
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
