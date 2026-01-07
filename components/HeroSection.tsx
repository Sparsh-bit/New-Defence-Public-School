'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { TypingText } from './lightswind/typing-text';

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-start overflow-hidden bg-[#0B1C2D]">

            {/* Background Image with Official Navy Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="relative w-full h-full"
                >
                    <Image
                        src="/images/home_hero_bg.png"
                        alt="NDPS School Building"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    {/* Official Navy Overlay (60-70%) - Tuned for readability */}
                    <div className="absolute inset-0 bg-[#0B1C2D]/75" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2D] via-transparent to-transparent opacity-90" />
                </motion.div>
            </div>

            {/* Content Container */}
            <div className="container-premium relative z-10 w-full px-4 md:px-8">
                <div className="text-left">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="text-left"
                    >
                        {/* Main School Name - Left Aligned with Header */}
                        <h1 className="mb-8">
                            {/* First Line: New Defence Public - Single Line */}
                            <span className="block text-5xl md:text-7xl lg:text-8xl font-display font-black text-white tracking-tight mb-2 whitespace-nowrap">
                                New Defence Public
                            </span>

                            {/* Second Line: Hr. Sec. School - Aligned using proper spacing */}
                            <span className="block text-5xl md:text-7xl lg:text-8xl font-baskerville font-black italic text-[#C6A75E] tracking-tight whitespace-nowrap pl-[35%]" style={{ fontFamily: 'var(--font-libre-baskerville), serif' }}>
                                Hr. Sec. School
                            </span>
                        </h1>

                        <TypingText
                            fontSize="text-3xl md:text-5xl lg:text-6xl"
                            fontWeight="font-black"
                            color="text-[#C6A75E]"
                            className="font-sans tracking-[0.2em] uppercase mb-12"
                            delay={0.8}
                            duration={2}
                        >
                            SINCE 1996
                        </TypingText>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                        className="text-xl md:text-2xl text-slate-200/80 font-display italic mb-12 leading-relaxed max-w-2xl border-l-4 border-[#C6A75E] pl-8"
                    >
                        "Nurturing Excellence, Character, and Innovation – NDPS stands as a crucible for the leaders of tomorrow."
                    </motion.p>

                    {/* CTA Group */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-6 items-start"
                    >
                        <Link
                            href="/about"
                            className="group relative px-10 py-5 bg-[#C6A75E] text-[#0B1C2D] font-bold tracking-widest uppercase text-xs overflow-hidden transition-all duration-500 hover:bg-white"
                        >
                            <span className="relative z-10">Explore Campus</span>
                        </Link>

                        <Link
                            href="/admissions/apply"
                            className="group flex items-center gap-3 px-8 py-5 border-2 border-white/20 text-white hover:border-[#C6A75E] hover:text-[#C6A75E] transition-all text-sm font-bold tracking-widest uppercase"
                        >
                            Admissions Open
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Subtle Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-12 hidden md:block"
            >
                <div className="w-px h-20 bg-gradient-to-b from-[#C6A75E] to-transparent flex flex-col items-center">
                    <motion.div
                        animate={{ y: [0, 40, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white rounded-full mt-2"
                    />
                </div>
            </motion.div>

        </section>
    );
}
