<?php
namespace App\Http\Controllers;

use App\Member;
use Illuminate\Http\Request;
use JWTAuth;

class MembersController extends Controller
{
    public function get()
    {
        $query = Member::whereIn('role_type', Member::rolesNotHigherThan(JWTAuth::user()->role_type));
        return response()->json($query->get(),200);
    }
}