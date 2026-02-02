import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';

export default function Index({ conversations }) {
    const { auth } = usePage().props;
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [convs, setConvs] = useState(conversations);
    const subscribedRef = useRef(new Set());
    
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

    // sync props -> local state
    useEffect(() => {
        setConvs(conversations);
    }, [conversations]);

    // realtime: subscribe to each conversation channel to update last message / unread count
    useEffect(() => {
        if (!window.Echo) return;

        const subscribe = (conversation) => {
            if (subscribedRef.current.has(conversation.id)) return;

            const channelName = `conversation.${conversation.id}`;
            const channel = window.Echo.private(channelName);

            const messageHandler = (e) => {
                const message = e.message;

                setConvs(prev => prev.map(c => {
                    if (c.id !== conversation.id) return c;

                    const updated = { ...c, last_message: message };

                    // increment unread if the incoming message is from the other user
                    if (message.sender_id !== auth.user.id) {
                        updated.unread_count = (c.unread_count || 0) + 1;
                    }

                    return updated;
                }));
            };

            const seenHandler = (e) => {
                setConvs(prev => prev.map(c => c.id === conversation.id ? { ...c, unread_count: 0 } : c));
            };

            channel.listen('.message.sent', messageHandler);
            channel.listen('.message.seen', seenHandler);

            subscribedRef.current.add(conversation.id);
        };

        convs.forEach(subscribe);

        return () => {
            // cleanup leave all subscribed channels
            subscribedRef.current.forEach(id => {
                try {
                    window.Echo.leave(`private-conversation.${id}`);
                } catch (e) {}
            });
            subscribedRef.current.clear();
        };
    }, [convs, auth.user.id]);

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
        <AuthenticatedLayout
            header={"Your Conversations"}
        >
            <Head title="Conversations" />

            <div className="space-y-6">
                {/* Stats Header */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total Conversations</p>
                                <p className="mt-2 text-3xl font-light text-white">{convs.length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Online Now</p>
                                <p className="mt-2 text-3xl font-light text-white">
                                    {convs.filter(conv => 
                                        onlineUsers.includes(getOtherUser(conv).id)
                                    ).length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Active Today</p>
                                <p className="mt-2 text-3xl font-light text-white">
                                    {convs.filter(conv => {
                                        const otherUser = getOtherUser(conv);
                                        if (!otherUser.last_seen) return false;
                                        const diff = Math.floor((Date.now() - new Date(otherUser.last_seen)) / 1000);
                                        return diff < 86400; // Last seen today
                                    }).length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conversations List */}
                <div className="rounded-2xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm overflow-hidden">
                    <div className="border-b border-gray-800 px-6 py-4">
                        <h3 className="text-lg font-light text-white">Your Connections</h3>
                        <p className="text-sm text-gray-400 mt-1">Continue your conversations or start new ones</p>
                    </div>

                    <div className="divide-y divide-gray-800/50">
                        {convs.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-800/50 flex items-center justify-center">
                                    <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-medium text-gray-300">No conversations yet</h4>
                                <p className="text-gray-500 mt-2">Start your first conversation and discover amazing people</p>
                                <button className="mt-4 inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40">
                                    Start Random Chat
                                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            convs.map(conversation => {
                                const otherUser = getOtherUser(conversation);
                                const isOnline = onlineUsers.includes(otherUser.id);
                                const lastSeen = formatLastSeen(otherUser);
                                const lastMessage = conversation.last_message;
                                const hasUnread = (conversation.unread_count || 0) > 0 && lastMessage && lastMessage.sender_id !== auth.user.id;

                                return (
                                    <Link
                                        key={conversation.id}
                                        href={route('conversations.show', conversation.id)}
                                        className="group relative block px-6 py-4 transition-all duration-300 hover:bg-gray-800/30"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Avatar with online status */}
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm">
                                                    {otherUser.name[0].toUpperCase()}
                                                </div>
                                                {isOnline && (
                                                    <>
                                                        <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-gray-900 bg-green-500"></div>
                                                        <div className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-green-500/40"></div>
                                                    </>
                                                )}
                                            </div>

                                            {/* User info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-medium text-white truncate">
                                                        {otherUser.name}
                                                    </h4>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-gray-800/50 text-gray-400'}`}>
                                                        {isOnline ? 'Online' : 'Offline'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                                                    <p className={`text-sm truncate ${hasUnread ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                                        {lastMessage ? lastMessage.content : (isOnline ? 'Available to chat' : lastSeen)}
                                                    </p>

                                                    {hasUnread && (
                                                        <div className="ms-3 inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                                            {conversation.unread_count}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div className="text-gray-500 group-hover:text-cyan-400 transition-colors duration-300">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Hover gradient effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/40 to-black/40 p-8 text-center backdrop-blur-sm">
                    <h3 className="text-xl font-light text-white mb-4">
                        Ready for New Connections?
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Every conversation is a new adventure. Meet people from around the world and discover unexpected connections.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40">
                            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            Start Random Conversation
                        </button>
                        <button className="rounded-xl border border-gray-700 bg-gray-900/50 px-8 py-3 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-gray-600 hover:text-white">
                            Browse Topics
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}