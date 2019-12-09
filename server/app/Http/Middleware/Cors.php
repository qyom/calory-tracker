<?php
namespace App\Http\Middleware;
use Closure;
class Cors
{
  public function handle($request, Closure $next)
  {
    if ($request->getMethod() === "OPTIONS") {
        return response('', 204)
          ->header('Access-Control-Allow-Origin', '*')
          ->header('Vary', 'Origin, Access-Control-Request-Headers')
          ->header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'content-type');
    }
    return $next($request);
  }
}