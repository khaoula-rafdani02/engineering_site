<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('employes')->insert([
            'nom'           => 'Admin',
            'email'         => 'admin@admin.com',
            'mot_de_passe'  => Hash::make('admin1234'),
            'role'          => 'Administrateur',
            'specialite'    => 'Administration',
            'date_embauche' => now()->toDateString(),
        ]);
    }
}