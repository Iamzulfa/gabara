<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Admin User',
                'phone' => '081234567891',
                'birthdate' => '2000-01-01',
                'gender' => 'Laki-laki',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'avatar' => null,
            ]
        );

        $admin->assignRole('admin');

        // Mentor
        $mentor = User::updateOrCreate(
            ['email' => 'mentor@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Mentor User',
                'phone' => '081234567892',
                'birthdate' => '2000-01-01',
                'gender' => 'Perempuan',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'mentor',
                'avatar' => null,
            ]
        );

        $mentor->assignRole('mentor');

        // Student
        $student = User::updateOrCreate(
            ['email' => 'student@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Student User',
                'phone' => '081234567893',
                'birthdate' => '2000-01-01',
                'gender' => 'Perempuan',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'student',
                'avatar' => null,
            ]
        );

        $student->assignRole('student');
    }
}
