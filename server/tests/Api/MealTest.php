<?php

namespace Tests\Api;

use Tests\TestCase;
use JWTFactory, JWTAuth;
use App\Member, App\Meal;
use Illuminate\Support\Str;

class MealTest extends TestCase
{
    public function testGet()
    {
        $this->get("/api/meal")->assertStatus(404);
        $this->get("/api/meal/1")->assertStatus(401);
        $r1 = $this->createMember();
        $r2 = $this->createMember();
        $meals = $this->createMeals($r2, 10);
        //echo "\$meals[0]->meal_id = ". $meals[0]->meal_id, "\n";
        // Not authorized
        $this->get("/api/meal/".$meals[0]->meal_id)->assertStatus(401);
        $token = $this->login($r1);
        $this->withTokenHeader($token)->get('/api/meal/100')->assertStatus(404);
        $this->withTokenHeader($token)->get('/api/meal/'.$meals[0]->meal_id)->assertStatus(403);
        $token = $this->login($r2);
        $this->withTokenHeader($token)->get('/api/meal/'.$meals[0]->meal_id)->assertStatus(200)->assertJsonStructure([
            'meal_id', 'member_id', 'name', 'calories', 'date_intake'
        ]);
        $this->withTokenHeader($token)->get('/api/meal/100')->assertStatus(404);
    }
    private function createMeals(Member $member, $total = 1)
    {
        while($total-- > 0) {
            $member->meals()->save(factory(Meal::class)->make());
        }
        return $member->meals;
    }
}
