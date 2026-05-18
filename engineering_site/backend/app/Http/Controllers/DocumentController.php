<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;

class DocumentController extends Controller
{

// LIST DOCUMENTS
public function index()
{
    $documents = Document::all();
    return response()->json($documents);
}

// SHOW ONE DOCUMENT
public function show($id)
{
    $document = Document::find($id);

    if(!$document){
        return response()->json(["message"=>"Document not found"],404);
    }

    return response()->json($document);
}

// CREATE DOCUMENT
public function store(Request $request)
{

$request->validate([
'fichier' => 'required',
'id_projet' => 'required',
'type_document' => 'required'
]);

$document = Document::create([
'fichier' => $request->fichier,
'id_projet' => $request->id_projet,
'date_upload' => now(),
'type_document' => $request->type_document
]);

return response()->json($document);

}

// UPDATE DOCUMENT
public function update(Request $request,$id)
{

$document = Document::find($id);

if(!$document){
return response()->json(["message"=>"Document not found"],404);
}

$document->update([
'fichier'=>$request->fichier,
'id_projet'=>$request->id_projet,
'type_document'=>$request->type_document
]);

return response()->json($document);

}

// DELETE DOCUMENT
public function destroy($id)
{

$document = Document::find($id);

if(!$document){
return response()->json(["message"=>"Document not found"],404);
}

$document->delete();

return response()->json(["message"=>"Document deleted"]);

}

}