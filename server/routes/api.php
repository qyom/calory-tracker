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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('member', 'MemberController@post');
Route::post('auth', 'AuthController@post');
Route::get('open', 'SomeController@open');

Route::group(['middleware' => ['jwt.verify:1']], function() {
    Route::get('auth', 'AuthController@get');
    Route::get('closed', 'SomeController@closed');
    Route::put('member/{memberId?}', 'MemberController@put');
});