<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Discussion;
use App\Models\ClassModel;
use App\Models\User;

class DiscussionFactory extends Factory
{
    protected $model = Discussion::class;

    public function definition()
    {
        return [
            'class_id' => ClassModel::factory(),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['open', 'closed']),
            'opener_student_id' => User::factory()->create(['role' => 'student'])->id,
        ];
    }

    public function open()
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
        ]);
    }

    public function closed()
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed',
        ]);
    }
}
