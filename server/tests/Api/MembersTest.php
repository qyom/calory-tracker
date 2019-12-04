<?php

namespace Tests\Api;

use Tests\TestCase;
use App\Member;
use JWTAuth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MembersTest extends TestCase
{
    public function testEndpointAccess()
    {
        // Unauthenticated
        $this->get('api/members')->assertStatus(401);
        // Invalid URI
        $this->get('api/members/123')->assertStatus(404);
        $r1 = $this->createMember();
        $r2 = $this->createMember();
        $m1 = $this->createMember(Member::TYPE_MANAGER);        
        $token = $this->login($r1);
        // regulars cant access
        $this->withTokenHeader($token)->get('api/members')->assertStatus(403);
        $token = $this->login($m1);
        $this->withTokenHeader($token)->get('/api/members')->assertStatus(200)->assertJsonCount(3);
        $a1 = $this->createMember(Member::TYPE_ADMIN);
        $token = $this->login($a1);
        $this->withTokenHeader($token)->get('/api/members')->assertStatus(200)->assertJsonCount(4);
        $m2 = $this->createMember(Member::TYPE_MANAGER);
        $a2 = $this->createMember(Member::TYPE_ADMIN);
        $response = $this->withTokenHeader($token)->get('/api/members')->assertStatus(200)->assertJsonCount(6)->assertJsonStructure([[
            'member_id',
            'role_type',
            'first_name',
            'last_name',
            'email'
        ]]);
    }
}