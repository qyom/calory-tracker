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
     * Determine whether the user can update a member
     *
     * @param  \App\Member  $memberMe
     * @param  \App\Member  $memberPut
     * @return mixed
     */
    public function update(Member $memberMe, Member $memberPut)
    {
        return 
            $memberMe->member_id == $memberPut->member_id // updating self
            || (
                // Not a regular self updates someone with equal or weaker role type
                (Member::compareRoles($memberMe->role_type, Member::TYPE_REGULAR) === 1) &&
                (Member::compareRoles($memberMe->role_type, $memberPut->role_type) >= 0)
            );
    }
}
