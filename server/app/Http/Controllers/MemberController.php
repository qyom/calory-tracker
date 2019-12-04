<?php
namespace App\Http\Controllers;

use App\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class MemberController extends Controller
{
    public function post(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:members',
            'password' => 'required|string|min:6|confirmed',
            //'role_type'
            'max_calories_per_day' => 'required|integer|min:0|max:100000',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $member = Member::create([
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'max_calories_per_day' => $request->get('max_calories_per_day'),
        ]);
        $token = JWTAuth::fromUser($member);

        return response()->json(compact('member','token'),201);
    }

    public function put(Request $request, $memberPut = null)
    {
        $memberMe = JWTAuth::user();
        if (!$memberPut) {
            $memberPut = $memberMe;
        }
        $validator = Validator::make($request->all(), [
            'first_name' => '|string|max:255',
            'last_name' => '|string|max:255',
            'email' => '|string|email|max:255|unique:members,email,'.$memberPut->member_id.',member_id',
            'password' => '|string|min:6|confirmed',
            'max_calories_per_day' => '|integer|min:0|max:100000',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        if($request->has('first_name')) {
            $fill['first_name'] = $request->get('first_name');
        }
        if($request->has('last_name')) {
            $fill['last_name'] = $request->get('last_name');
        }
        if($request->has('email')) {
            $fill['email'] = $request->get('email');
        }
        if($request->has('password')) {
            $fill['password'] = Hash::make($request->get('password'));
        }
        if($request->has('max_calories_per_day')) {
            $fill['max_calories_per_day'] = $request->get('max_calories_per_day');
        }
        $memberPut->fill($fill);
        $memberPut->save();
        $token = JWTAuth::fromUser($memberPut);

        return response()->json(compact('memberPut','token'),200);
    }

    public function delete(Request $request, $memberDelete = null)
    {
        $memberMe = JWTAuth::user();
        if (!$memberDelete) {
            $memberDelete = $memberMe;
        }
        $memberDelete->forceDelete();
        return response()->json(null,200);
    }
}