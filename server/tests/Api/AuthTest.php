<?php
namespace Tests\Api;

use Tests\TestCase;
use App\Member;
use JWTAuth;

class AuthTest extends TestCase
{
    public function testInvalidLoginCredentials()
    {
        // No input
        $this->json('POST', 'api/auth')
            ->assertStatus(401)
            ->assertJsonStructure([ 'error' ]);

        // Invalid input
        $this->json('POST', 'api/auth', ['email'=>'x','password'=>''])
            ->assertStatus(401)
            ->assertJsonStructure([ 'error' ]);

        // Valid input but invalid credentials
        $this->json('POST', 'api/auth', [
            'email' => 'toptal@test.com',
            'password' => bcrypt('toptaltest')
        ])
            ->assertStatus(401)
            ->assertJsonStructure([ 'error' ]);  
    }


    public function testValidLoginCredentials()
    {
        $member = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'password' => bcrypt('toptaltest'),
        ]);

        $payload = ['email' => 'toptal@test.com', 'password' => 'toptaltest'];
        $this->json('POST', 'api/auth', $payload)
            ->assertStatus(200)
            ->assertJsonStructure([ 'token' ]);        
    }

    public function testGetAuthenticatedToken()
    {
        // Failure
        $this->json('GET', 'api/auth')
            ->assertStatus(401)
            ->assertJsonStructure(['error']);
        // Success
        $member = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'password' => bcrypt('toptaltest'),
        ]);
        $this->json('GET', 'api/auth', ["token"=>JWTAuth::fromUser($member)])
            ->assertStatus(200)
            ->assertJsonStructure(['member_id', 'email', 'first_name', 'last_name', 'max_calories_per_day','created_at','updated_at']);    
    }
    // public function testMissingMember()
    // {
    //     $this->json('GET', 'api/auth')->assertStatus(401);
    //     $m = $this->createMember();
    //     $token = JWTAuth::fromUser($m);
    //     $this->withTokenHeader($token)->json('GET', 'api/auth')->assertStatus(200)->dump();
        
    //     $this->assertEquals(1, Member::count());
    //     echo "BEFORE: ", $token, "\n";
    //     $m->forceDelete();
    //     echo "AFTER: ", $token,"\n";
    //     $this->assertEquals(0, Member::count());
        
    //     $this->withTokenHeader($token)->json('GET', 'api/auth')->assertStatus(403)->dump();

    //     // $m2 = $this->createMember();
    //     // JWTAuth::fromUser($m2);
    //     // $token = $this->getToken();
    //     // $this->withTokenHeader($token)->json('GET', 'api/auth')->assertStatus(200)->dump();
    //     // $x=1;
    // }
}