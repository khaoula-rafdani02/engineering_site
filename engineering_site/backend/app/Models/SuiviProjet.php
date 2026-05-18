<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuiviProjet extends Model
{
    protected $table = 'suivi_projets';

    protected $fillable = [
        'id_projet',
        'id_employe',
        'localisation',
        'statut',
        'commentaire',
        'photos',
    ];

    protected $casts = [
        'photos' => 'array',
    ];

    public function projet()
    {
        return $this->belongsTo(Projet::class, 'id_projet');
    }

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'id_employe');
    }
}