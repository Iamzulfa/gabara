<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // Permissions
        Permission::firstOrCreate(['name' => 'view dashboard']);
        Permission::firstOrCreate(['name' => 'manage users']);

        // Roles
        $admin   = Role::firstOrCreate(['name' => 'admin']);
        $mentor  = Role::firstOrCreate(['name' => 'mentor']);
        $student = Role::firstOrCreate(['name' => 'student']);

        // Grant permissions
        $admin->givePermissionTo(['view dashboard', 'manage users']);
        $mentor->givePermissionTo(['view dashboard']);
        $student->givePermissionTo(['view dashboard']);
    }
}
