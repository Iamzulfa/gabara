<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Quiz;
use App\Models\ClassModel;
use Illuminate\Support\Str;
use Carbon\Carbon;

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
            'status' => 'active',
        ];
    }
}
