<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use App\Member;
use App\Meal;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(Meal::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'calories' => rand(0, 10000),
        'date_intake' => "2019-11-29 13:13:13"
        //'member_id' => $member->member_id,
    ];
});
