<?php

namespace Tests\Api;

use Tests\TestCase;
use App\Member;
use JWTAuth;
class MemberTest extends TestCase
{
    protected $validPayload = [
        'first_name' => 'John',
        'last_name' => 'Bayron',
        'email' => 'firstname.lastname@example.com',
        'max_calories_per_day' => 100,
        'password' => 'toptaltest',
        'password_confirmation' => 'toptaltest',
    ];

    public function testInvalidPostInputs()
    {
        // Empty first_name
        $this->json(
            'post',
            '/api/member',
            ['first_name'=>''] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['first_name']);
        // Long first_name
        $this->json(
            'post',
            '/api/member',
            ['first_name'=>str_pad("", 256, "what-a-long-name")] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['first_name']);
        // Empty last_name
        $this->json(
            'post',
            '/api/member',
            ['last_name'=>''] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['last_name']);
        // Long last_name
        $this->json(
            'post',
            '/api/member',
            [
                'last_name'=>str_pad("", 256, "what-a-long-last-name"),
                'first_name'=>str_pad("", 255, "not-quite-long-first-name")
            ] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['last_name'])->assertJsonMissingValidationErrors(['first_name']);
        // Invalid email
        $this->json(
            'post',
            '/api/member',
            [
                'email'=>'#@%^%#$@#$@#.com'
            ] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['email']);
        // Mismatching password_confirmation field
        $this->json(
            'post',
            '/api/member',
            ['password_confirmation'=>'toptaltes'] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['password']);
        // Mismatching password field
        $this->json(
            'post',
            '/api/member',
            ['password'=>'optaltest'] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['password']);
        // invalid calories
        $this->json(
            'post',
            '/api/member',
            ['max_calories_per_day'=>-1] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['max_calories_per_day']);
        // Duplicate email entries
        $member = factory(Member::class)->create([
            'email' => $this->validPayload['email'],
            'password' => bcrypt($this->validPayload['password']),
        ]);
        $this->json(
            'post',
            '/api/member',
            $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['email']);
    }

    public function testValidPostInputs()
    {
        var_dump(Member::all()->toArray());
        $response = $this->json('post', '/api/member', $this->validPayload);
        $response->dump();
        $response
            ->assertStatus(201)
            ->assertJsonStructure([
                'member' => [
                    'member_id',
                    'role_type',
                    'first_name',
                    'last_name',
                    'email',
                    'created_at',
                    'updated_at',
                ],
                'token'
            ]);
            
    }
    
    public function testRegularMemberCantCreateNewMember()
    {
        // Create a regular member
        $member = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'role_type' => Member::TYPE_REGULAR,
            'password' => bcrypt('toptaltest'),
        ]);
        // Generate its token to specify as current in header
        $token = JWTAuth::fromUser($member);
        $this->withTokenHeader($token)->json('post', '/api/member', $this->validPayload)->assertStatus(403);
    }

    public function testIregularMemberCanCreateNewMember()
    {
        // Create a regular member
        $member = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'role_type' => Member::TYPE_MANAGER,
            'password' => bcrypt('toptaltest'),
        ]);
        // Generate its token to specify as current in header
        $token = JWTAuth::fromUser($member);
        $this->withTokenHeader($token)->json('post', '/api/member', $this->validPayload)->assertStatus(201);
        $member->role_type = Member::TYPE_ADMIN;
        $token = JWTAuth::fromUser($member);
        $this->withTokenHeader($token)->json('post', '/api/member', ['email'=>'another@email.com']+$this->validPayload)->assertStatus(201);
    }
}