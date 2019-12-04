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

Route::group(['middleware' => ['jwt.verify:0']], function() {
    Route::post('member', 'MemberController@post')->middleware('can:create,App\Member');
    Route::post('auth', 'AuthController@post');
    Route::get('open', 'SomeController@open');
});

Route::group(['middleware' => ['jwt.verify:1']], function() {
    Route::get('auth', 'AuthController@get');
    Route::get('closed', 'SomeController@closed');

    Route::get('member/{member}', 'MemberController@get')->middleware('can:get,member');
    Route::get('member', 'MemberController@get');

    Route::put('member/{member}', 'MemberController@put')->middleware('can:update,member');
    Route::put('member', 'MemberController@put');

    Route::delete('member/{member}', 'MemberController@delete')->middleware('can:delete,member');
    Route::delete('member', 'MemberController@delete');
});

Route::model('member', App\Member::class);