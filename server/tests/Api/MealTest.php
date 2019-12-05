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
        $this->get("/api/meal")->assertStatus(405);
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
    public function testPost()
    {
        $totalCount = 0;
        $this->post('/api/meal')->assertStatus(401);
        $r1 = $this->createMember();
        $r2 = $this->createMember();
        $token = $this->login($r1);
        // Empty invalid payloads
        $this->withTokenHeader($token)->post('/api/meal', [])->assertStatus(400);
        $this->withTokenHeader($token)->post('/api/meal', ['member_id' => $r2->member_id])->assertStatus(403);
        $this->withTokenHeader($token)->post('/api/meal', [
            'name' => 'coffee'
        ])->assertStatus(400);
        $this->withTokenHeader($token)->post('/api/meal', [
            'name' => 'coffee',
            'calories' => 100
        ])->assertStatus(400);
        $this->withTokenHeader($token)->post('/api/meal', [
            'name' => 'coffee',
            'calories' => 100,
            'date_intake' => null
        ])->assertStatus(400);
        $this->withTokenHeader($token)->post('/api/meal', [
            'name' => 'coffee',
            'calories' => 100,
            'date_intake' => null
        ])->assertStatus(400);
        $this->withTokenHeader($token)->post('/api/meal', [
            'name' => 'coffee',
            'calories' => 100,
            'date_intake' => '2019-11-31 10:10:10'
        ])->assertStatus(400);
        $this->withTokenHeader($token)->post('/api/meal', [
            'name' => 'coffee',
            'calories' => 100,
            'date_intake' => '2019-11-30' // no time
        ])->assertStatus(400);
        $this->withTokenHeader($token)->post('/api/meal', $validInput = [
            'name' => 'coffee',
            'calories' => 100,
            'date_intake' => '2019-11-22 10:10:10'
        ])->assertStatus(201);
        $this->assertEquals(++$totalCount, Meal::count());

        $this->withTokenHeader($token)
            ->post('/api/meal', $validInput+['member_id'=>$r1->member_id])
            ->assertStatus(201);
        $this->assertEquals(++$totalCount, Meal::count());
        
        $this->withTokenHeader($token)
            ->post('/api/meal', ['member_id'=>$r2->member_id]+$validInput)
            ->assertStatus(403);

        // Manager can't add to someone else either
        $m = $this->createMember(Member::TYPE_MANAGER);
        $token = $this->login($m);
        $this->withTokenHeader($token)->post('/api/meal', ['member_id'=>$r2->member_id]+$validInput)
            ->assertStatus(403);
        $this->withTokenHeader($token)
            ->post('/api/meal', ['member_id'=>$m->member_id]+$validInput)
            ->assertStatus(201);
        $this->assertEquals(++$totalCount, Meal::count());
         
        // Admin can
         $a = $this->createMember(Member::TYPE_ADMIN);
         $token = $this->login($a);
         $this->withTokenHeader($token)->post('/api/meal', ['member_id'=>$r2->member_id]+$validInput)
             ->assertStatus(201);
         $this->assertEquals(++$totalCount, Meal::count());
         $this->withTokenHeader($token)
             ->post('/api/meal', ['member_id'=>$m->member_id]+$validInput)
             ->assertStatus(201);
         $this->assertEquals(++$totalCount, Meal::count());
         $this->withTokenHeader($token)
             ->post('/api/meal', ['member_id'=>$a->member_id]+$validInput)
             ->assertStatus(201);
         $this->assertEquals(++$totalCount, Meal::count());
         $this->withTokenHeader($token)
             ->post('/api/meal', $validInput)
             ->assertStatus(201);
         $this->assertEquals(++$totalCount, Meal::count());
    }

    public function testPut()
    {
        $this->put('/api/meal')->assertStatus(405);
        $this->put('/api/meal/1')->assertStatus(401);

        // Create a regular member with meals
        $r1 = $this->createMember();
        $meals = $this->createMeals($r1);
        $mealId1 = $meals[0]->meal_id;
        // Create another regular member
        $r2 = $this->createMember();
        $m1 = $this->createMember(Member::TYPE_MANAGER);
        $m2 = $this->createMember(Member::TYPE_MANAGER);
        $meals = $this->createMeals($m2);
        $mealId2 = ($meal = $meals[0])->meal_id;
        $a = $this->createMember(Member::TYPE_ADMIN);

        // Regular member can't update other's  meals
        $token = $this->login($r2);
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId1)->assertStatus(403);
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId2)->assertStatus(403);
        // Manager also can't update other's meals
        $token = $this->login($m1);
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId1)->assertStatus(403);
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId2)->assertStatus(403);
        $token = $this->login($m2);
        // Valid Access but invalid input
        // Empty request
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId2, [])->assertStatus(200);
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId2, [
            'name' => '',
            'calories' => null,
            'date_intake' => '2019-11-31 11:11:11'
        ])->assertStatus(400)->assertJsonStructure([
            'name', 'calories', 'date_intake'
        ]);

        // Valid Access Valid Input
        // name is updated
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId2, [
            'name' => 'New Name',
        ])->assertStatus(200);
        $meal->refresh();
        $this->assertEquals('New Name', $meal->name);
        // calories are updated
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId2, [
            'calories' => 12,
        ])->assertStatus(200);
        $meal->refresh();
        $this->assertEquals(12, $meal->calories);
        // date_intake
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId2, [
            'date_intake' => '2019-11-29 23:59:59',
        ])->assertStatus(200);
        $meal->refresh();
        $this->assertEquals('2019-11-29 23:59:59', $meal->date_intake);
        // All at once
        $this->withTokenHeader($token)->put('/api/meal/'.$mealId2, [
            'name' => 'Another new name',
            'calories' => 13,
            'date_intake' => '2019-11-29 00:00:00',
        ])->assertStatus(200);
        $meal->refresh();
        $this->assertEquals('Another new name', $meal->name);
        $this->assertEquals(13, $meal->calories);
        $this->assertEquals('2019-11-29 00:00:00', $meal->date_intake);
    }

    public function testDelete()
    {
        $this->delete('/api/meal')->assertStatus(405);
        $this->delete('/api/meal/1')->assertStatus(401);
        $r = $this->createMember();
        $meal = $this->createMeals($r)[0];
        $token=$this->login($r);
        $this->withTokenHeader($token)->delete('/api/meal/10')->assertStatus(404);
        $this->withTokenHeader($token)->delete('/api/meal/'.$meal->meal_id)->assertStatus(200);
        $this->assertEquals(0, Meal::count());

        $r2 = $this->createMember();
        $meal = $this->createMeals($r2)[0];
        $this->withTokenHeader($token)->delete('/api/meal/'.$meal->meal_id)->assertStatus(403);
        $m = $this->createMember(Member::TYPE_MANAGER);
        $token = $this->login($m);
        $this->withTokenHeader($token)->delete('/api/meal/'.$meal->meal_id)->assertStatus(403);
        // admin
        $a = $this->createMember(Member::TYPE_ADMIN);
        $token = $this->login($a);
        $this->withTokenHeader($token)->delete('/api/meal/'.$meal->meal_id)->assertStatus(200);
        $this->assertEquals(0, Meal::count());
    }

    private function createMeals(Member $member, $total = 1)
    {
        while($total-- > 0) {
            $member->meals()->save(factory(Meal::class)->make());
        }
        return $member->meals;
    }
}
