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

    public function create(Member $self)
    {
        if (request()->has('member_id')) {
            return request()->get('member_id') == $self->member_id ||
                Member::TYPE_ADMIN == $self->role_type;
        }
        return true;
    }

    public function update(Member $self, Meal $meal)
    {
        return $meal->member_id == $self->member_id ||
                Member::TYPE_ADMIN == $self->role_type;
    }

    public function delete(Member $self, Meal $meal)
    {
        return $meal->member_id == $self->member_id ||
                Member::TYPE_ADMIN == $self->role_type;
    }

    public function viewMany(Member $mSelf, Member $mViewed)
    {
        return $mSelf->member_id == $mViewed->member_id ||
            $mSelf->role_type==Member::TYPE_ADMIN;
    }
}
