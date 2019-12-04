<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use App\Member;

class JwtMiddleware extends BaseMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param integer $restrict: Should restrict access or let go
     * @return mixed
     */
    public function handle($request, Closure $next, $restrict = 0)
    {
        // If it's been handled already pass
        if (JWTAuth::user()) {
            return $next($request);
        }
        try {
            JWTAuth::parseToken()->authenticate();
            if (null === JWTAuth::user() && $restrict!=0) {
                return response()->json(['error' => 'Token is valid but the member was removed'], 401);
            }
        } catch (Exception $e) {
            if (0 == $restrict) {
                return $next($request);
            }
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return response()->json(['error' => 'Token is Invalid'], 401);
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return response()->json(['error' => 'Token is Expired'], 401);
            }else{
                return response()->json(['error' => 'Authorization Token not found'], 401);
            }
        }
        return $next($request);
    }
}