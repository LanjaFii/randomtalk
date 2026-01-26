import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Fonction pour calculer la force du mot de passe
    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        
        let score = 0;
        
        // Longueur minimale
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Diversité des caractères
        if (/[a-z]/.test(password)) score += 1; // minuscules
        if (/[A-Z]/.test(password)) score += 1; // majuscules
        if (/[0-9]/.test(password)) score += 1; // chiffres
        if (/[^A-Za-z0-9]/.test(password)) score += 1; // symboles
        
        return Math.min(score, 4); // Max 4 segments
    };

    // Message de force dynamique
    const getPasswordStrengthMessage = (password) => {
        if (!password) return "Use at least 8 characters with a mix of letters, numbers & symbols";
        
        const strength = calculatePasswordStrength(password);
        
        if (strength === 0) return "Too short - minimum 8 characters";
        if (strength === 1) return "Weak - add more character types";
        if (strength === 2) return "Fair - mix letters and numbers";
        if (strength === 3) return "Good - add symbols for better security";
        return "Strong - excellent password!";
    };

    // Couleurs pour l'indicateur
    const getStrengthColor = (strength) => {
        if (strength === 0) return 'bg-gray-700';
        if (strength === 1) return 'bg-red-500';
        if (strength === 2) return 'bg-yellow-500';
        if (strength === 3) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const passwordStrength = useMemo(() => 
        calculatePasswordStrength(data.password), 
        [data.password]
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            
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
                    <div className="mb-2 text-center">
                        <div className="mb-4 inline-flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl opacity-20"></div>
                                <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                    <span className="text-lg font-bold">RT</span>
                                </div>
                            </div>
                            <div className="text-2xl font-light tracking-tighter">
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    Start your journey into unexpected connections
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4 shadow-2xl shadow-black/30">
                        <form onSubmit={submit} className="space-y-2">
                            {/* Name Input */}
                            <div>
                                <InputLabel 
                                    htmlFor="name" 
                                    value="Name" 
                                    className="block text-sm font-medium text-gray-300 mb-2"
                                />

                                <div className="relative">
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="block w-full rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-300"
                                        placeholder="Your name"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <div className="absolute right-3 top-3">
                                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>

                                <InputError 
                                    message={errors.name} 
                                    className="mt-2 text-sm text-red-400" 
                                />
                            </div>

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
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
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
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
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

                            {/* Password Strength Indicator */}
                            {data.password && (
                                <div className="space-y-2">
                                    <div className="flex h-1 space-x-1">
                                        {[...Array(4)].map((_, index) => (
                                            <div 
                                                key={index}
                                                className={`flex-1 rounded-full transition-all duration-300 ${
                                                    index < passwordStrength 
                                                        ? getStrengthColor(passwordStrength)
                                                        : 'bg-gray-700'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs transition-colors duration-300 ${
                                        passwordStrength === 0 ? 'text-gray-500' :
                                        passwordStrength === 1 ? 'text-red-400' :
                                        passwordStrength === 2 ? 'text-yellow-400' :
                                        passwordStrength === 3 ? 'text-blue-400' :
                                        'text-green-400'
                                    }`}>
                                        {getPasswordStrengthMessage(data.password)}
                                    </p>
                                </div>
                            )}

                            {/* Confirm Password Input */}
                            <div>
                                <InputLabel 
                                    htmlFor="password_confirmation" 
                                    value="Confirm Password" 
                                    className="block text-sm font-medium text-gray-300 mb-2"
                                />

                                <div className="relative">
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className={`block w-full rounded-xl border ${
                                            data.password && data.password_confirmation
                                                ? data.password === data.password_confirmation
                                                    ? 'border-green-500/50'
                                                    : 'border-red-500/50'
                                                : 'border-gray-700'
                                        } bg-gray-900/70 px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-300`}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <div className="absolute right-3 top-3">
                                        {data.password && data.password_confirmation ? (
                                            data.password === data.password_confirmation ? (
                                                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )
                                        ) : (
                                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                <InputError 
                                    message={errors.password_confirmation} 
                                    className="mt-2 text-sm text-red-400" 
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-2">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:underline"
                                >
                                    Already registered?
                                </Link>

                                <PrimaryButton 
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Terms & Conditions */}
                        <div className="mt-4 pt-2 border-t border-gray-800 text-center">
                            <div className="mt-0">
                                <p className="text-xs text-gray-600">
                                    Where every conversation is a new adventure
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}