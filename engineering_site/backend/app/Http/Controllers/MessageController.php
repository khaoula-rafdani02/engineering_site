<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
  
    public function index()
    {
        return response()->json(Message::all());
    }

 
    public function store(Request $request)
    {
        $message = Message::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'message' => $request->message,
            'id_client' => $request->id_client ?? null,
            'date_envoi' => now(),
            'statut' => $request->statut ?? 'Nouveau'
        ]);

        return response()->json($message, 201);
    }

 
    public function show($id)
    {
        return response()->json(['message' => 'Non autorisé'], 403);
    }

 
    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'Modification non autorisée'], 403);
    }

 
    public function destroy($id)
    {
        return response()->json(['message' => 'Suppression non autorisée'], 403);
    }
}