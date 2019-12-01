<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Member;
class MemberTest extends TestCase
{
    public function testsInvalidPostInputs()
    {
        $payloadValid = [
            'first_name' => 'John',
            'last_name' => 'Bayron',
            'email' => 'very.”(),:;<>[]”.VERY.”very@\\ "very”.unusual@strange.example.com', // This is a valid email haha!
            'max_calories_per_day' => 100,
            'password' => 'toptaltest',
            'password_confirmation' => 'toptaltest',
        ];
        // Empty first_name
        $this->json(
            'post',
            '/api/member',
            ['first_name'=>''] + $payloadValid
        )->assertStatus(401)->assertJsonStructure(['first_name']);
        // Long first_name
        $this->json(
            'post',
            '/api/member',
            ['first_name'=>str_pad("", 256, "what-a-long-name")] + $payloadValid
        )->assertStatus(401)->assertJsonStructure(['first_name']);
        // Empty last_name
        $this->json(
            'post',
            '/api/member',
            ['last_name'=>''] + $payloadValid
        )->assertStatus(401)->assertJsonStructure(['last_name']);
        // Long last_name
        $this->json(
            'post',
            '/api/member',
            [
                'last_name'=>str_pad("", 256, "what-a-long-last-name"),
                'first_name'=>str_pad("", 255, "not-quite-long-first-name")
            ] + $payloadValid
        )->assertStatus(401)->assertJsonStructure(['last_name'])->assertJsonMissingValidationErrors(['first_name']);
        // Invalid email
        $this->json(
            'post',
            '/api/member',
            [
                'email'=>'#@%^%#$@#$@#.com'
            ] + $payloadValid
        )->assertStatus(401)->assertJsonStructure(['email']);
        // Mismatching password_confirmation field
        $this->json(
            'post',
            '/api/member',
            ['password_confirmation'=>'toptaltes'] + $payloadValid
        )->assertStatus(401)->assertJsonStructure(['password']);
        // Mismatching password field
        $this->json(
            'post',
            '/api/member',
            ['password'=>'optaltest'] + $payloadValid
        )->assertStatus(401)->assertJsonStructure(['password']);
        // invalid calories
        $this->json(
            'post',
            '/api/member',
            ['max_calories_per_day'=>-1] + $payloadValid
        )->assertStatus(401)->assertJsonStructure(['max_calories_per_day']);
        // Duplicate email entries
        $member = factory(Member::class)->create([
            'email' => $payloadValid['email'],
            'password' => bcrypt($payloadValid['password']),
        ]);
        $this->json(
            'post',
            '/api/member',
            $payloadValid
        )->assertStatus(401)->assertJsonStructure(['email']);
    }

    public function testsValidPostInputs()
    {
        $payload = [
            'first_name' => 'John',
            'last_name' => 'Bayron',
            'email' => 'johswsnx@toptal.com',
            'max_calories_per_day' => 100,
            'password' => 'toptaltest',
            'password_confirmation' => 'toptaltest',
        ];
        $response = $this->json('post', '/api/member', $payload);
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
}