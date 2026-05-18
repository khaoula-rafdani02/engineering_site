<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Projet;

class ProjetController extends Controller
{
    // afficher projets
public function index(Request $request)
{
    $id_employe = $request->id_employe;
    $role = $request->role;

   
    if (!$role && !$id_employe) {
        $projets = Projet::with('client', 'employe')->get();
        return response()->json($projets);
    }

    if ($role === "Administrateur") {
        $projets = Projet::with('client', 'employe')->get();
    } else {
        $projets = Projet::with('client', 'employe')
            ->where('id_employe', $id_employe)
            ->get();
    }

    return response()->json($projets);
}

    // afficher projet
    public function show($id)
    {
        $projet = Projet::with('client', 'employe')
            ->where('id_projet', $id)
            ->first();

        if (!$projet) {
            return response()->json([
                'message' => 'Projet introuvable'
            ], 404);
        }

        return response()->json($projet);
    }

    // ajouter projet
   public function store(Request $request)
{
    try {
        $projet = Projet::create([
            'nom_projet'     => $request->nom_projet,
            'description'    => $request->description,
            'date_debut'     => $request->date_debut,
            'date_cloture'   => $request->date_cloture,
            'maitre_ouvrage' => $request->maitre_ouvrage,
            'indemnite'      => $request->indemnite,
            'id_client'      => $request->id_client,
            'id_employe'     => $request->id_employe,
            'statut'         => $request->statut,
            'localisation'   => $request->localisation,
        ]);

        return response()->json(['message' => 'Projet ajouté', 'projet' => $projet]);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    // modifier projet
    public function update(Request $request, $id)
    {
        $projet = Projet::where('id_projet', $id)->first();

        if (!$projet) {
            return response()->json([
                'message' => 'Projet introuvable'
            ], 404);
        }

        $projet->update([
            'nom_projet'     => $request->nom_projet,
            'description'    => $request->description,
            'date_debut'     => $request->date_debut,
            'date_cloture'   => $request->date_cloture,
            'maitre_ouvrage' => $request->maitre_ouvrage,
            'indemnite'      => $request->indemnite,
            'id_client'      => $request->id_client,
            'id_employe'     => $request->id_employe,
            'statut'         => $request->statut,
            'localisation'   => $request->localisation,
        ]);

        return response()->json([
            'message' => 'Projet modifié',
            'projet'  => $projet
        ]);
    }

    // supprimer projet
    public function destroy($id)
    {
        $projet = Projet::where('id_projet', $id)->first();

        if (!$projet) {
            return response()->json([
                'message' => 'Projet introuvable'
            ], 404);
        }

        $projet->delete();

        return response()->json([
            'message' => 'Projet supprimé'
        ]);
    }

    // mes projets par employé
    public function mesProjets($id)
    {
        $projets = Projet::with('client', 'employe')
            ->where('id_employe', $id)
            ->get();

        return response()->json($projets);
    }
    // mes projets par client
public function mesProjetsClient($id)
{
    $projets = Projet::with('client', 'employe')
        ->where('id_client', $id)
        ->get();

    return response()->json($projets);
}
}