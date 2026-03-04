import { router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

import UserSearchModal from '@/Components/UserSearchModal';

export default function SearchByPublicId() {

    const [publicId, setPublicId] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const [foundUser, setFoundUser] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!publicId.trim()) return;

        setLoading(true);

        try {
            const response = await axios.post(route('users.search'), {
                public_id: publicId.trim().toUpperCase(),
            });

            if (response.data.foundUser) {
                setFoundUser(response.data.foundUser);
                setStatus('found');
            } else {
                setStatus('not_found');
            }

            setModalOpen(true);

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="RT-XXXXXX"
                    value={publicId}
                    onChange={(e) => setPublicId(e.target.value)}
                    className="w-36 rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-white"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                    {loading ? '...' : 'Start'}
                </button>
            </form>

            {/* ✅ LE MODAL */}
            <UserSearchModal
                show={modalOpen}
                status={status}
                user={foundUser}
                onClose={() => setModalOpen(false)}
                onStartConversation={() => {
                    if (!foundUser) return;

                    router.post(route('conversations.store'), {
                        public_id: foundUser.public_id,
                    });
                }}
            />
        </>
    );
}