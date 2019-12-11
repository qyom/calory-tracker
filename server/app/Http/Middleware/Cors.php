<?php
namespace App\Http\Middleware;
use Closure;
class Cors
{
  public function handle($request, Closure $next)
  {
    return  $next($request)
      ->header('Access-Control-Allow-Origin', '*')
      ->header('Vary', 'Origin, Access-Control-Request-Headers')
      ->header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization');
  }
}