import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Show({ conversation }) {
    const { auth } = usePage().props;

    const [messages, setMessages] = useState(conversation.messages);
    const [realtimeStatus, setRealtimeStatus] = useState('inactive');
    const messagesEndRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    /* 🔥 Realtime (AUTRES utilisateurs seulement) */
    useEffect(() => {
        if (!window.Echo) {
            console.warn('Echo not available — realtime disabled');
            setRealtimeStatus('unavailable');
            return;
        }

        const channelName = `conversation.${conversation.id}`;
        const channel = window.Echo.private(channelName);

        const handler = (e) => {
            console.info('Realtime event received:', e);

            // ⛔ Ignore les messages envoyés par moi-même
            if (e.message.sender_id === auth.user.id) {
                return;
            }

            setRealtimeStatus('received');
            setMessages(prev => [...prev, e.message]);
        };

        channel.listen('.message.sent', handler);

        return () => {
            try {
                channel.stopListening('.message.sent', handler);
            } catch (err) {}

            try {
                window.Echo.leave(`private-${channelName}`);
            } catch (err) {}

            setRealtimeStatus('inactive');
        };
    }, [conversation.id, auth.user.id]);

    /* ✅ Auto-scroll */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const submit = (e) => {
        e.preventDefault();

        if (!data.content.trim()) return;

        // ⚡ Optimistic UI
        const tempMessage = {
            id: `temp-${Date.now()}`,
            content: data.content,
            sender_id: auth.user.id,
            created_at: new Date().toISOString(),
            pending: true,
        };

        setMessages(prev => [...prev, tempMessage]);

        post(route('messages.store', conversation.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                reset();

                const realMessage =
                    page.props.conversation?.messages?.slice(-1)[0];

                if (!realMessage) return;

                // 🔁 Remplacer le message temporaire
                setMessages(prev =>
                    prev.map(m =>
                        m.pending ? realMessage : m
                    )
                );
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Conversation
                    <span className="ml-3 text-sm font-normal text-gray-500">
                        Realtime: {realtimeStatus}
                    </span>
                </h2>
            }
        >
            <Head title="Conversation" />

            <div className="mx-auto max-w-4xl py-6 flex flex-col h-[80vh]">
                <div className="flex-1 overflow-y-auto space-y-4 bg-white p-4 rounded-lg shadow">
                    {messages.length === 0 && (
                        <p className="text-gray-500 text-center">
                            Aucun message pour l’instant 👀
                        </p>
                    )}

                    {messages.map((message) => {
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

                                    <div className="mt-1 text-xs opacity-70 text-right">
                                        {message.created_at
                                            ? new Date(message.created_at).toLocaleString()
                                            : '…'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={submit} className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Écris un message…"
                        className="flex-1 rounded-lg border px-4 py-2"
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                        Envoyer
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
