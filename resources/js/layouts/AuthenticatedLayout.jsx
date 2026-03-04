import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SearchByPublicId from '@/Components/SearchByPublicId';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    useEffect(() => {
        // centralise la gestion de la présence quand l'utilisateur est authentifié
        if (!window.Echo) return;

        // init storage
        window.__onlineUsers = window.__onlineUsers || [];

        const presence = window.Echo.join('presence.online')
            .here((users) => {
                window.__onlineUsers = users.map((u) => u.id);
                window.dispatchEvent(
                    new CustomEvent('onlineUsersUpdated', {
                        detail: window.__onlineUsers,
                    }),
                );
            })
            .joining((user) => {
                window.__onlineUsers = [...(window.__onlineUsers || []), user.id];
                window.dispatchEvent(
                    new CustomEvent('onlineUsersUpdated', {
                        detail: window.__onlineUsers,
                    }),
                );
            })
            .leaving((user) => {
                window.__onlineUsers = (window.__onlineUsers || []).filter(
                    (id) => id !== user.id,
                );
                window.dispatchEvent(
                    new CustomEvent('onlineUsersUpdated', {
                        detail: window.__onlineUsers,
                    }),
                );
            });

        return () => {
            try {
                window.Echo.leave('presence.online');
            } catch (e) {
                // ignore
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-30 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl opacity-20"></div>
                                            <div className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                                <span className="text-sm font-bold">RT</span>
                                            </div>
                                        </div>
                                        <div className="text-xl font-light tracking-tighter">
                                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                                RANDOMTALK
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden sm:-my-px sm:ms-10 sm:flex sm:items-center gap-4">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                                >
                                    <span className={`relative z-10 ${route().current('dashboard') ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                        Dashboard
                                    </span>
                                    {route().current('dashboard') && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 rounded-lg shadow-lg"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg animate-pulse-slow"></div>
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                                        </>
                                    )}
                                    {!route().current('dashboard') && (
                                        <div className="absolute inset-0 bg-gray-800/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                    )}
                                </NavLink>
                                <NavLink
                                    href={route('conversations.index')}
                                    active={route().current('conversations.*')}
                                    className="group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                                >
                                    <span className={`relative z-10 ${route().current('conversations.*') ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                        Conversations
                                    </span>
                                    {route().current('conversations.*') && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 rounded-lg shadow-lg"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg animate-pulse-slow"></div>
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                                        </>
                                    )}
                                </NavLink>

                                {/* 🔎 SEARCH BAR (only on conversations pages) */}
                                {route().current('conversations.*') && (
                                    <div className="ml-2">
                                        <SearchByPublicId />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* User Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3 z-50">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="group inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/70 px-4 py-2 text-sm font-medium text-gray-300 transition duration-200 ease-in-out hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                            >
                                                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{user.name}</span>
                                                <svg
                                                    className="-me-0.5 ms-1 h-4 w-4 transition-transform group-hover:rotate-180 duration-200"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content className="mt-2 min-w-[200px] rounded-xl border border-black bg-black backdrop-blur-sm shadow-2xl shadow-black/50 z-50">
                                        <div className="px-4 py-3 border-b border-gray-700 bg-gray-900">
                                            <div className="text-sm font-medium text-white">{user.name}</div>
                                            <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                        </div>
                                        <div className="p-1 bg-gray-600">
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                                className="group relative block w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 hover:bg-gray-800/80"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded bg-gray-800/50 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-200">
                                                        <svg className="h-3 w-3 text-gray-400 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-gray-300 group-hover:text-white transition-colors duration-200">Profile</span>
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="group relative block w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 hover:bg-red-500/10"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded bg-gray-800/50 flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-200">
                                                        <svg className="h-3 w-3 text-gray-400 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-gray-300 group-hover:text-red-300 transition-colors duration-200">Log Out</span>
                                                </div>
                                            </Dropdown.Link>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 transition duration-200 ease-in-out hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm z-40'
                    }
                >
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="group relative block rounded-lg px-3 py-2 text-base font-medium transition-all duration-200"
                        >
                            <span className={`relative z-10 ${route().current('dashboard') ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                Dashboard
                            </span>
                            {route().current('dashboard') && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 rounded-lg"></div>
                                    <div className="absolute -left-1 inset-y-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full"></div>
                                </>
                            )}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('conversations.index')}
                            active={route().current('conversations.*')}
                            className="group relative block rounded-lg px-3 py-2 text-base font-medium transition-all duration-200"
                        >
                            <span className={`relative z-10 ${route().current('conversations.*') ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                Conversations
                            </span>
                            {route().current('conversations.*') && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 rounded-lg"></div>
                                    <div className="absolute -left-1 inset-y-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full"></div>
                                </>
                            )}
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-800 px-4 pb-4 pt-4">
                        <div className="mb-4">
                            <div className="text-base font-medium text-white">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-400">
                                {user.email}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <ResponsiveNavLink 
                                href={route('profile.edit')}
                                className="group block rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded bg-gray-800/50 flex items-center justify-center">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    Profile
                                </div>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="group block rounded-lg px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded bg-gray-800/50 flex items-center justify-center">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </div>
                                    Log Out
                                </div>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="relative z-20 border-b border-gray-800 bg-gray-900/30 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {typeof header === 'string' ? (
                            <h2 className="text-2xl font-light text-white">
                                {header}
                            </h2>
                        ) : (
                            header
                        )}
                    </div>
                </header>
            )}

            <main className="relative z-10">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Custom Animation Styles */}
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}