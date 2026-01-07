'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function WelcomeAnimation() {
    const [isVisible, setIsVisible] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Fallback timer if video doesn't trigger end or takes too long
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 8000); // 8 seconds max

        return () => clearTimeout(timer);
    }, []);

    const handleVideoEnd = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B1C2D]"
                    style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleVideoEnd}
                            className="w-full h-full object-cover"
                        >
                            <source src="/videos/intro.mp4" type="video/mp4" />
                        </video>

                        {/* Skip Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            onClick={() => setIsVisible(false)}
                            className="absolute bottom-12 right-12 z-[1001] px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all rounded-full"
                        >
                            Skip Intro
                        </motion.button>

                        {/* Overlay text if video is background only */}
                        <div className="absolute inset-0 bg-[#0B1C2D]/20 pointer-events-none" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
