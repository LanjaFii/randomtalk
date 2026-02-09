<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return Conversation::where('id', $conversationId)
        ->where(function ($q) use ($user) {
            $q->where('user1_id', $user->id)
              ->orWhere('user2_id', $user->id);
        })
        ->exists();
});

Broadcast::channel('presence.online', function ($user) {
    return [
        'id' => $user->id,
        'name' => $user->name,
        'public_id' => $user->public_id,
    ];
});

Broadcast::channel('users.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
