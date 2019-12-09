<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Member extends Authenticatable implements JWTSubject
{
    use Notifiable;

    const TYPE_REGULAR = 'REGULAR';
    const TYPE_MANAGER = 'MANAGER';
    const TYPE_ADMIN = 'ADMIN';
    public static $rolesMap = [
        self::TYPE_REGULAR => 10,
        self::TYPE_MANAGER => 20,
        self::TYPE_ADMIN => 30,
    ];
    const SALT = '%j@^@i+-d2';

    protected $primaryKey = 'member_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'max_calories_per_day', 'creator_id', 'role_type'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    protected $attributes = array(
        'role_type' => self::TYPE_REGULAR
    );

    /**
     * Get the meals of the member
     */
    public function meals()
    {
        return $this->hasMany('App\Meal', 'member_id');
    }
      

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    public function getJWTCustomClaims()
    {
        return [];
    }

    public static function compareRoles($role1, $role2) {
        return self::$rolesMap[$role1] <=> self::$rolesMap[$role2];
    }

    public function getActivationToken()
    {
        return md5($this->member_id.self::SALT.microtime());
    }
}