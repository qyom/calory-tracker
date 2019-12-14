<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Member::class, 33)->create()
            ->each(function ($member) {
                $member->meals()->saveMany(factory(App\Meal::class, 22)->make(['member_id'=>$member->member_id]));
            });
    }
}
