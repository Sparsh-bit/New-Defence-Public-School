'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function LoadingOverlay() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleComplete = () => setIsLoading(false);

        // We simulate loading for route changes as Next.js 13+ doesn't have events like router.events.on('routeChangeStart')
        // However, we can use the pathname/searchParams as a signal that a change happened.
        // For a more robust solution, we'd wrap Link or use a provider.
        // For now, let's create a beautiful loading that appears on mount for subpages.

        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[2000] bg-[#0B1C2D] flex items-center justify-center p-4"
                >
                    <div className="relative w-full max-w-2xl aspect-video rounded-[40px] overflow-hidden border-2 border-white/10 shadow-2xl bg-black">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/videos/loading.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                        className="w-2 h-2 bg-[#C6A75E] rounded-full"
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mr-[-0.4em]">Preparing Excellence</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
