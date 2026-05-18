<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Client;
use App\Models\Employe;

class Projet extends Model
{
    protected $primaryKey = 'id_projet';

    public $timestamps = false;

protected $fillable = [
    'nom_projet',
    'description',
    'date_debut',
    'date_cloture',    
    'maitre_ouvrage',
    'indemnite',
    'id_client',
    'id_employe',
    'statut',
    'localisation', // ← زيد هادي
];
    public function client()
    {
        return $this->belongsTo(Client::class, 'id_client');
    }

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'id_employe');
    }
    
    public function documents()
{
    return $this->hasMany(Document::class,'id_projet');
}
}