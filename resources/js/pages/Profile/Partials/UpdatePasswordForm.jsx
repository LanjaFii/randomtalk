import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8 shadow-xl shadow-black/20">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-light text-white">
                                Update Password
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Ensure your account is secure with a strong password
                            </p>
                        </div>
                    </div>
                </header>

                <form onSubmit={updatePassword} className="space-y-8">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel
                                    htmlFor="current_password"
                                    value="Current Password"
                                    className="block text-sm font-medium text-gray-300"
                                />
                                <span className="text-xs text-gray-500">Required</span>
                            </div>
                            
                            <div className="relative">
                                <TextInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) =>
                                        setData('current_password', e.target.value)
                                    }
                                    type="password"
                                    className="block w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3.5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all duration-300"
                                    autoComplete="current-password"
                                    placeholder="Enter your current password"
                                />
                                <div className="absolute right-3 top-3.5">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <InputError
                                message={errors.current_password}
                                className="mt-3 text-sm text-red-400"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel 
                                    htmlFor="password" 
                                    value="New Password" 
                                    className="block text-sm font-medium text-gray-300"
                                />
                                <span className="text-xs text-gray-500">Minimum 8 characters</span>
                            </div>
                            
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type="password"
                                    className="block w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3.5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all duration-300"
                                    autoComplete="new-password"
                                    placeholder="Create a new password"
                                />
                                <div className="absolute right-3 top-3.5">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <InputError message={errors.password} className="mt-3 text-sm text-red-400" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm New Password"
                                    className="block text-sm font-medium text-gray-300"
                                />
                                <span className="text-xs text-gray-500">Must match new password</span>
                            </div>
                            
                            <div className="relative">
                                <TextInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    type="password"
                                    className="block w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3.5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all duration-300"
                                    autoComplete="new-password"
                                    placeholder="Confirm your new password"
                                />
                                <div className="absolute right-3 top-3.5">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-3 text-sm text-red-400"
                            />
                        </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-5">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Password Requirements</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${data.password.length >= 8 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                <span className={`text-xs ${data.password.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
                                    At least 8 characters
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(data.password) ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                <span className={`text-xs ${/[A-Z]/.test(data.password) ? 'text-green-400' : 'text-gray-500'}`}>
                                    At least one uppercase letter
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(data.password) ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                <span className={`text-xs ${/[0-9]/.test(data.password) ? 'text-green-400' : 'text-gray-500'}`}>
                                    At least one number
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                            leave="transition ease-in-out duration-300"
                            leaveFrom="opacity-100 translate-x-0"
                            leaveTo="opacity-0 translate-x-4"
                        >
                            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 border border-green-500/20">
                                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm text-green-400 font-medium">Password updated successfully</span>
                            </div>
                        </Transition>

                        <PrimaryButton 
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={processing}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        Update Password
                                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </section>
    );
}