<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, Conversation $conversation)
    {
        $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        // 🔒 Sécurité : l’utilisateur doit faire partie de la conversation
        if (
            $conversation->user1_id !== $request->user()->id &&
            $conversation->user2_id !== $request->user()->id
        ) {
            abort(403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        // 📡 Broadcast realtime (receiver seulement)
        broadcast(new MessageSent($message))->toOthers();

        return back();
    }
}
