import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
                </div>

                {/* Animated Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

                {/* Main Content */}
                <div className="relative z-10 flex min-h-screen flex-col">
                    {/* Header */}
                    <header className="px-6 py-8 lg:px-12">
                        <div className="mx-auto flex max-w-7xl items-center justify-between">
                            {/* Logo avec effet glow */}
                            <div className="group">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                        <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                            <span className="text-lg font-bold">RT</span>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-light tracking-tighter">
                                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                            RANDOMTALK
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
                                        <span className="relative">Dashboard</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative text-gray-300 group-hover:text-white">
                                                Log in
                                            </span>
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 active:scale-95"
                                        >
                                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                            <span className="relative">Register</span>
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </header>

                    {/* Hero Section */}
                    <main className="flex-1 flex items-center justify-center px-6">
                        <div className="mx-auto max-w-6xl text-center">
                            {/* Animated Badge */}
                            <div className="mb-8 inline-flex items-center rounded-full border border-gray-700 bg-gray-900/50 px-4 py-2 backdrop-blur-sm">
                                <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-cyan-400"></div>
                                <span className="text-sm font-medium text-gray-300">
                                    TALK TO ANYONE ANYTIME
                                </span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="mb-6 text-5xl font-light leading-tight tracking-tight sm:text-7xl lg:text-8xl">
                                <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                    Tired of being 
                                </span>
                                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    alone?
                                </span>
                            </h1>

                            {/* Subheading */}
                            <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-gray-400 sm:text-xl">
                                Talk to a random person or to your friends. A unique experience.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href={route('register')}
                                    className="group relative w-full max-w-xs overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold shadow-2xl shadow-cyan-500/25 transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/40 sm:w-auto"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                    <span className="relative flex items-center justify-center">
                                        I want to register
                                        <svg
                                            className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </span>
                                </Link>

                                <Link
                                    href={route('login')}
                                    className="group w-full max-w-xs rounded-2xl border border-gray-700 bg-gray-900/50 px-8 py-4 text-lg font-medium backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/50 sm:w-auto"
                                >
                                    <span className="flex items-center justify-center text-gray-300 group-hover:text-white">
                                        Let's go
                                        <svg
                                            className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                            />
                                        </svg>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="px-6 py-2 lg:px-12">
                        <div className="mx-auto max-w-7xl text-center">
                            <p className="text-sm text-gray-500">
                                By @Lanja_Fii
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}