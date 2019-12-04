<?php
namespace App\Http\Controllers;

use App\Member;
use Illuminate\Http\Request;
use JWTAuth;

class MembersController extends Controller
{
    public function get()
    {
        return response()->json(Member::all(),200);
    }
}