<?php

namespace Tests;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

use App\Member, App\Meal;
use JWTAuth;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, DatabaseMigrations;

    const TEST_PWD = 'toptaltest';

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
            'password' => bcrypt(self::TEST_PWD),
        ]);
    }

    protected function login($member)
    {
        return auth()->login($member);
    }

    protected function createMeals(Member $member, $total = 1)
    {
        while($total-- > 0) {
            $member->meals()->save(factory(Meal::class)->make());
        }
        return $member->meals;
    }
}