<?php

namespace Tests;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

use App\Member;
use JWTAuth;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, DatabaseMigrations;

    public function setUp(): void
    {
        parent::setUp();
        Artisan::call('db:seed');
    }

    protected function withTokenHeader($token)
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ]);
    }

    protected function createMember($roleType=Member::TYPE_REGULAR)
    {
        return factory(Member::class)->create([
            'email' => Str::random(10).'@test.com',
            'role_type' => $roleType,
            'password' => bcrypt('toptaltest'),
        ]);
    }

    protected function getToken()
    {
        JWTAuth::parseToken()->authenticate();
        return JWTAuth::getToken();
    }
}
