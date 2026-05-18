<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/* LOGIN PAGE */
Route::get('/loginn', function () {
    return view('loginn');
});

/* LOGIN */
Route::post('/loginn', [AuthController::class, 'login']);

/* LOGOUT */
Route::get('/logout', [AuthController::class, 'logout']);