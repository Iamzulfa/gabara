<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\QuizAttempt;
use App\Models\Quiz;
use App\Models\User;
use Carbon\Carbon;

class QuizAttemptFactory extends Factory
{
    protected $model = QuizAttempt::class;

    public function definition()
    {
        return [
            'quiz_id' => Quiz::factory(),
            'student_id' => User::factory()->create(['role' => 'student'])->id,
            'started_at' => Carbon::now(),
            'finished_at' => null,
            'score' => null,
        ];
    }
}
