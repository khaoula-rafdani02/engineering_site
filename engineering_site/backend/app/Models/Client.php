<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = "clients";
    
    protected $primaryKey = 'id_client';

    public $timestamps = false;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'mot_de_passe'
    ];
    public function projets()
{
    return $this->hasMany(Projet::class, 'id_client');
}
public function messages()
{
return $this->hasMany(Message::class,'id_client');
}
}
