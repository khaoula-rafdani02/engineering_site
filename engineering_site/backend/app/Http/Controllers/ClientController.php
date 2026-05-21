<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::all());
    }

    public function store(Request $request)
    {
        $client = Client::create([
            'nom'          => $request->nom,
            'email'        => $request->email,
            'telephone'    => $request->telephone,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
        ]);

        return response()->json($client, 201);
    }

    public function show($id)
    {
        $client = Client::findOrFail($id);
        return response()->json($client);
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $data = [
            'nom'       => $request->nom,
            'email'     => $request->email,
            'telephone' => $request->telephone,
        ];

        if ($request->filled('mot_de_passe')) {
            $data['mot_de_passe'] = Hash::make($request->mot_de_passe);
        }

        $client->update($data);
        return response()->json($client);
    }

    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();
        return response()->json(['message' => 'Client supprimé']);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'          => 'required|string',
            'email'        => 'required|email|unique:clients,email',
            'telephone'    => 'required|string',
            'mot_de_passe' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $client = Client::create([
            'nom'          => $request->nom,
            'email'        => $request->email,
            'telephone'    => $request->telephone,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
        ]);

        return response()->json(['message' => 'Inscription réussie !', 'client' => $client], 201);
    }
}