<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EmployeMiddleware
{
    public function handle(Request $request, Closure $next)
    {

        if(!session()->has('user') || session('user')->role !== 'Employé'){

            return response()->json([
                "message" => "Unauthorized"
            ],401);

        }

        return $next($request);
    }
}