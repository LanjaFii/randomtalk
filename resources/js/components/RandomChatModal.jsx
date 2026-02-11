import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

export default function RandomChatModal({ 
    show, 
    onClose, 
    onCancel, 
    onTryAgain,
    status = 'searching',
    foundUser = null 
}) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (status !== 'searching') return;

        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, [status]);

    const getModalContent = () => {
        switch (status) {
            case 'searching':
                return {
                    icon: (
                        <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                                <svg className="h-10 w-10 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-xl animate-pulse"></div>
                        </div>
                    ),
                    title: 'Searching for a conversation partner',
                    description: 'Looking for interesting people online...',
                    subtext: `This may take a few seconds${dots}`,
                    color: 'from-cyan-500 to-blue-600'
                };
            case 'no_users':
                return {
                    icon: (
                        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-600/20 flex items-center justify-center">
                            <svg className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                    ),
                    title: 'No other users online right now',
                    description: 'Check if someone on your conversation list is connected',
                    subtext: 'Try again in a few moments',
                    color: 'from-yellow-500 to-orange-600'
                };
            case 'found':
                return {
                    icon: (
                        <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/20 flex items-center justify-center">
                                <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/20 blur-xl animate-ping"></div>
                        </div>
                    ),
                    title: foundUser ? `Connected with ${foundUser.name}!` : 'Conversation started!',
                    description: foundUser 
                        ? `You're now chatting with ${foundUser.name}` 
                        : 'Redirecting you to the chat...',
                    subtext: 'Get ready for an amazing conversation',
                    color: 'from-green-500 to-emerald-600'
                };
            default:
                return null;
        }
    };

    const content = getModalContent();
    if (!content) return null;

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-50" 
                onClose={status === 'searching' || status === 'found' ? () => {} : onClose}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8 text-left align-middle shadow-2xl shadow-black/50 transition-all">
                                <div className="flex flex-col items-center text-center">
                                    {/* Icon */}
                                    <div className="mb-6">
                                        {content.icon}
                                    </div>

                                    {/* Title */}
                                    <Dialog.Title
                                        as="h3"
                                        className={`text-2xl font-light bg-gradient-to-r ${content.color} bg-clip-text text-transparent mb-3`}
                                    >
                                        {content.title}
                                    </Dialog.Title>

                                    {/* Description */}
                                    <div className="mt-2">
                                        <p className="text-gray-300">
                                            {content.description}
                                        </p>
                                    </div>

                                    {/* Subtext */}
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">
                                            {content.subtext}
                                        </p>
                                    </div>

                                    {/* User Preview - Afficher quand un utilisateur est trouvé */}
                                    {status === 'found' && foundUser && (
                                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                                {foundUser.name[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="font-medium text-white">{foundUser.name}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    <p className="text-xs text-green-400">Online</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-8 flex gap-4">
                                        {status === 'searching' && (
                                            <button
                                                type="button"
                                                onClick={onCancel}
                                                className="rounded-lg border border-gray-700 bg-gray-800/50 px-6 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-gray-600 hover:text-white"
                                            >
                                                Cancel Search
                                            </button>
                                        )}
                                        
                                        {status === 'no_users' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={onTryAgain}
                                                    className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                                    <span className="relative">Try Again</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="rounded-lg border border-gray-700 bg-gray-800/50 px-6 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-gray-600 hover:text-white"
                                                >
                                                    Close
                                                </button>
                                            </>
                                        )}
                                        
                                        {status === 'found' && (
                                            <button
                                                type="button"
                                                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:shadow-green-500/40"
                                                disabled
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                                <span className="relative flex items-center gap-2">
                                                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Redirecting...
                                                </span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {status === 'searching' && (
                                        <div className="mt-6 text-xs text-gray-600">
                                            Looking for someone who shares your interests...
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}