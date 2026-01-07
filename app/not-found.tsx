'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0A1628] flex items-center justify-center text-center p-4">
            <div>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-[12rem] font-display font-black text-[#FFD700] leading-none opacity-20"
                >
                    404
                </motion.h1>
                <div className="relative -mt-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Page Not Found</h2>
                    <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg">
                        The page you are looking for might have been moved, deleted, or possibly never existed.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A1628] font-bold rounded-full shadow-lg hover:transform hover:scale-105 transition-all duration-300"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
