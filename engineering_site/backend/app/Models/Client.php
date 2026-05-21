<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Projet;
use App\Models\Message;

class Client extends Authenticatable  
{
    use HasApiTokens, HasFactory;    

    protected $table = 'clients';
    protected $primaryKey = 'id_client';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'mot_de_passe',
    ];

    // ← زيد هاد باش ما يتبعتش password فـ responses
    protected $hidden = [
        'mot_de_passe',
    ];

    public function projets()
    {
        return $this->hasMany(Projet::class, 'id_client');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'id_client');
    }
}