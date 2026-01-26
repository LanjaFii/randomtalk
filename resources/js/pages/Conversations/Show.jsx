import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Show({ conversation }) {
    const { auth } = usePage().props;

    const [messages, setMessages] = useState(conversation.messages);
    const [realtimeStatus, setRealtimeStatus] = useState('inactive');

    /* 🟢 Online users (Presence) */
    const [onlineUsers, setOnlineUsers] = useState([]);

    /* ✍️ Typing */
    const [typingUser, setTypingUser] = useState(null);
    const typingTimeoutRef = useRef(null);

    const messagesEndRef = useRef(null);
    const channelRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    /* 👤 Autre utilisateur */
    const otherUser =
        conversation.user1.id === auth.user.id
            ? conversation.user2
            : conversation.user1;

    const isOtherOnline = onlineUsers.includes(otherUser.id);

    const formatLastSeen = () => {
        if (!otherUser.last_seen) return 'Hors ligne';

        const diff = Math.floor(
            (Date.now() - new Date(otherUser.last_seen)) / 1000
        );

        if (diff < 60) return 'vu il y a quelques secondes';
        if (diff < 3600) return `vu il y a ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `vu il y a ${Math.floor(diff / 3600)} h`;
        return `vu il y a ${Math.floor(diff / 86400)} j`;
    };

    /* 🔥 Realtime messages + typing + delivered / seen */
    useEffect(() => {
        if (!window.Echo) return;

        /* 💬 Conversation channel */
        const channelName = `conversation.${conversation.id}`;
        const channel = window.Echo.private(channelName);
        channelRef.current = channel;
        setRealtimeStatus('connected');

        /* 📩 Message reçu */
        const messageHandler = (e) => {
            const message = e.message;

            if (message.sender_id === auth.user.id) return;

            setMessages(prev => [...prev, message]);

            window.axios.post(route('messages.delivered', message.id));
        };

        channel.listen('.message.sent', messageHandler);

        channel.listen('.message.delivered', (e) => {
            setMessages(prev =>
                prev.map(m =>
                    m.id === e.message.id
                        ? { ...m, delivered_at: e.message.delivered_at }
                        : m
                )
            );
        });

        channel.listen('.message.seen', (e) => {
            setMessages(prev =>
                prev.map(m =>
                    m.id === e.message.id
                        ? { ...m, seen_at: e.message.seen_at }
                        : m
                )
            );
        });

        channel.listenForWhisper('typing', (e) => {
            if (e.user_id === auth.user.id) return;

            setTypingUser(e.user_name);

            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                setTypingUser(null);
            }, 3000);
        });

        return () => {
            channel.stopListening('.message.sent', messageHandler);
            window.Echo.leave(`private-${channelName}`);
            setRealtimeStatus('inactive');
        };
    }, [conversation.id, auth.user.id]);

    /* 🟢 Presence channel (online / offline) */
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

    /* 👀 Seen auto */
    useEffect(() => {
        messages.forEach(message => {
            if (
                message.sender_id !== auth.user.id &&
                !message.seen_at
            ) {
                window.axios.post(route('messages.seen', message.id));
            }
        });

        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, auth.user.id]);

    /* ✍️ Emit typing */
    const handleTyping = (value) => {
        setData('content', value);

        if (!channelRef.current) return;

        channelRef.current.whisper('typing', {
            user_id: auth.user.id,
            user_name: auth.user.name,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        const content = data.content;
        reset();

        const tempMessage = {
            id: `temp-${Date.now()}`,
            content,
            sender_id: auth.user.id,
            created_at: new Date().toISOString(),
            pending: true,
        };

        setMessages(prev => [...prev, tempMessage]);
        setTypingUser(null);

        post(route('messages.store', conversation.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                const realMessage =
                    page.props.conversation?.messages?.slice(-1)[0];

                if (!realMessage) return;

                setMessages(prev =>
                    prev.map(m => (m.pending ? realMessage : m))
                );
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {otherUser.name}
                        <span className="ml-3 text-sm text-gray-500">
                            {isOtherOnline ? '🟢 En ligne' : `⚪ ${formatLastSeen()}`}
                        </span>
                    </h2>
                </div>
            }
        >
            <Head title="Conversation" />

            <div className="mx-auto max-w-4xl py-6 flex flex-col h-[80vh]">
                <div className="flex-1 overflow-y-auto space-y-4 bg-white p-4 rounded-lg shadow">
                    {messages.map(message => {
                        const isMe = message.sender_id === auth.user.id;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                                        isMe
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-900'
                                    }`}
                                >
                                    <p>{message.content}</p>

                                    <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
                                        <span>
                                            {message.created_at
                                                ? new Date(message.created_at).toLocaleTimeString()
                                                : '…'}
                                        </span>

                                        {isMe && (
                                            <>
                                                {message.seen_at ? (
                                                    <span className="text-blue-300">✓✓</span>
                                                ) : message.delivered_at ? (
                                                    <span>✓✓</span>
                                                ) : (
                                                    <span>✓</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {typingUser && (
                        <div className="text-sm italic text-gray-500">
                            {typingUser} est en train d’écrire…
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={submit} className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={data.content}
                        onChange={(e) => handleTyping(e.target.value)}
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
