<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition()
    {
        return [
            'quiz_id' => Quiz::factory(),
            'question_text' => $this->faker->sentence(),
            'type' => 'pilihan_ganda',
            'options' => [
                ['text' => 'Option 1', 'is_correct' => false],
                ['text' => 'Option 2', 'is_correct' => true],
                ['text' => 'Option 3', 'is_correct' => false],
            ],
        ];
    }
}
