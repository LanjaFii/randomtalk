<?php

namespace App\Http\Controllers;

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

        // Sécurité : vérifier que l'utilisateur fait partie de la conversation
        if (
            $conversation->user1_id !== $request->user()->id &&
            $conversation->user2_id !== $request->user()->id
        ) {
            abort(403);
        }

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        return redirect()->route('conversations.show', $conversation);
    }
}
