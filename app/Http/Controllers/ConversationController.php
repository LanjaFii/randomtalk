<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ConversationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConversationController extends Controller
{
    // Route d'affichage de la liste des conversations de l'utilisateur
    public function index(Request $request, ConversationService $service)
    {
        return Inertia::render('Conversations/Index', [
            'conversations' => $service->listForUser($request->user()),
        ]);
    }

    // Route de création d'une conversation à partir du public_id de l'autre utilisateur
    public function store(Request $request, ConversationService $service)
    {
        $request->validate([
            'public_id' => ['required', 'exists:users,public_id'],
        ]);

        $otherUser = User::where('public_id', $request->public_id)->firstOrFail();

        if ($otherUser->id === $request->user()->id) {
            return back()->withErrors([
                'public_id' => 'You cannot start a conversation with yourself.'
            ]);
        }

        $conversation = $service->getOrCreate(
            $request->user(),
            $otherUser
        );

        return redirect()->route('conversations.show', $conversation);
    }

    // Route d'affichage d'une conversation (avec tous les messages)
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

    // Route de démarrage d'une conversation aléatoire
    public function random(Request $request, ConversationService $service)
    {
        $conversation = $service->startRandomConversation($request->user());

        if (!$conversation) {
            return response()->json([
                'error' => 'Aucun utilisateur en ligne pour le moment.'
            ], 422);
        }

        $otherUser = $conversation->user1_id === $request->user()->id 
            ? $conversation->user2 
            : $conversation->user1;

        // ❗ PLUS DE REDIRECT
        return response()->json([
            'conversation' => [
                'id' => $conversation->id,
                'other_user' => [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'email' => $otherUser->email,
                ]
            ]
        ]);
    }

    // Route de recherche d'utilisateur par id public
    public function search(Request $request)
    {
        $user = User::where('public_id', $request->public_id)->first();

        return response()->json([
            'foundUser' => $user
        ]);
    }


}