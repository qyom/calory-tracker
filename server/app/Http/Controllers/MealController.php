<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Meal;
use JWTAuth;

class MealController extends Controller
{
    public function get(Meal $meal)
    {
        return response()->json($meal, 200);
    }
}