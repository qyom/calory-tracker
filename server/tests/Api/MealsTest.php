<?php

namespace Tests\Api;

use Tests\TestCase;
use JWTFactory, JWTAuth;
use App\Member, App\Meal;
use Illuminate\Support\Str;

class MealsTest extends TestCase
{
    public function testAccess()
    {
        $r1 = $this->createMember();
        $this->createMeals($r1, 10);
        $this->get('/api/meals')->assertStatus(401);
        $this->get('/api/member/'.$r1->member_id.'/meals')->assertStatus(401);
        $token = $this->login($r1);
        // Adding a manager
        $m = $this->createMember(Member::TYPE_MANAGER);
        $this->createMeals($m, 2);
        // Adding Admin
        $a = $this->createMember(Member::TYPE_ADMIN);
        $this->createMeals($a, 5);

        // Regular member can't access neither manager nor admin meals
        $this->withTokenHeader($token)->get('/api/member/'.$m->member_id.'/meals')->assertStatus(403);
        $this->withTokenHeader($token)->get('/api/member/'.$a->member_id.'/meals')->assertStatus(403);
        // But it can read all its own meals allright
        $this->withTokenHeader($token)->get('/api/meals')->assertStatus(200)->assertJsonCount(10);
        $this->withTokenHeader($token)->get('/api/member/'.$r1->member_id.'/meals')->assertStatus(200)->assertJsonCount(10);
        
        // Manager can't access neither regular nor admin meals
        $token = $this->login($m);
        $this->withTokenHeader($token)->get('/api/member/'.$r1->member_id.'/meals')->assertStatus(403);
        $this->withTokenHeader($token)->get('/api/member/'.$a->member_id.'/meals')->assertStatus(403);
        // But it can read all its own meals allright
        $this->withTokenHeader($token)->get('/api/meals')->assertStatus(200)->assertJsonCount(2);
        $this->withTokenHeader($token)->get('/api/member/'.$m->member_id.'/meals')->assertStatus(200)->assertJsonCount(2);
        
        // Admin can
        $token = $this->login($a);
        // But it can read all its own meals allright
        $this->withTokenHeader($token)->get('/api/member/'.$r1->member_id.'/meals')->assertStatus(200)->assertJsonCount(10);
        $this->withTokenHeader($token)->get('/api/member/'.$m->member_id.'/meals')->assertStatus(200)->assertJsonCount(2);
        $this->withTokenHeader($token)->get('/api/member/'.$a->member_id.'/meals')->assertStatus(200)->assertJsonCount(5);
        $this->withTokenHeader($token)->get('/api/meals')->assertStatus(200)->assertJsonCount(5);        
    }

    public function testFilters()
    {
        $regular = $this->createMember();
        $this->makeMealsWithDates($regular, [
            '2019-11-11 10:00:00',
            '2019-11-11 10:59:00',
            '2019-11-11 10:59:59',
            '2019-11-11 11:00:00',
            '2019-11-11 12:00:00',
            '2019-11-11 13:00:00',
            '2019-11-11 14:00:00',
            '2019-11-11 23:59:59',
            '2019-11-12 23:59:59',
            '2019-11-13 23:59:59',
            '2018-11-13 23:59:59',
            '2020-11-13 23:59:59',
        ]);
        $token = $this->login($regular);
        // Invalid
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-31',
            'intake_date_to' => '2019',
            'intake_hours_from' => -1,
            'intake_hours_to' => 24
        ])->assertStatus(400)->assertJsonStructure(
            ['intake_date_from', 'intake_date_to', 'intake_hours_from','intake_hours_to']
        );
        // valid
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-11',
        ])->assertStatus(200)->assertJsonCount(11);
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-11',
            'intake_date_to' => '2019-11-11'
        ])->assertStatus(200)->assertJsonCount(8);
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-11',
            'intake_date_to' => '2019-11-11',
            'intake_hours_from' => 10,
            'intake_hours_to' => 10
        ])->assertStatus(200)->assertJsonCount(3);
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-11',
            'intake_date_to' => '2019-11-11',
            'intake_hours_from' => 10,
            'intake_hours_to' => 11
        ])->assertStatus(200)->assertJsonCount(4);
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-11',
            'intake_date_to' => '2019-11-11',
            'intake_hours_to' => 10
        ])->assertStatus(200)->assertJsonCount(3);
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-11',
            'intake_date_to' => '2019-11-11',
            'intake_hours_from' => 14,            
        ])->assertStatus(200)->assertJsonCount(2);
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-11',
            'intake_date_to' => '2019-11-11',
            'intake_hours_from' => 14,   
            'intake_hours_to' => 23         
        ])->assertStatus(200)->assertJsonCount(2);
        $this->withTokenHeader($token)->json('GET', '/api/meals',[
            'intake_date_from' => '2019-11-11',
            'intake_date_to' => '2019-11-12'
        ])->assertStatus(200)->assertJsonCount(9);
    }

    private function makeMealsWithDates(Member $member, $dates)
    {
        foreach($dates as $date) {
            $member->meals()->save(factory(Meal::class)->make(
                ['date_intake' => $date])
            );
        }
    }
}
