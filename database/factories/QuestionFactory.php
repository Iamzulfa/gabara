<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Question;
use App\Models\Quiz;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition()
    {
        return [
            'quiz_id' => Quiz::factory(),
            'question_text' => $this->faker->sentence(),
            'type' => 'pilihan_ganda',
            'options' => json_encode([
                ['text' => 'Option 1', 'is_correct' => false],
                ['text' => 'Option 2', 'is_correct' => true],
                ['text' => 'Option 3', 'is_correct' => false],
            ]),
        ];
    }
}
