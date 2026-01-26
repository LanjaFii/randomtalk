import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            
            {/* Background Elements - Full dark background */}
            <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            </div>

            {/* Main container with perfect centering */}
            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto transform">
                    {/* Logo Container */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl opacity-20"></div>
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
                        <p className="text-gray-400">
                            Ready to dive into the unknown?
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8 shadow-2xl shadow-black/30">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <InputLabel 
                                    htmlFor="email" 
                                    value="Email" 
                                    className="block text-sm font-medium text-gray-300 mb-2"
                                />

                                <div className="relative">
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="block w-full rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-300"
                                        placeholder="your@email.com"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <div className="absolute right-3 top-3">
                                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>

                                <InputError 
                                    message={errors.email} 
                                    className="mt-2 text-sm text-red-400" 
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <InputLabel 
                                    htmlFor="password" 
                                    value="Password" 
                                    className="block text-sm font-medium text-gray-300 mb-2"
                                />

                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="block w-full rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-300"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <div className="absolute right-3 top-3">
                                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>

                                <InputError 
                                    message={errors.password} 
                                    className="mt-2 text-sm text-red-400" 
                                />
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-700 bg-gray-900/70 text-cyan-500 focus:ring-cyan-500 focus:border-cyan-500"
                                    />
                                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <PrimaryButton 
                                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                <span className="relative flex items-center justify-center">
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            Log in
                                            <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </PrimaryButton>
                        </form>

                        {/* Registration Link */}
                        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                            <p className="text-sm text-gray-500">
                                New to RandomTalk?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                            
                            <div className="mt-4">
                                <p className="text-xs text-gray-600">
                                    Where conversations take unexpected turns
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}