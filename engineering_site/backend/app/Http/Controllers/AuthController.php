<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employe;
use App\Models\Client;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $email = $request->email;
        $password = $request->mot_de_passe;

        $user = Employe::where('email', $email)->first();
        $role = $user ? $user->role : null;

       
        if (!$user) {
            $user = Client::where('email', $email)->first();
            $role = $user ? 'client' : null;
        }

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Email incorrect"
            ]);
        }

        if ($user->mot_de_passe != $password) {
            return response()->json([
                "success" => false,
                "message" => "Mot de passe incorrect"
            ]);
        }

        return response()->json([
            "success" => true,
            "user" => $user,
            "role" => $role
        ]);
    }

}