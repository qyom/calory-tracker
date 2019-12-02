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

    public function testInvalidPost()
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

    public function testValidPost()
    {
        $response = $this->json('post', '/api/member', $this->validPayload);
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

    public function testInvalidPostAccess()
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

    public function testInvalidPut()
    {
        // Create a regular member
        $member = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'role_type' => Member::TYPE_REGULAR,
            'password' => bcrypt('toptaltest'),
        ]);
        $token = JWTAuth::fromUser($member);
        // Should reject unsigned but valid request
        $this->json(
            'put',
            "/api/member",
            $this->validPayload
        )->assertStatus(401);

        // Empty first_name
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            ['first_name'=>''] + $this->validPayload
        )->assertStatus(401)->assertJsonStructure(['first_name']);

        // Long first_name
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member/'.$member->member_id,
            ['first_name'=>str_pad("", 256, "what-a-long-name")] + $this->validPayload
        )->assertStatus(401)->assertJsonStructure(['first_name']);

        // Empty last_name
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            ['last_name'=>''] + $this->validPayload
        )->assertStatus(401)->assertJsonStructure(['last_name']);
        // Long last_name
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member/'.$member->member_id,
            [
                'last_name'=>str_pad("", 256, "what-a-long-last-name"),
                'first_name'=>str_pad("", 255, "not-quite-long-first-name")
            ] + $this->validPayload

        )->assertStatus(401)->assertJsonStructure(['last_name'])->assertJsonMissingValidationErrors(['first_name']);
        
        // Invalid email
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            [
                'email'=>'#@%^%#$@#$@#.com'
            ] + $this->validPayload
        )->assertStatus(401)->assertJsonStructure(['email']);
        
        // Mismatching password_confirmation field
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            ['password_confirmation'=>'toptaltes'] + $this->validPayload
        )->assertStatus(401)->assertJsonStructure(['password']);
        
        // Mismatching password field
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            ['password'=>'optaltest'] + $this->validPayload
        )->assertStatus(401)->assertJsonStructure(['password']);
        // invalid calories
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            ['max_calories_per_day'=>-1] + $this->validPayload
        )->assertStatus(401)->assertJsonStructure(['max_calories_per_day']);
        // Duplicate email entries
        $member = factory(Member::class)->create([
            'email' => $this->validPayload['email'],
            'password' => bcrypt($this->validPayload['password']),
        ]);
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            $this->validPayload
        )->assertStatus(401)->assertJsonStructure(['email']);
    }

    public function testPutAccess()
    {
        // Create a regular member
        $currentMember = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'role_type' => Member::TYPE_REGULAR,
            'password' => bcrypt('toptaltest'),
        ]);
        // Generate its token to specify as current in header
        $token = JWTAuth::fromUser($currentMember);

        // Attempt to update a non existing member should return 403
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member/'.($currentMember->member_id + 1),
            $this->validPayload
        )->assertStatus(403);
        // Attempt to update an existing member other than self should return 403
        $memberToUpdate = factory(Member::class)->create($this->validPayload);
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member'.$memberToUpdate->member_id,
            $this->validPayload
        )->assertStatus(403);

        // Change to Manager
        $currentMember->role_type = Member::TYPE_MANAGER;
        $currentMember->save();
        // Retry even with an old member token
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member'.$memberToUpdate->member_id,
            ['first_name'=>'changedByManager']+$this->validPayload
        )->assertStatus(200);
        $memberToUpdate->refresh();
        $this->assertEqual('changedByManager', $memberToUpdate->first_name);

        // Change to Admin
        $currentMember->role_type = Member::TYPE_MANAGER;
        $currentMember->save();
        // Retry even with an old member token
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member'.$memberToUpdate->member_id,
            ['first_name'=>'changedByAdmin'] + $this->validPayload
        )->assertStatus(200);
        $memberToUpdate->refresh();
        $this->assertEqual('changedByAdmin', $memberToUpdate->first_name);         
    }
}