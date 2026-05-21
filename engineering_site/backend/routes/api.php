<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuiviProjetController;

/*
|--------------------------------------------------------------------------
| Routes publiques — بلا auth
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [ClientController::class, 'register']);
Route::post('/messages', [MessageController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Routes protégées — خاصهم token
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /* Logout */
    Route::post('/logout', [AuthController::class, 'logout']);

    /* Projets */
    Route::get('/projets',        [ProjetController::class, 'index']);
    Route::post('/projets',       [ProjetController::class, 'store']);
    Route::get('/projets/{id}',   [ProjetController::class, 'show']);
    Route::put('/projets/{id}',   [ProjetController::class, 'update']);
    Route::delete('/projets/{id}',[ProjetController::class, 'destroy']);

    Route::get('/mes-projets/{id}',        [ProjetController::class, 'mesProjets']);
    Route::get('/mes-projets-client/{id}', [ProjetController::class, 'mesProjetsClient']);

    /* Clients */
    Route::apiResource('clients', ClientController::class);

    /* Employes */
    Route::apiResource('employes', EmployeController::class);

    /* Messages */
    Route::get('/messages', [MessageController::class, 'index']);

    /* Documents */
    Route::apiResource('documents', DocumentController::class);

    /* Suivis */
    Route::apiResource('suivis', SuiviProjetController::class);
    Route::get('/suivi_projet/projet/{id_projet}', [SuiviProjetController::class, 'getByProjet']);
    Route::get('/suivi_projet/{id}/progression',   [SuiviProjetController::class, 'getProgression']);

    /* Photos */
    Route::get('/photos/{folder}/{filename}', function ($folder, $filename) {
        if (str_contains($folder, '..') || str_contains($filename, '..') ||
            str_contains($folder, '/')  || str_contains($filename, '/') ||
            str_contains($folder, '\\') || str_contains($filename, '\\')) {
            abort(403);
        }

        $fullPath = storage_path('app/public/' . $folder . '/' . $filename);

        if (!file_exists($fullPath)) {
            abort(404);
        }

        return response()->file($fullPath);
    });

});