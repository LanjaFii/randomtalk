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

            <div className="mx-auto max-w-4xl space-y-4 py-8">
                <h1 className="text-2xl font-bold">Conversations</h1>

                {conversations.length === 0 && (
                    <p className="text-sm text-gray-500">
                        Aucune conversation pour le moment.
                    </p>
                )}

                <div className="space-y-2">
                    {conversations.map((conversation) => {
                        const otherUser = getOtherUser(conversation);
                        const isOnline = otherUser.status === 'online';

                        return (
                            <Link
                                key={conversation.id}
                                href={route('conversations.show', conversation.id)}
                                className="group flex items-center gap-4 rounded-lg border bg-white p-4 transition hover:bg-gray-50 hover:shadow-sm"
                            >
                                {/* Avatar */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                                    {otherUser.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Infos */}
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800 group-hover:text-gray-900">
                                        {otherUser.name}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span
                                            className={`h-2 w-2 rounded-full ${
                                                isOnline ? 'bg-green-500' : 'bg-gray-400'
                                            }`}
                                        />
                                        {isOnline ? 'En ligne' : 'Hors ligne'}
                                    </div>
                                </div>

                                {/* Chevron */}
                                <div className="text-gray-300 group-hover:text-gray-400">
                                    →
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
