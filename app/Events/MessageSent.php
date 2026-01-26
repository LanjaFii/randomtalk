<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public array $message;

    public function __construct(Message $message)
    {
        // Force le chargement du sender
        $message->load('sender');

        $this->message = [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'sender_id' => $message->sender_id,
            'content' => $message->content,

            // ✅ FIX DÉFINITIF
            'created_at' => $message->created_at
                ? $message->created_at->toISOString()
                : Carbon::now()->toISOString(),

            'sender' => [
                'id' => $message->sender->id,
                'name' => $message->sender->name,
            ],
        ];
    }

    public function broadcastOn()
    {
        return new PrivateChannel(
            'conversation.' . $this->message['conversation_id']
        );
    }

    public function broadcastAs()
    {
        return 'message.sent';
    }
}
