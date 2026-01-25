import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ conversations }) {
    const { auth } = usePage().props;

    const getOtherUser = (conversation) => {
        return conversation.user1.id === auth.user.id
            ? conversation.user2
            : conversation.user1;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Conversations" />

            <div className="max-w-4xl mx-auto py-8 space-y-4">
                <h1 className="text-2xl font-bold">Conversations</h1>

                {conversations.length === 0 && (
                    <p className="text-gray-500">Aucune conversation</p>
                )}

                {conversations.map((conversation) => {
                    const otherUser = getOtherUser(conversation);

                    return (
                        <Link
                            key={conversation.id}
                            href={route('conversations.show', conversation.id)}
                            className="block rounded-lg border p-4 hover:bg-gray-50"
                        >
                            <div className="font-semibold">
                                {otherUser.name}
                            </div>

                            <div className="text-sm text-gray-500">
                                {otherUser.status === 'online'
                                    ? '🟢 En ligne'
                                    : '⚫ Hors ligne'}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </AuthenticatedLayout>
    );
}
