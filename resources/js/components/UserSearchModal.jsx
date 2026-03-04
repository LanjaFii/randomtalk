import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function UserSearchModal({
    show,
    onClose,
    status,
    user = null,
    onStartConversation
}) {
    if (!status) return null;

    const isFound = status === 'found';

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay */}
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

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl">

                            <div className="flex flex-col items-center text-center">

                                {/* ICON */}
                                <div className="mb-6">
                                    {isFound ? (
                                        <div className="relative">
                                            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/20 flex items-center justify-center">
                                                <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/20 blur-xl animate-ping"></div>
                                        </div>
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-red-500/20 to-pink-600/20 flex items-center justify-center">
                                            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* TITLE */}
                                <Dialog.Title
                                    className={`text-2xl font-light bg-gradient-to-r ${
                                        isFound
                                            ? 'from-green-500 to-emerald-600'
                                            : 'from-red-500 to-pink-600'
                                    } bg-clip-text text-transparent mb-3`}
                                >
                                    {isFound ? 'User Found!' : 'User Not Found'}
                                </Dialog.Title>

                                {/* DESCRIPTION */}
                                <p className="text-gray-300">
                                    {isFound
                                        ? `We found ${user?.name}. You can start a conversation now.`
                                        : 'No user exists with this Public ID.'}
                                </p>

                                {/* USER PREVIEW */}
                                {isFound && user && (
                                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4 w-full">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {user.public_id}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* BUTTONS */}
                                <div className="mt-8 flex gap-4">

                                    {isFound && (
                                        <button
                                            onClick={onStartConversation}
                                            className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition"
                                        >
                                            Start Conversation
                                        </button>
                                    )}

                                    <button
                                        onClick={onClose}
                                        className="rounded-lg border border-gray-700 bg-gray-800/50 px-6 py-2.5 text-sm text-gray-300 hover:border-gray-600 hover:text-white transition"
                                    >
                                        Close
                                    </button>
                                </div>

                            </div>

                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}