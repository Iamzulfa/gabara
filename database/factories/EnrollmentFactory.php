<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Enrollment;
use App\Models\ClassModel;
use App\Models\User;

class EnrollmentFactory extends Factory
{
    protected $model = Enrollment::class;

    public function definition()
    {
        return [
            'class_id' => ClassModel::factory(),
            'student_id' => User::factory()->create(['role' => 'student'])->id,
        ];
    }
}
