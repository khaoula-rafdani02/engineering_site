<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Projet;

class Document extends Model
{
    protected $primaryKey = 'id_document';

    public $timestamps = false;

    protected $fillable = [
        'fichier',
        'id_projet',
        'date_upload',
        'type_document'
    ];

    public function projet()
    {
        return $this->belongsTo(Projet::class,'id_projet');
    }
}