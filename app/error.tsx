'use client';

import { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
                <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-bold text-[#0A1628] mb-4">Something went wrong!</h2>
            <p className="text-gray-500 max-w-md mb-8">
                We apologize for the inconvenience. Our team has been notified of the issue.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-[#0A1628] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#C6A75E] hover:text-[#0A1628] transition-colors"
                >
                    <RefreshCw size={18} /> Try again
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                    <Home size={18} /> Go Home
                </Link>
            </div>
        </div>
    );
}
