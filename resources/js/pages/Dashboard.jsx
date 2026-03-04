import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RandomChatModal from '@/Components/RandomChatModal';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [searching, setSearching] = useState(false);
    const [modalStatus, setModalStatus] = useState('searching');
    const [showModal, setShowModal] = useState(false);
    const [foundUser, setFoundUser] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const { props } = usePage();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        setOnlineUsers(window.__onlineUsers || []);

        const handler = (e) => {
            setOnlineUsers(e.detail || []);
        };

        window.addEventListener('onlineUsersUpdated', handler);

        return () => {
            window.removeEventListener('onlineUsersUpdated', handler);
        };
    }, []);

    const startRandom = async () => {
        if (searching) return;

        setSearching(true);
        setModalStatus('searching');
        setShowModal(true);
        setFoundUser(null);

        try {
            const response = await axios.post(route('conversations.random'));

            const conversation = response.data.conversation;

            setFoundUser(conversation.other_user);
            setModalStatus('found');

            // laisse respirer le modal 😄
            setTimeout(() => {
                router.visit(route('conversations.show', conversation.id));
            }, 1800);

        } catch (error) {
            setModalStatus('no_users');
            setSearching(false);
        }
    };


    const cancelSearch = () => {
        setSearching(false);
        setShowModal(false);
    };

    const tryAgain = () => {
        setShowModal(false);
        setTimeout(startRandom, 200);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-light text-white">
                    Welcome to Your Digital Playground
                </h2>
            }
        >
            <Head title="Dashboard" />

            <RandomChatModal 
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSearching(false);
                }}
                onCancel={cancelSearch}
                onTryAgain={tryAgain}
                status={modalStatus}
                foundUser={foundUser}
            />

            <div className="space-y-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 p-8 backdrop-blur-sm shadow-xl shadow-black/30">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-light text-white mb-4">
                                    Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Explorer</span>
                                </h1>
                                <p className="text-gray-300 text-lg max-w-2xl">
                                    Dive into the realm of unexpected conversations and serendipitous connections.
                                    Every interaction is a new adventure waiting to unfold.
                                </p>
                            </div>
                            {/* Animated GIF/Image */}
                            <div className="hidden lg:block">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl animate-pulse"></div>
                                    <img 
                                        src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" 
                                        alt="Conversation animation"
                                        className="relative h-40 w-40 rounded-full object-cover border-4 border-gray-800 shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Stats Cards */}
                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:scale-[1.02]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Online Now</p>
                                        <p className="mt-2 text-3xl font-light text-white">{onlineUsers.length}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:scale-[1.02]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Available to Chat</p>
                                        <p className="mt-2 text-3xl font-light text-white">
                                            {onlineUsers.length > 0 ? onlineUsers.length - 1 : 0}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:scale-[1.02]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Chat Ready</p>
                                        <p className="mt-2 text-3xl font-light text-white">
                                            {onlineUsers.length > 0 ? '✓' : '...'}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Sections */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Discover New People */}
                        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/40 to-black/40 p-6 backdrop-blur-sm shadow-xl shadow-black/20">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-xl font-light text-white">Discover Random Souls</h3>
                                <div className="h-10 w-10 animate-spin-slow rounded-full border-2 border-dashed border-cyan-500/30"></div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-all duration-300 hover:border-cyan-500/30">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                        A
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">Anonymous Artist</p>
                                        <p className="text-sm text-gray-400">Exploring abstract concepts through conversation</p>
                                    </div>
                                    <button className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/10">
                                        Connect
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-all duration-300 hover:border-blue-500/30">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        P
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">Philosopher</p>
                                        <p className="text-sm text-gray-400">Deep thinker seeking meaningful dialogues</p>
                                    </div>
                                    <button className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/10">
                                        Connect
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <button className="group relative w-full overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-r from-gray-900 to-black px-6 py-3 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-cyan-500/50 hover:text-white">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center justify-center">
                                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Find More Interesting People
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/40 to-black/40 p-6 backdrop-blur-sm shadow-xl shadow-black/20">
                            <h3 className="mb-6 text-xl font-light text-white">Quick Action</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/40 to-black/40 p-6 backdrop-blur-sm shadow-xl shadow-black/20">
                                    <h3 className="mb-6 text-xl font-light text-white">Ready for Your Next Conversation?</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                                                <svg className="h-3 w-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Serendipity Engine</p>
                                                <p className="text-sm text-gray-400">Every click could lead to a life-changing discussion.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <div className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2">
                                            <div className="h-2 w-2 animate-ping rounded-full bg-green-500"></div>
                                            <span className="text-sm text-gray-300">
                                                <span className="font-medium text-white">{onlineUsers.length}</span> people are talking right now
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="group rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center transition-all duration-300 hover:border-cyan-500/30 hover:scale-105"
                                    onClick={startRandom}
                                    disabled={searching}
                                >
                                    <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                        <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-white">{searching ? "Searching someone..." : "Start Random Chat Now"}</p>
                                    <p className="mt-1 text-xs text-gray-400">{searching ? "Finding someone new..." : "Find someone new"}</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Featured Conversation */}
                        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/40 to-black/40 p-6 backdrop-blur-sm shadow-xl shadow-black/20">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-xl font-light text-white">Featured Conversation</h3>
                                <div className="animate-bounce">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                                    <div className="flex-1 rounded-lg bg-gray-900/50 p-3">
                                        <p className="text-sm text-gray-300">"What if our conversations were never meant to have meaning, but simply to exist?"</p>
                                        <p className="mt-1 text-xs text-gray-500">— Anonymous Thinker</p>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"></div>
                                    <div className="flex-1 rounded-lg bg-gray-900/50 p-3">
                                        <p className="text-sm text-gray-300">"Every word spoken creates ripples in the digital ocean. Where will your ripples go today?"</p>
                                        <p className="mt-1 text-xs text-gray-500">— Digital Poet</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black">
                                    <img 
                                        src="https://media.giphy.com/media/3o7aD2kKcE7rRwJqpy/giphy.gif" 
                                        alt="Conversation animation"
                                        className="h-full w-full object-cover opacity-60"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Why RandomTalk? */}
                        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/40 to-black/40 p-6 backdrop-blur-sm shadow-xl shadow-black/20">
                            <h3 className="mb-6 text-xl font-light text-white">Why RandomTalk?</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                                        <svg className="h-3 w-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Serendipity Engine</p>
                                        <p className="text-sm text-gray-400">Our algorithm connects you with the most unexpected yet interesting people.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                                        <svg className="h-3 w-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Anonymity & Safety</p>
                                        <p className="text-sm text-gray-400">Be yourself without revealing your identity. We prioritize your privacy.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                                        <svg className="h-3 w-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Meaningful Connections</p>
                                        <p className="text-sm text-gray-400">Beyond small talk - engage in conversations that actually matter.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animation Styles */}
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}