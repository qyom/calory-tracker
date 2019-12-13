<?php
namespace App\Http\Controllers;

use App\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Jobs\ProcessNewMember;

class MemberController extends Controller
{
    public function get(Request $request, Member $memberGet = null)
    {
        if (!$memberGet) {
            $memberGet =  JWTAuth::user();
        }
        return response()->json($memberGet, 200);
    }
    private function getAllowedRolesByCreator(Member $creator = null)
    {
        if (null == $creator) {
            return [Member::TYPE_REGULAR];
        }
        switch($creator->role_type) {
            case Member::TYPE_ADMIN: 
                return array_keys(Member::$rolesMap);
            case Member::TYPE_MANAGER: 
                return [Member::TYPE_REGULAR, Member::TYPE_MANAGER];
            case Member::TYPE_REGULAR: 
                return [Member::TYPE_REGULAR];
        }
    }

    public function post(Request $request)
    {
        $creator = JWTAuth::user();
        $allowedRoles = $this->getAllowedRolesByCreator($creator);
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:members',
            'password' => 'required|string|min:6|confirmed',
            'role_type' => '|string|in:'.implode(',',$allowedRoles),
            'max_calories_per_day' => 'required|integer|min:0|max:100000',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $fill = [
            'role_type' => $request->get('role_type', Member::TYPE_REGULAR),
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'max_calories_per_day' => $request->get('max_calories_per_day'),
        ];        
        if ($creator) {
            $fill['creator_id'] = $creator->member_id;
        }
        $member = Member::create($fill);

        // Dispatch event to the queue
        ProcessNewMember::dispatch($member);

        $token = JWTAuth::fromUser($member);
        return response()->json(compact('member','token'),201);
    }

    public function put(Request $request, Member $member = null)
    {
        $memberMe = JWTAuth::user();
        if (!$member) {
            $member = $memberMe;
        }
        if (sizeof($request->all()) == 0) {
            return response()->json($meal, 200);
        }
        $allowedRoles = $this->getAllowedRolesByCreator($memberMe);
        $validator = Validator::make($request->all(), [
            'first_name' => '|string|max:255',
            'last_name' => '|string|max:255',
            'email' => '|string|email|max:255|unique:members,email,'.$member->member_id.',member_id',
            'password' => '|string|min:6|confirmed',
            'max_calories_per_day' => '|integer|min:0|max:100000',
            'role_type' => '|string|in:'.implode(',',$allowedRoles),
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
        if($request->has('role_type')) {
            $fill['role_type'] = $request->get('role_type');
        }
        $member->fill($fill);
        $member->save();
        $token = JWTAuth::fromUser($member);

        return response()->json(compact('member','token'),200);
    }

    public function delete(Request $request, Member $memberDelete = null)
    {
        $memberMe = JWTAuth::user();
        if (!$memberDelete) {
            $memberDelete = $memberMe;
        }
        $memberDelete->forceDelete();
        return response()->json(null,200);
    }
}