import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ conversations }) {
    const { auth } = usePage().props;
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(() => {
        // utilise l'état global géré par AuthenticatedLayout
        setOnlineUsers(window.__onlineUsers || []);

        const handler = (e) => {
            setOnlineUsers(e.detail || []);
        };

        window.addEventListener('onlineUsersUpdated', handler);

        return () => {
            window.removeEventListener('onlineUsersUpdated', handler);
        };
    }, []);

    const getOtherUser = (conversation) => {
        return conversation.user1.id === auth.user.id
            ? conversation.user2
            : conversation.user1;
    };

    const formatLastSeen = (user) => {
        if (!user.last_seen) return 'Hors ligne';

        const diff = Math.floor(
            (Date.now() - new Date(user.last_seen)) / 1000
        );

        if (diff < 60) return 'il y a quelques secondes';
        if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
        return `il y a ${Math.floor(diff / 86400)} j`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Conversations" />

            <div className="mx-auto max-w-4xl space-y-4 py-8">
                <h1 className="text-2xl font-bold">Conversations</h1>

                {conversations.map(conversation => {
                    const otherUser = getOtherUser(conversation);
                    const isOnline = onlineUsers.includes(otherUser.id);

                    return (
                        <Link
                            key={conversation.id}
                            href={route('conversations.show', conversation.id)}
                            className="flex items-center gap-4 rounded-lg border bg-white p-4"
                        >
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {otherUser.name[0]}
                            </div>

                            <div className="flex-1">
                                <div className="font-semibold">
                                    {otherUser.name}
                                </div>

                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            isOnline ? 'bg-green-500' : 'bg-gray-400'
                                        }`}
                                    />
                                    {isOnline
                                        ? 'En ligne'
                                        : formatLastSeen(otherUser)}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </AuthenticatedLayout>
    );
}
