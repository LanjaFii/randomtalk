<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\User;

class ConversationService
{
    /**
     * Récupérer ou créer une conversation unique entre deux users
     */
    public function getOrCreate(User $userA, User $userB): Conversation
    {
        // 🔒 Toujours trier pour garantir l’unicité
        [$user1Id, $user2Id] = collect([$userA->id, $userB->id])->sort()->values();

        return Conversation::firstOrCreate([
            'user1_id' => $user1Id,
            'user2_id' => $user2Id,
        ]);
    }

    /**
     * Lister les conversations d’un utilisateur
     */
    public function listForUser(User $user)
    {
        return Conversation::where('user1_id', $user->id)
            ->orWhere('user2_id', $user->id)
            ->with(['user1', 'user2', 'lastMessage.sender'])
            ->withCount([
                'messages as unread_count' => function ($q) use ($user) {
                    $q->where('sender_id', '!=', $user->id)
                        ->whereNull('seen_at');
                },
            ])
            ->latest()
            ->get();
    }

    /**
     * Trouver un utilisateur en ligne au hasard (pour la conversation aléatoire)
     */
    public function findRandomOnlineUser(User $currentUser): ?User
    {
        return User::where('id', '!=', $currentUser->id)
            ->where('status', 'online')
            ->inRandomOrder()
            ->first();
    }

    /**
     * Démarrer une conversation aléatoire avec un utilisateur en ligne
     */
    public function startRandomConversation(User $currentUser): ?Conversation
    {
        $otherUser = $this->findRandomOnlineUser($currentUser);

        if (!$otherUser) {
            return null;
        }

        return $this->getOrCreate($currentUser, $otherUser);
    }


}
