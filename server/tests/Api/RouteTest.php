<?php

namespace Tests\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use JWTFactory, JWTAuth;
use App\Member;
class RouteTest extends TestCase
{
    public function testOpenRouteIsOpen()
    {
        $this->json("GET", "/api/open")->assertStatus(200);
    }
    public function testClosedRouteIsClosed()
    {
        // No token no go
        $this->json("GET", "/api/closed")->assertStatus(401);
        // UnAuthenticatable tokens won't do
        $token = JWTAuth::encode(
            JWTFactory::sub(123)->aud('foo')->foo(["about"=>"you"])->make()
        );
        $this->json("GET", "/api/closed", ['token' => $token])->assertStatus(401);     
        // User based tokens will do
        $member = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'password' => bcrypt('toptaltest'),
        ]);        
        $this->json("GET", "/api/closed", ['token' => JWTAuth::fromUser($member)])->assertStatus(200);   
    }
    
}
