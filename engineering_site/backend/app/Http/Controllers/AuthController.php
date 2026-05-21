<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Employe;
use App\Models\Client;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'        => 'required|email',
            'mot_de_passe' => 'required|string',
        ]);

        $user = Employe::where('email', $request->email)->first();
        $role = $user?->role;

        if (!$user) {
            $user = Client::where('email', $request->email)->first();
            $role = $user ? 'client' : null;
        }

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email incorrect',
            ], 401);
        }

        if (!Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe incorrect',
            ], 401);
        }

        // ← حذف كل les tokens القديمين قبل ما نولدو واحد جديد
        $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'role'    => $role,
            'user'    => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnecté avec succès',
        ]);
    }
}