<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Projet;

class Employe extends Authenticatable  // ← مو Model
{
    use HasApiTokens, HasFactory;      // ← زيد HasApiTokens

    protected $table = 'employes';
    protected $primaryKey = 'id_employe';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'role',
        'specialite',
        'date_embauche',
    ];

    // نخبيو mot_de_passe من الـ JSON response
    protected $hidden = [
        'mot_de_passe',
    ];

    public function projets()
    {
        return $this->hasMany(Projet::class, 'id_employe');
    }
}