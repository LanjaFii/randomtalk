<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ConversationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConversationController extends Controller
{
    public function index(Request $request, ConversationService $service)
    {
        return Inertia::render('Conversations/Index', [
            'conversations' => $service->listForUser($request->user()),
        ]);
    }

    public function store(Request $request, ConversationService $service)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $otherUser = User::findOrFail($request->user_id);

        $conversation = $service->getOrCreate(
            $request->user(),
            $otherUser
        );

        return redirect()->route('conversations.show', $conversation);
    }

    public function show($id)
    {
        $conversation = \App\Models\Conversation::with([
            'messages.sender',
            'user1',
            'user2',
        ])->findOrFail($id);

        return Inertia::render('Conversations/Show', [
            'conversation' => $conversation,
        ]);
    }

    public function random(Request $request, ConversationService $service)
    {
        $conversation = $service->startRandomConversation($request->user());

        if (!$conversation) {
            return back()->with('error', 'Aucun utilisateur en ligne pour le moment.');
        }

        return redirect()->route('conversations.show', $conversation);
    }

}
