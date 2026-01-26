import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-0 w-0 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-0 w-full overflow-hidden bg-white px-6 py-0 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
