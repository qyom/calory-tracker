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

    private function createMeals(Member $member, $total = 1)
    {
        while($total-- > 0) {
            $member->meals()->save(factory(Meal::class)->make());
        }
        return $member->meals;
    }
}
