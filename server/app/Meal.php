<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    protected $primaryKey = 'meal_id';
    protected $fillable = [
        'name', 'calories', 'date_intake', 'member_id'
    ];

    /**
     * Get the member that owns the meal
     */
    public function member()
    {
        return $this->belongsTo('App\Meal', 'member_id');
    }
}
