<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employe;

class EmployeController extends Controller
{

public function index()
{
return response()->json(Employe::all());
}

public function store(Request $request)
{

$employe = Employe::create([
'nom'=>$request->nom,
'email'=>$request->email,
'mot_de_passe'=>bcrypt($request->mot_de_passe),
'role'=>$request->role,
'specialite'=>$request->specialite,
'date_embauche'=>$request->date_embauche
]);

return response()->json($employe);

}

public function show($id)
{
$employe = Employe::where('id_employe',$id)->first();
return response()->json($employe);
}

public function update(Request $request,$id)
{

$employe = Employe::where('id_employe',$id)->first();

$employe->update([
'nom'=>$request->nom,
'email'=>$request->email,
'mot_de_passe'=>bcrypt($request->mot_de_passe),
'role'=>$request->role,
'specialite'=>$request->specialite,
'date_embauche'=>$request->date_embauche
]);

return response()->json($employe);

}

public function destroy($id)
{

Employe::where('id_employe',$id)->delete();

return response()->json([
"message"=>"Employe supprimé"
]);

}

}