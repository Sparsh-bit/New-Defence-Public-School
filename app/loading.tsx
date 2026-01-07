'use client';

import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-[#0A1628] z-[9999] flex items-center justify-center">
            <div className="relative">
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="w-24 h-24 rounded-full border-t-4 border-r-4 border-[#FFD700] border-b-4 border-l-4 border-transparent"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="w-4 h-4 bg-white rounded-full" />
                </motion.div>
            </div>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute mt-32 text-[#FFD700] font-bold text-lg tracking-widest uppercase"
            >
                Loading
            </motion.p>
        </div>
    );
}
