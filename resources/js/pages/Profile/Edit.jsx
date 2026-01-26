import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-light text-white">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-2">
                <div className="mx-auto max-w-6xl">
                    {/* Welcome Section */}
                    <div className="mb-8 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/40 to-black/40 p-8 backdrop-blur-sm shadow-xl shadow-black/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-light text-white mb-2">
                                    Manage Your Account
                                </h1>
                                <p className="text-gray-400">
                                    Update your personal information, security settings, and account preferences
                                </p>
                            </div>
                            <div className="hidden lg:block">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information & Security - Side by Side */}
                    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
                        {/* Personal Information */}
                        <div className="relative">
                            <div className="absolute -left-2 top-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                            <div className="pl-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                                            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-white">Personal Information</h3>
                                    </div>
                                    <p className="text-sm text-gray-400 pl-11">
                                        Update your name and email address
                                    </p>
                                </div>
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Security */}
                        <div className="relative">
                            <div className="absolute -left-2 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                            <div className="pl-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                                            <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-white">Security</h3>
                                    </div>
                                    <p className="text-sm text-gray-400 pl-11">
                                        Change your password to keep your account secure
                                    </p>
                                </div>
                                <UpdatePasswordForm className="w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone - Full Width at Bottom */}
                    <div className="mb-8">
                        <div className="relative">
                            <div className="absolute -left-2 top-0 h-full w-1 bg-gradient-to-b from-red-500 to-pink-600 rounded-full"></div>
                            <div className="pl-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-600/20 flex items-center justify-center">
                                            <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-white">Danger Zone</h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Permanently delete your account and all data
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <DeleteUserForm className="w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/30 to-black/30 p-8 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-medium text-white mb-2">Need Help?</h4>
                                <p className="text-gray-400 text-sm mb-4">
                                    If you have any questions about your account settings or need assistance, 
                                    please contact our support team. We're here to help.
                                </p>
                                <button className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-gray-600 hover:text-white">
                                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}