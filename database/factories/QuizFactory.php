<?php

namespace Database\Factories;

use App\Models\ClassModel;
use App\Models\Quiz;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition()
    {
        $start = Carbon::now()->subDay();
        $end = Carbon::now()->addDay();

        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'class_id' => ClassModel::factory(),
            'open_datetime' => $start,
            'close_datetime' => $end,
            'time_limit_minutes' => 60,
            'status' => 'Diterbitkan',
            'attempts_allowed' => 1,
        ];
    }
}
