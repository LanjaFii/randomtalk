import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ conversationId }) {
    return (
        <AuthenticatedLayout>
            <Head title="Conversation" />

            <div className="p-6">
                <h1 className="text-xl font-bold">
                    Conversation #{conversationId}
                </h1>

                <p className="text-gray-500 mt-2">
                    Chat en temps réel → plus tard 😏
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
