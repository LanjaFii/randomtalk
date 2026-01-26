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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                                {otherUser.name[0].toUpperCase()}
                            </div>
                            {isOtherOnline && (
                                <>
                                    <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500"></div>
                                    <div className="absolute -right-1 -bottom-1 h-3 w-3 animate-ping rounded-full bg-green-500/40"></div>
                                </>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-light text-white">
                                {otherUser.name}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {isOtherOnline ? '🟢 En ligne' : `⚪ ${formatLastSeen()}`}
                                {realtimeStatus === 'connected' }
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${isOtherOnline ? 'bg-green-500/20 text-green-400' : 'bg-gray-800/50 text-gray-400'}`}>
                            {isOtherOnline ? 'Disponible pour discuter' : 'Dernièrement en ligne'}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Conversation" />

            <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto space-y-6 rounded-2xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm p-6 shadow-xl shadow-black/20 mb-4">
                    {messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-center">
                            <div className="space-y-4">
                                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                    <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-300">Aucun message encore</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Commencez la conversation avec {otherUser.name}. 
                                    Chaque message est un nouveau début.
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map(message => {
                            const isMe = message.sender_id === auth.user.id;
                            const isPending = message.pending;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-message`}
                                >
                                    <div className="max-w-xs lg:max-w-md">
                                        <div className="flex items-end gap-2">
                                            {!isMe && (
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-sm font-bold text-white">
                                                    {otherUser.name[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div
                                                className={`relative rounded-2xl px-4 py-3 ${
                                                    isMe
                                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                                                        : 'bg-gray-800/70 text-gray-200'
                                                } ${isPending ? 'opacity-70' : ''}`}
                                            >
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                
                                                <div className={`mt-2 flex items-center justify-end gap-2 text-xs ${
                                                    isMe ? 'text-cyan-200' : 'text-gray-500'
                                                }`}>
                                                    <span>
                                                        {message.created_at
                                                            ? new Date(message.created_at).toLocaleTimeString([], { 
                                                                hour: '2-digit', 
                                                                minute: '2-digit' 
                                                            })
                                                            : '…'}
                                                    </span>

                                                    {isMe && !isPending && (
                                                        <div className="flex items-center gap-0.5">
                                                            {message.seen_at ? (
                                                                <span className="text-green-400">✓✓</span>
                                                            ) : message.delivered_at ? (
                                                                <span>✓✓</span>
                                                            ) : (
                                                                <span>✓</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {isPending && (
                                                        <div className="flex items-center">
                                                            <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse mx-0.5"></div>
                                                            <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse mx-0.5" style={{ animationDelay: '0.1s' }}></div>
                                                            <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse mx-0.5" style={{ animationDelay: '0.2s' }}></div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Message triangle */}
                                                <div className={`absolute top-3 w-2 h-2 transform rotate-45 ${
                                                    isMe
                                                        ? '-right-1 bg-gradient-to-r from-cyan-600 to-blue-600'
                                                        : '-left-1 bg-gray-800/70'
                                                }`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Typing Indicator */}
                    {typingUser && (
                        <div className="flex justify-start animate-pulse">
                            <div className="max-w-xs">
                                <div className="flex items-end gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-sm font-bold text-white">
                                        {otherUser.name[0].toUpperCase()}
                                    </div>
                                    <div className="relative rounded-2xl bg-gray-800/70 px-4 py-3">
                                        <div className="flex items-center space-x-1">
                                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <div className="absolute top-3 -left-1 w-2 h-2 transform rotate-45 bg-gray-800/70"></div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-12">
                                    {typingUser} est en train d'écrire...
                                </p>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={submit} className="relative">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={data.content}
                                onChange={(e) => handleTyping(e.target.value)}
                                placeholder={`Écrivez un message à ${otherUser.name}...`}
                                className="w-full rounded-xl border border-gray-800 bg-gray-900/70 px-5 py-3.5 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                                disabled={processing}
                            />
                            <div className="absolute right-3 top-3.5">
                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={processing || !data.content.trim()}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Envoi...
                                    </>
                                ) : (
                                    <>
                                        Envoyer
                                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                    
                    {/* Status bar */}
                    <div className="mt-3 flex items-center justify-between px-1">
                        <div className="text-xs text-gray-500">
                            {realtimeStatus === 'connected' }
                        </div>
                        <div className="text-xs text-gray-500">
                            {data.content.length > 0 && `${data.content.length}/500`}
                        </div>
                    </div>
                </form>
            </div>

            {/* Custom Animation Styles */}
            <style jsx>{`
                @keyframes message {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-message {
                    animation: message 0.3s ease-out;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}