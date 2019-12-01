<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('members', function (Blueprint $table) {
            $table->increments('member_id');            
            $table->enum('role_type', ['REGULAR','MANAGER','ADMIN'])->default('REGULAR');
            $table->unsignedInteger('creator_id')->nullable();
            $table->string('email')->unique();
            $table->string('password');

            $table->string('first_name');
            $table->string('last_name');
            $table->integer('max_calories_per_day');
            //$table->timestamp('email_verified_at')->nullable();            
            //$table->rememberToken();
            $table->timestamps();
            // cascade delete children when deleting parent
            $table->foreign('creator_id')->references('member_id')->on('members')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('members');
    }
}
