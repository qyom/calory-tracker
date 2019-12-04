<?php

namespace Tests\Api;

use Tests\TestCase;
use App\Member;
use JWTAuth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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

    public function testInvalidPostInput()
    {
        // Empty first_name
        $this->json(
            'post',
            '/api/member',
            ['first_name'=>''] + $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['first_name']);
        // Long first_name
        $this->json(
            'post',
            '/api/member',
            ['first_name'=>str_pad("", 256, "what-a-long-name")] + $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['first_name']);
        // Empty last_name
        $this->json(
            'post',
            '/api/member',
            ['last_name'=>''] + $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['last_name']);
        // Long last_name
        $this->json(
            'post',
            '/api/member',
            [
                'last_name'=>str_pad("", 256, "what-a-long-last-name"),
                'first_name'=>str_pad("", 255, "not-quite-long-first-name")
            ] + $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['last_name'])->assertJsonMissingValidationErrors(['first_name']);
        // Invalid email
        $this->json(
            'post',
            '/api/member',
            [
                'email'=>'#@%^%#$@#$@#.com'
            ] + $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['email']);
        // Mismatching password_confirmation field
        $this->json(
            'post',
            '/api/member',
            ['password_confirmation'=>'toptaltes'] + $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['password']);
        // Mismatching password field
        $this->json(
            'post',
            '/api/member',
            ['password'=>'optaltest'] + $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['password']);
        // invalid calories
        $this->json(
            'post',
            '/api/member',
            ['max_calories_per_day'=>-1] + $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['max_calories_per_day']);
        // Duplicate email entries
        $member = factory(Member::class)->create([
            'email' => $this->validPayload['email'],
            'password' => bcrypt($this->validPayload['password']),
        ]);
        $this->json(
            'post',
            '/api/member',
            $this->validPayload

        )->assertStatus(400)->assertJsonStructure(['email']);
    }

    public function testValidPostInput()
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
    
    public function testInvalidPostAccess()
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

    public function testValidPostAccess()
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

    public function testInvalidPutInput()
    {
        unset($this->validPayload['password']);
        unset($this->validPayload['password_confirmation']);
        // Create a regular member
        $member = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'role_type' => Member::TYPE_REGULAR,
            'password' => bcrypt('toptaltest'),
        ]);
        $tokenRegular = JWTAuth::fromUser($member);
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
        )->assertStatus(400)->assertJsonStructure(['first_name']);

        // Long first_name
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member/'.$member->member_id,
            ['first_name'=>str_pad("", 256, "what-a-long-name")] + $this->validPayload
        )->assertStatus(400)->assertJsonStructure(['first_name']);

        // Empty last_name
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            ['last_name'=>''] + $this->validPayload
        )->assertStatus(400)->assertJsonStructure(['last_name']);
        // Long last_name
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member/'.$member->member_id,
            [
                'last_name'=>str_pad("", 259, "what-a-long-last-name"),
                'first_name'=>str_pad("", 255, "not-quite-long-first-name")
            ] + $this->validPayload
        )->assertStatus(400)->assertJsonStructure(['last_name'])->assertJsonMissingValidationErrors(['first_name']);
        // Invalid email
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            [
                'email'=>'#@%^%#$@#$@#.com'
            ] + $this->validPayload
        )->assertStatus(400)->assertJsonStructure(['email']);
        
        // Sending a password with missmatching password_confirmation field
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            ['password'=>'toptaltest'] + $this->validPayload
        )->assertStatus(400)->assertJsonStructure(['password']);
        
        // invalid calories
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            ['max_calories_per_day'=>-1] + $this->validPayload
        )->assertStatus(400)->assertJsonStructure(['max_calories_per_day']);
        // Duplicate email entries
        $member = factory(Member::class)->create([
            'email' => $this->validPayload['email'],
            'password' => bcrypt('toptaltest'),
        ]);
        $this->withTokenHeader($tokenRegular)->json(
            'put',
            '/api/member',
            $this->validPayload
        )->assertStatus(400)->assertJsonStructure(['email']);
    }

    public function testPutValidInput()
    {
        // Create a regular member
        $memberAdmin = factory(Member::class)->create([
            'email' => 'toptal@test.com',
            'role_type' => Member::TYPE_ADMIN,
            'password' => bcrypt('toptaltest'),
        ]);
        $token = JWTAuth::fromUser($memberAdmin);

        // Update self without password
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member',
            $this->validPayload
        )->assertStatus(200);

        // Update self with password
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member',
            [
                'password' => 'toptaltest',
                'password_confirmation' => 'toptaltest'
            ] + $this->validPayload
        )->assertStatus(200);

        // Update manager
        $memberManager = factory(Member::class) -> create([
            'email' => 'toptal@test2.com',
            'role_type' => Member::TYPE_MANAGER,
            'password' => bcrypt('toptaltest')
        ]);
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member/'.$memberManager->member_id,
            [
                'first_name' => 'whatver dude'
            ]
        )->assertStatus(200);
        // Update regular
        $memberRegular = factory(Member::class) -> create([
            'email' => 'toptal@test3.com',
            'role_type' => Member::TYPE_REGULAR,
            'password' => bcrypt('toptaltest')
        ]);
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member/'.$memberRegular->member_id,
            [
                'first_name' => 'whatver dudez'
            ]
        )->assertStatus(200);
        
        // Switch to manager
        $token = $this->login($memberManager);
        $this->withTokenHeader($token)->json(
            'PUT',
            '/api/member/'.$memberRegular->member_id,
            [
                'first_name' => 'Another name'
            ]
        )->assertStatus(200);
        $memberRegular->refresh();
        $this->assertEquals('Another name', $memberRegular->first_name);

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

        // Attempt to update a non existing member should return 404
        $response = $this->withTokenHeader($token)->json(
            'put',
            '/api/member/'.($currentMember->member_id + 100),
            $this->validPayload
        );
        //$response->dump();
        $response->assertStatus(404);
        // Attempt to update an existing member other than self should return 403
        $memberToUpdate = factory(Member::class)->create([
            'email' => 'toptal2@test.com',
            'role_type' => Member::TYPE_REGULAR,
            'password' => bcrypt('toptaltest'),
        ]);
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member/'.$memberToUpdate->member_id,
            $this->validPayload
        )->assertStatus(403);

        // Change to Manager
        $currentMember->role_type = Member::TYPE_MANAGER;
        $currentMember->save();
        // Refresh token
        $token = $this->login($currentMember);
        // Retry even with an old member token
        $response = $this->withTokenHeader($token)->json(
            'put',
            '/api/member/'.$memberToUpdate->member_id,
            ['first_name'=>'changedByManager', 'dump'=>1]+$this->validPayload
        );
        $response->assertStatus(200);
        $memberToUpdate->refresh();
        $this->assertEquals('changedByManager', $memberToUpdate->first_name);

        // Change to Admin
        $currentMember->role_type = Member::TYPE_MANAGER;
        $currentMember->save();
        // Refresh token
        $token = $this->login($currentMember);
        // Retry even with an old member token
        $this->withTokenHeader($token)->json(
            'put',
            '/api/member/'.$memberToUpdate->member_id,
            ['first_name'=>'changedByAdmin'] + $this->validPayload
        )->assertStatus(200);
        $memberToUpdate->refresh();
        $this->assertEquals('changedByAdmin', $memberToUpdate->first_name);         
    }

    public function testDeleteIsAuthenticated()
    {
        $m = $this->createMember();
        // Unauthenticated delete call
        $this->json('delete', 'api/member')->assertStatus(401);
        $this->json('delete', 'api/member/'.$m->member_id)->assertStatus(401);
    }
    public function testSelfDelete()
    {
        // /api/member
        $m = $this->createMember();
        $token = JWTAuth::fromUser($m);
        // Can delete self
        $this->withTokenHeader($token)->json('delete', '/api/member')->assertStatus(200);
        try{
            $m->refresh();
            $this->fail("Member was not deleted");
        }catch (ModelNotFoundException $e) {
            // Expected
        }        
        // api/member/{self.id}
        $m = $this->createMember();
        $token = $this->login($m);
        $this->withTokenHeader($token)->json('delete', '/api/member/'.$m->member_id)->assertStatus(200);
        try{
            $m->refresh();
            $this->fail("Member was not deleted");
        } catch (ModelNotFoundException $e) {
            // Expected
        }        
    }

    public function testDeleteById()
    {
        $regular = $this->createMember();
        $token = JWTAuth::fromUser($regular);
        // Non existing member
        $this->withTokenHeader($token)->json('DELETE', '/api/member/'.($regular->member_id+10))->assertStatus(404);
        $manager = $this->createMember(Member::TYPE_MANAGER);
        // regular can't delete anybody else
        $this->withTokenHeader($token)->json('DELETE', '/api/member/'.$manager->member_id)->assertStatus(403);
        
        //$token = JWTAuth::fromUser($manager);
        $token = $this->login($manager);
        $this->withTokenHeader($token)->json('DELETE', '/api/member/'.$regular->member_id)->assertStatus(200);
        try {
            $regular->refresh();
            $this->fail("Member was not deleted");
        } catch(ModelNotFoundException $e) {
            // Expected
        }
        try{
            $manager->refresh();
        }catch (ModelNotFoundException $e) {
            $this->fail("Manager was deleted by mistake");
        }
        $this->assertEquals(1, Member::count());
    }

    public function testGetMember()
    {
        // No token no coke
        $this->json('GET', 'api/member')->assertStatus(401);
        $this->json('GET', 'api/member/1')->assertStatus(404);

        $regular = $this->createMember();
        $token = JWTAuth::fromUser($regular);
        // get self
        $this->withTokenHeader($token)
            ->json('GET','api/member')
            ->assertStatus(200)
            ->assertJsonFragment(['member_id'=>$regular->member_id]);
        // get self by id
        $this->withTokenHeader($token)
            ->json('GET','api/member/'.$regular->member_id)
            ->assertStatus(200)
            ->assertJsonFragment(['member_id'=>$regular->member_id]);
        // cant get non existing
        $this->withTokenHeader($token)
            ->json('GET','api/member/2')
            ->assertStatus(404);

        $regular2 = $this->createMember(Member::TYPE_MANAGER);
        $manager = $this->createMember(Member::TYPE_MANAGER);
        // regular cant get another regular
        $this->withTokenHeader($token)
            ->json('GET','api/member/'.$regular2->member_id)
            ->assertStatus(403);
        // regular cant get manager
        $this->withTokenHeader($token)
            ->json('GET','api/member/'.$manager->member_id)
            ->assertStatus(403);

        //$token = JWTAuth::fromUser($manager);
        $token = $this->login($manager);
        // Manager can get regular
        $this->withTokenHeader($token)
            ->json('GET', 'api/member/'.$regular2->member_id)
            ->assertStatus(200)
            ->assertJsonFragment(['member_id'=>$regular2->member_id, 'email'=>$regular2->email]);    
            
        $manager2 = $this->createMember(Member::TYPE_MANAGER);
        // Manager can get another manager
        $this->withTokenHeader($token)
            ->json('GET', 'api/member/'.$manager2->member_id)
            ->assertStatus(200)
            ->assertJsonFragment(['member_id'=>$manager2->member_id, 'email'=>$manager2->email]);
        $admin = $this->createMember(Member::TYPE_ADMIN);
        // Manager cant get admin
        $this->withTokenHeader($token)
            ->json('GET', '/api/member/'.$admin->member_id)
            ->assertStatus(403);
        
        $token = $this->login($admin);
        // admin can get manager
        $this->withTokenHeader($token)
            ->json('GET', '/api/member/'.$manager2->member_id)
            ->assertStatus(200);
        // Admin can get regular2
        $this->withTokenHeader($token)->json('GET','api/member/'.$regular2->member_id)->assertStatus(200);

        $admin2 = $this->createMember(Member::TYPE_ADMIN);
        $this->withTokenHeader($token)->json('GET', '/api/member/'.$admin2->member_id)->assertStatus(200)
            ->assertJsonFragment(['member_id'=>$admin2->member_id]);
    }
}