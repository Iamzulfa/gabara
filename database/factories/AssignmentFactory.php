<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentFactory extends Factory
{
    protected $model = Assignment::class;

    public function definition(): array
    {
        return [
            'meeting_id' => Meeting::factory(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'date_open' => now()->subDay()->toDateString(),
            'time_open' => '00:00',
            'date_close' => now()->addDay()->toDateString(),
            'time_close' => '23:59',
            'file_link' => null,
        ];
    }
}
