import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ conversationId }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Conversation #{conversationId}
                </h2>
            }
        >
            <Head title={`Conversation ${conversationId}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="h-[70vh] rounded-lg bg-white p-6 shadow">
                        <p className="text-gray-500">
                            Les messages arriveront ici 👀
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
