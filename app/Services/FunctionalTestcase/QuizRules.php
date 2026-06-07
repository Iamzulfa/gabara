<?php

namespace App\Services\FunctionalTestcase;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class QuizRules
{
    public const ERROR_NOT_ENROLLED = 'Anda tidak terdaftar di kelas ini.';

    public const ERROR_CLASS_MISMATCH = 'Kuis tidak ditemukan di kelas ini.';

    public const ERROR_DRAFT = 'Kuis ini belum tersedia.';

    public const ERROR_NOT_OPEN = 'Tidak bisa memulai';

    public const ERROR_CLOSED = 'Quiz sudah ditutup';

    public const ERROR_MAX_ATTEMPT = 'Anda telah mencapai batas maksimum pengerjaan quiz';

    public const ACTION_START = 'start';

    public const ACTION_RESUME = 'resume';

    public const ACTION_DENY = 'deny';

    public static function completedStatuses(): array
    {
        return ['finished', 'completed'];
    }

    public function completedAttemptCount(Quiz $quiz, string $studentId): int
    {
        return $quiz->quizAttempts()
            ->where('student_id', $studentId)
            ->whereIn('status', self::completedStatuses())
            ->count();
    }

    public function activeAttempt(Quiz $quiz, string $studentId): ?QuizAttempt
    {
        return $quiz->quizAttempts()
            ->where('student_id', $studentId)
            ->where('status', 'in_progress')
            ->latest('created_at')
            ->first();
    }

    public function startDecision(
        Quiz $quiz,
        bool $isEnrolled,
        bool $quizBelongsToClass,
        ?QuizAttempt $activeAttempt,
        int $completedAttemptCount,
        ?CarbonInterface $now = null
    ): array {
        $now ??= now();

        if (! $isEnrolled) {
            return $this->deny('authorization', self::ERROR_NOT_ENROLLED);
        }

        if (! $quizBelongsToClass) {
            return $this->deny('quiz', self::ERROR_CLASS_MISMATCH);
        }

        if ($quiz->status !== 'Diterbitkan') {
            return $this->deny('quiz', self::ERROR_DRAFT);
        }

        if ($activeAttempt) {
            return [
                'allowed' => true,
                'action' => self::ACTION_RESUME,
                'attempt' => $activeAttempt,
                'key' => null,
                'message' => null,
            ];
        }

        if ($quiz->open_datetime && $now->isBefore($quiz->open_datetime)) {
            return $this->deny('quiz', self::ERROR_NOT_OPEN);
        }

        if ($quiz->close_datetime && $now->isAfter($quiz->close_datetime)) {
            return $this->deny('quiz', self::ERROR_CLOSED);
        }

        if ($quiz->attempts_allowed > 0 && $completedAttemptCount >= $quiz->attempts_allowed) {
            return $this->deny('quiz', self::ERROR_MAX_ATTEMPT);
        }

        return [
            'allowed' => true,
            'action' => self::ACTION_START,
            'attempt' => null,
            'key' => null,
            'message' => null,
        ];
    }

    public function scoreFor(Collection $questions, array $answers): ?float
    {
        $correctCount = 0;
        $countableQuestions = 0;
        $answerCollection = collect($answers);

        foreach ($questions as $question) {
            if ($question->type === 'esai' || empty($question->options)) {
                continue;
            }

            $correctOption = collect($question->options)->firstWhere('is_correct', true);
            if (! $correctOption) {
                continue;
            }

            $countableQuestions++;
            $submitted = $answerCollection->firstWhere('question_id', (string) $question->id);
            $answerText = data_get($submitted, 'answer_text', '');

            if ($answerText === null) {
                $answerText = '';
            }

            $normalizedCorrect = strtolower(trim($correctOption['text']));
            $normalizedAnswer = strtolower(trim($answerText));

            if ($answerText !== '' && $normalizedCorrect === $normalizedAnswer) {
                $correctCount++;
            }
        }

        return $countableQuestions > 0
            ? round(($correctCount / $countableQuestions) * 100, 2)
            : null;
    }

    private function deny(string $key, string $message): array
    {
        return [
            'allowed' => false,
            'action' => self::ACTION_DENY,
            'attempt' => null,
            'key' => $key,
            'message' => $message,
        ];
    }
}
