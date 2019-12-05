<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Meal;
use JWTAuth;

class MealController extends Controller
{
    public function get(Meal $meal)
    {
        return response()->json($meal, 200);
    }

    public function post(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:1',
            'calories' => 'required|integer|min:0|max:'.Meal::MAX_CALORIES_PER_MEAL,
            'date_intake' => 'required|string|date_format:Y-m-d H:i:s',
        ]);
        if ($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $fill = [
            'name' => $request->get('name'),
            'calories' => intval($request->get('calories')),
            'date_intake' => $request->get('date_intake'),
            'member_id' => $request->get('member_id', JWTAuth::user()->member_id)
        ];
        $meal = Meal::create($fill);

        return response()->json(compact('meal'),201);
    }
}