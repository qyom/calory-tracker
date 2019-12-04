<?php

namespace App\Policies;

use App\Member;
use Illuminate\Auth\Access\HandlesAuthorization;

class MemberPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create members.
     *
     * @param  \App\Member  $member
     * @return mixed
     */
    public function create(?Member $member)
    {
        return !$member || $member->role_type != Member::TYPE_REGULAR;
    }

    /**
     * Determine whether the user can view a member
     *
     * @param  \App\Member  $mSelf
     * @param  \App\Member  $mGet
     * @return mixed
     */
    public function view(Member $mSelf, Member $mGet)
    {
        return 
            $mSelf->member_id == $mGet->member_id // viewing self
            || (
                // Not a regular self updates someone with equal or weaker role type
                (Member::compareRoles($mSelf->role_type, Member::TYPE_REGULAR) === 1) &&
                (Member::compareRoles($mSelf->role_type, $mGet->role_type) >= 0)
            );
    }

    /**
     * Determine whether the user can update a member
     *
     * @param  \App\Member  $mSelf
     * @param  \App\Member  $mPut
     * @return mixed
     */
    public function update(Member $mSelf, Member $mPut)
    {
        return 
            $mSelf->member_id == $mPut->member_id // updating self
            || (
                // Not a regular self updates someone with equal or weaker role type
                (Member::compareRoles($mSelf->role_type, Member::TYPE_REGULAR) === 1) &&
                (Member::compareRoles($mSelf->role_type, $mPut->role_type) >= 0)
            );
    }
    /**
     * Determine whether the user can delete a member
     *
     * @param  \App\Member  $mSelf
     * @param  \App\Member  $mDelete
     * @return mixed
     */
    public function delete(Member $mSelf, Member $mDelete)
    {
        return 
            $mSelf->member_id == $mDelete->member_id // deleting self
            || (
                // Not a regular self updates someone with equal or weaker role type
                (Member::compareRoles($mSelf->role_type, Member::TYPE_REGULAR) === 1) &&
                (Member::compareRoles($mSelf->role_type, $mDelete->role_type) >= 0)
            );
    }

    public function viewMany(Member $mSelf)
    {
        return $mSelf->role_type!=Member::TYPE_REGULAR;
    }
}
