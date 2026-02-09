<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationCreated implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public $conversation;
    private $recipientId;

    public function __construct($conversation, $recipientId)
    {
        $conversation->load(['user1', 'user2', 'lastMessage.sender']);

        $this->conversation = $conversation;
        $this->recipientId = $recipientId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('users.' . $this->recipientId);
    }

    public function broadcastAs()
    {
        return 'conversation.created';
    }
}

