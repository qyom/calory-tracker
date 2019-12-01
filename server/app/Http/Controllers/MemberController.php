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
                'max_calories_per_day' => 'required|integer|min:0|max:100000',
            ]);
            if($validator->fails()){
                return response()->json($validator->errors()->toJson(), 400);
            }
            $user = User::create([
                'first_name' => $request->get('first_name'),
                'last_name' => $request->get('last_name'),
                'email' => $request->get('email'),
                'password' => Hash::make($request->get('password')),
                'max_calories_per_day' => $request->get('max_calories_per_day'),
            ]);
            $token = JWTAuth::fromUser($user);

            return response()->json(compact('user','token'),201);
        }
    }