<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Answer;
use App\Models\QuizAttempt;
use App\Models\Question;

class AnswerFactory extends Factory
{
    protected $model = Answer::class;

    public function definition()
    {
        return [
            'attempt_id' => QuizAttempt::factory(),
            'question_id' => Question::factory(),
            'answer_text' => 'Option 2',
        ];
    }
}
