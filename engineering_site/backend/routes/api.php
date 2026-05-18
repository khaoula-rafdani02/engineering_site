<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuiviProjetController;

/* Projets */

Route::get('/projets',[ProjetController::class,'index']);
Route::post('/projets',[ProjetController::class,'store']);
Route::get('/projets/{id}',[ProjetController::class,'show']);
Route::put('/projets/{id}',[ProjetController::class,'update']);
Route::delete('/projets/{id}',[ProjetController::class,'destroy']);


/* Clients */

Route::apiResource('clients', ClientController::class);


/* Employes */

Route::apiResource('employes', EmployeController::class);


/* Messages */


Route::get('/messages', [MessageController::class, 'index']);


Route::post('/messages', [MessageController::class, 'store']);

/* Documents */

Route::apiResource('documents', DocumentController::class);


/* Login */

Route::post('/login',[AuthController::class,'login']);

Route::get('/mes-projets/{id}',[ProjetController::class,'mesProjets']);





Route::apiResource('suivis', SuiviProjetController::class);
// Routes pour les suivis 
Route::get('/suivi_projet/projet/{id_projet}', [SuiviProjetController::class, 'getByProjet']);
Route::get('/suivi_projet/{id}/progression', [SuiviProjetController::class, 'getProgression']);
    


Route::get('/mes-projets-client/{id}', [ProjetController::class, 'mesProjetsClient']);

Route::get('/photos/{folder}/{filename}', function($folder, $filename) {
    $fullPath = storage_path('app/public/' . $folder . '/' . $filename);
    if (!file_exists($fullPath)) {
        abort(404);
    }
    return response()->file($fullPath);
});

Route::post('/register', [ClientController::class, 'register']);