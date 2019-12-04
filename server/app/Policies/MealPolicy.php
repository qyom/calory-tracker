<?php

namespace App\Policies;

use App\Member;
use App\Meal;
use Illuminate\Auth\Access\HandlesAuthorization;

class MealPolicy
{
    use HandlesAuthorization;

    public function view(Member $self, Meal $meal)
    {
        return $meal->member_id == $self->member_id || $self->role_type == Member::TYPE_ADMIN;
    }
}
