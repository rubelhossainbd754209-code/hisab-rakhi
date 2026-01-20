<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'rubel820746@gmail.com'],
            [
                'name' => 'Super Admin',
                'email' => 'rubel820746@gmail.com',
                'password' => Hash::make('82074682Rr'),
                'role' => 'super_admin',
                'is_approved' => true,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
