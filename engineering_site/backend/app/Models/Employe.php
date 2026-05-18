<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Projet;

class Employe extends Model
{
    protected $table = 'employes';

    protected $primaryKey = 'id_employe';

    public $timestamps = false;

    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'role',
        'specialite',
        'date_embauche'
    ];

    public function projets()
    {
        return $this->hasMany(Projet::class,'id_employe');
    }
}