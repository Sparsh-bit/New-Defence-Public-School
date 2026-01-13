'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B1C2D] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-[150px] font-black text-[#C6A75E] leading-none select-none opacity-50 font-display">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Page Not Found</h2>
            <p className="text-white/60 text-lg max-w-md mb-12">
                We couldn't find the page you were looking for. It might have been moved or deleted.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={() => window.history.back()}
                    className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold flex items-center gap-3 hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
                <Link
                    href="/"
                    className="px-8 py-4 rounded-xl bg-[#C6A75E] text-[#0B1C2D] font-bold flex items-center gap-3 hover:bg-white hover:text-[#0B1C2D] transition-colors"
                >
                    <Home size={20} /> Back to Home
                </Link>
            </div>
        </div>
    );
}
