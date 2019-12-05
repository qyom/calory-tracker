<?php
namespace App\Http\Controllers;

use App\Member, App\Meal;
use Illuminate\Http\Request;
use JWTAuth;
use Illuminate\Support\Facades\Validator;

class MealsController extends Controller
{
    public function get(Request $request, Member $owner = null)
    {
        if (null == $owner) {
            $owner = JWTAuth::user();
        }
        $validator = Validator::make($request->all(), [
            'intake_date_from' => 'string|date_format:Y-m-d',
            'intake_date_to' => 'string|date_format:Y-m-d',
            'intake_hours_from' => 'integer|min:0|max:23',
            'intake_hours_to' => 'integer|min:0|max:23',
        ]);
        if ($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $query = $owner->meals();
        if($request->has('intake_date_from')) {
            $query = $query->whereRaw('DATE(date_intake)>=?', [$request->get('intake_date_from')]);
        }
        if($request->has('intake_date_to')) {
            $query = $query->whereRaw('DATE(date_intake)<=?', [$request->get('intake_date_to')]);
        }
        if($request->has('intake_hours_from')) {
            $query = $query->whereRaw('HOUR(date_intake)>=?', [$request->get('intake_hours_from')]);
        }
        if($request->has('intake_hours_to')) {
            $query = $query->whereRaw('HOUR(date_intake)<=?', [$request->get('intake_hours_to')]);
        }       

        return response()->json($query->get(),200);
    }
}