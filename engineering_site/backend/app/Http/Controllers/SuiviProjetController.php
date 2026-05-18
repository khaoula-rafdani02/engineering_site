<?php
namespace App\Http\Controllers;

use App\Models\SuiviProjet;
use App\Models\Projet;
use Illuminate\Http\Request;

class SuiviProjetController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role');
        $id_employe = $request->query('id_employe');

        if ($role === 'Administrateur' || $role === 'manager' || !$role) {
            $suivis = SuiviProjet::with(['projet', 'employe'])->get();
        } else {
            $suivis = SuiviProjet::with(['projet', 'employe'])
                ->whereHas('projet', function($query) use ($id_employe) {
                    $query->where('id_employe', $id_employe);
                })
                ->get();
        }

        return response()->json($suivis);
    }

    public function getByProjet($id_projet)
    {
        $suivis = SuiviProjet::with(['employe'])
            ->where('id_projet', $id_projet)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($suivi) {
                return [
                    'id_suivi' => $suivi->id_suivi,
                    'id_projet' => $suivi->id_projet,
                    'id_employe' => $suivi->id_employe,
                    'nom_employe' => $suivi->employe->nom ?? 'Employé',
                    'commentaire' => $suivi->commentaire,
                    'statut' => $suivi->statut,
                    'date_suivi' => $suivi->created_at->format('Y-m-d'),
                ];
            });

        return response()->json($suivis);
    }

    public function show($id)
    {
        $suivi = SuiviProjet::with(['projet', 'employe'])->find($id);
        
        if (!$suivi) {
            return response()->json(['message' => 'Suivi non trouvé'], 404);
        }
        
        return response()->json($suivi);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_projet'    => 'required|exists:projets,id_projet',
            'id_employe'   => 'required|exists:employes,id_employe',
            'localisation' => 'nullable|string',
            'statut'       => 'required|in:En cours,Terminé,Suspendu,En attente',
            'commentaire'  => 'required|string|min:2',
            'photos.*'     => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $photos = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('suivi_photos', 'public');
                $photos[] = $path;
            }
        }

        $suivi = SuiviProjet::create([
            'id_projet'    => $request->id_projet,
            'id_employe'   => $request->id_employe,
            'localisation' => $request->localisation,
            'statut'       => $request->statut,
            'commentaire'  => $request->commentaire,
            'photos'       => $photos,
        ]);

        return response()->json($suivi, 201);
    }

    public function update(Request $request, $id)
    {
        $suivi = SuiviProjet::findOrFail($id);

        if ($request->hasFile('photos')) {
            $photos = [];
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('suivi_photos', 'public');
                $photos[] = $path;
            }
        } else {
            $photos = $suivi->photos ?? [];
        }

        $suivi->update([
            'id_projet'    => $request->id_projet   ?? $suivi->id_projet,
            'id_employe'   => $request->id_employe  ?? $suivi->id_employe,
            'localisation' => $request->localisation ?? $suivi->localisation,
            'statut'       => $request->statut       ?? $suivi->statut,
            'commentaire'  => $request->commentaire  ?? $suivi->commentaire,
            'photos'       => $photos,
        ]);

        return response()->json($suivi);
    }

    public function destroy($id)
    {
        $suivi = SuiviProjet::findOrFail($id);
        $suivi->delete();
        
        return response()->json(['message' => 'Supprimé avec succès']);
    }
}