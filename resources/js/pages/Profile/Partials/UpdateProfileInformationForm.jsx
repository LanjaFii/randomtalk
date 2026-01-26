import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8 shadow-xl shadow-black/20">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                            <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-light text-white">
                                Profile Information
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Update your personal details and email address
                            </p>
                        </div>
                    </div>
                </header>

                <form onSubmit={submit} className="space-y-8">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel 
                                    htmlFor="name" 
                                    value="Name" 
                                    className="block text-sm font-medium text-gray-300"
                                />
                                <span className="text-xs text-gray-500">Required</span>
                            </div>
                            
                            <div className="relative">
                                <TextInput
                                    id="name"
                                    className="block w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3.5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all duration-300"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="name"
                                />
                                <div className="absolute right-3 top-3.5">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            <InputError className="mt-3 text-sm text-red-400" message={errors.name} />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel 
                                    htmlFor="email" 
                                    value="Email" 
                                    className="block text-sm font-medium text-gray-300"
                                />
                                <span className="text-xs text-gray-500">Required</span>
                            </div>
                            
                            <div className="relative">
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="block w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3.5 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all duration-300"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                                <div className="absolute right-3 top-3.5">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <InputError className="mt-3 text-sm text-red-400" message={errors.email} />
                        </div>
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="rounded-xl border border-amber-800/30 bg-amber-500/10 p-5">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-amber-300">
                                        Your email address is unverified.
                                    </p>
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="mt-2 inline-flex items-center text-sm text-amber-400 hover:text-amber-300 hover:underline transition-colors duration-200"
                                    >
                                        Click here to re-send the verification email
                                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {status === 'verification-link-sent' && (
                                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 border border-green-500/20">
                                    <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-sm text-green-400">
                                        A new verification link has been sent to your email address.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

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
                                <span className="text-sm text-green-400 font-medium">Profile updated successfully</span>
                            </div>
                        </Transition>

                        <PrimaryButton 
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Save Changes
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