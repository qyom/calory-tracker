<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Member;
use Sichikawa\LaravelSendgridDriver\SendGrid;

class MemberCreated extends Mailable
{
    use Queueable, SerializesModels, Sendgrid;

    public $member;
    public $link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($member)
    {
        $this->member = $member;
        $this->link = $this->getActivationLink($member);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email-member-created')->subject("Welcome to Your Meals App");
    }

    private function getActivationLink(Member $member)
    {
        return "http://localhost:8081/auth/hash/".$member->getActivationToken();
    }
}
