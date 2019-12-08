<?php

use Illuminate\Http\Request;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => ['jwt.verify:0','cors']], function() {
    Route::post('member', 'MemberController@post')->middleware('can:create,App\Member');
    Route::post('auth', 'AuthController@post');
    Route::get('open', 'SomeController@open');
});

Route::group(['middleware' => ['jwt.verify:1','cors']], function() {
    Route::get('auth', 'AuthController@get');
    Route::delete('auth', 'AuthController@delete');
    Route::get('closed', 'SomeController@closed');

    Route::get('member/{member}', 'MemberController@get')->middleware('can:view,member');
    Route::get('member', 'MemberController@get');

    Route::put('member/{member}', 'MemberController@put')->middleware('can:update,member');
    Route::put('member', 'MemberController@put');

    Route::delete('member/{member}', 'MemberController@delete')->middleware('can:delete,member');
    Route::delete('member', 'MemberController@delete');

    Route::get('members', 'MembersController@get')->middleware('can:view-many,App\Member');

    #MEALS
    Route::get('meal/{meal}', 'MealController@get')->middleware('can:view,meal');
    Route::post('meal', 'MealController@post')->middleware('can:create,App\Meal');
    Route::put('meal/{meal}', 'MealController@put')->middleware('can:update,meal');
    Route::delete('meal/{meal}', 'MealController@delete')->middleware('can:delete,meal');

    Route::get('meals', 'MealsController@get');
    Route::get('member/{member}/meals', 'MealsController@get')->middleware('can:view-many,App\Meal,member');
});

Route::model('member', App\Member::class);
Route::model('meal', App\Meal::class);