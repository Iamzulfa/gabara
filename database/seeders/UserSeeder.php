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

        // Mentor 1
        $mentor1 = User::updateOrCreate(
            ['email' => 'mentor1@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Aditya Pratama',
                'phone' => '081234567892',
                'birthdate' => '2000-01-01',
                'gender' => 'Laki-laki',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'mentor',
                'avatar' => null,
            ]
        );

        $mentor1->assignRole('mentor');

        // Mentor 2
        $mentor2 = User::updateOrCreate(
            ['email' => 'mentor2@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Ayu Lestari',
                'phone' => '081234567893',
                'birthdate' => '2000-01-01',
                'gender' => 'Perempuan',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'mentor',
                'avatar' => null,
            ]
        );

        $mentor2->assignRole('mentor');

        // Student 1
        $student1 = User::updateOrCreate(
            ['email' => 'student1@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Gilang Permana',
                'phone' => '081234567894',
                'birthdate' => '2000-01-01',
                'gender' => 'Laki-laki',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'student',
                'avatar' => null,
            ]
        );

        $student1->assignRole('student');

        // Student 2
        $student2 = User::updateOrCreate(
            ['email' => 'student2@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Dian Maharani',
                'phone' => '081234567895',
                'birthdate' => '2000-01-01',
                'gender' => 'Perempuan',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'student',
                'avatar' => null,
            ]
        );

        $student2->assignRole('student');

        // Student 3
        $student3 = User::updateOrCreate(
            ['email' => 'student3@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Fajar Nugroho',
                'phone' => '081234567896',
                'birthdate' => '2000-01-01',
                'gender' => 'Laki-laki',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'student',
                'avatar' => null,
            ]
        );

        $student3->assignRole('student');

        // Student 4
        $student4 = User::updateOrCreate(
            ['email' => 'student4@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Melati Kusuma',
                'phone' => '081234567897',
                'birthdate' => '2000-01-01',
                'gender' => 'Perempuan',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'student',
                'avatar' => null,
            ]
        );

        $student4->assignRole('student');
    }
}
