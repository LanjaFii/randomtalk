import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Show({ conversation }) {
    const { auth } = usePage().props;
    const messagesEndRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    /* ✅ Auto-scroll en bas */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.messages]);

    const submit = (e) => {
        e.preventDefault();

        if (!data.content.trim()) return; // 🚫 message vide

        post(
            route('messages.store', conversation.id),
            {
                preserveScroll: true,
                onSuccess: () => reset(),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Conversation
                </h2>
            }
        >
            <Head title="Conversation" />

            <div className="mx-auto max-w-4xl py-6 flex flex-col h-[80vh]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 bg-white p-4 rounded-lg shadow">
                    {conversation.messages.length === 0 && (
                        <p className="text-gray-500 text-center">
                            Aucun message pour l’instant 👀
                        </p>
                    )}

                    {conversation.messages.map((message) => {
                        const isMe = message.sender_id === auth.user.id;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${
                                    isMe ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                                        isMe
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-900'
                                    }`}
                                >
                                    <p>{message.content}</p>

                                    {/* 🕒 Date + heure */}
                                    <div className="mt-1 text-xs opacity-70 text-right">
                                        {new Date(message.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

                {/* Formulaire */}
                <form
                    onSubmit={submit}
                    className="mt-4 flex gap-2"
                >
                    <input
                        type="text"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Écris un message…"
                        className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring"
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Envoyer
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
