<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageDelivered implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public array $message;

    public function __construct(Message $message)
    {
        $this->message = [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'delivered_at' => optional($message->delivered_at)->toISOString(),
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
        return 'message.delivered';
    }
}
