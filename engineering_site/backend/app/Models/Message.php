<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Client;

class Message extends Model
{

protected $table = 'messages';

protected $primaryKey = 'id_message';

public $timestamps = false;

protected $fillable = [
'nom',
'email',
'message',
'id_client',
'date_envoi',
'statut'
];

public function client()
{
return $this->belongsTo(Client::class,'id_client');
}

}