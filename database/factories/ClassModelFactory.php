<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ClassModel;
use App\Models\User;
use Illuminate\Support\Str;

class ClassModelFactory extends Factory
{
    protected $model = ClassModel::class;

    public function definition()
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'enrollment_code' => Str::upper(Str::random(8)),
            'academic_year_tag' => '2024/2025',
            'mentor_id' => User::factory()->create(['role' => 'mentor'])->id,
            'visibility' => true,
            'public_id' => Str::uuid(),
            'thumbnail' => null,
        ];
    }
}
