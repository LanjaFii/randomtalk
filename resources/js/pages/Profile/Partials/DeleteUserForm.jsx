import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8 shadow-xl shadow-black/20">
                <header>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-600/20 flex items-center justify-center">
                            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-light text-white">
                                Delete Account
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Permanently remove your account and all associated data
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3 rounded-xl border border-red-800/30 bg-red-500/10 p-5">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="h-3 w-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-300">Irreversible Action</p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Once your account is deleted, all of its resources and data will be permanently deleted. 
                                    Before deleting your account, please download any data or information that you wish to retain.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mt-8">
                    <DangerButton 
                        onClick={confirmUserDeletion}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-pink-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <span className="relative flex items-center justify-center gap-2">
                            Delete Account
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </span>
                    </DangerButton>
                </div>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl shadow-black/50 max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-red-500/20 to-pink-600/20 flex items-center justify-center">
                            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.798-.833-2.535 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-light text-white mb-3">
                            Delete Your Account?
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            This action cannot be undone. All your conversations, data, and profile information will be permanently deleted.
                        </p>
                    </div>

                    <form onSubmit={deleteUser} className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel
                                    htmlFor="password"
                                    value="Confirm Password"
                                    className="block text-sm font-medium text-gray-300"
                                />
                            </div>
                            
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="block w-full rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3.5 text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 focus:outline-none transition-all duration-300"
                                    isFocused
                                    placeholder="Enter your password to confirm"
                                />
                                <div className="absolute right-3 top-3.5">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <InputError
                                message={errors.password}
                                className="mt-3 text-sm text-red-400"
                            />
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 text-center">
                                Type "DELETE" to confirm
                            </p>
                            
                            <div className="flex gap-3">
                                <SecondaryButton 
                                    onClick={closeModal}
                                    type="button"
                                    className="flex-1 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-gray-600 hover:text-white"
                                >
                                    Cancel
                                </SecondaryButton>
                                
                                <DangerButton 
                                    className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-pink-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete Account'
                                        )}
                                    </span>
                                </DangerButton>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
}