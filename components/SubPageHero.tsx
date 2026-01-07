'use client';

import { motion } from 'framer-motion';
import Hero3DScene from './Hero3DScene';
import { ReactNode } from 'react';
import Image from 'next/image';
import { TypingText } from './lightswind/typing-text';

interface SubPageHeroProps {
    title: string;
    subtitle?: string;
    breadcrumb?: string;
    icon?: ReactNode;
    backgroundImage?: string;
}

export default function SubPageHero({ title, subtitle, breadcrumb, icon, backgroundImage }: SubPageHeroProps) {
    return (
        <section className="relative min-h-[60vh] flex flex-col justify-end pt-48 pb-24 overflow-hidden bg-primary">
            {/* Custom Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={backgroundImage}
                        alt="Background"
                        fill
                        className="object-cover opacity-30 object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
                </div>
            )}

            {/* Mesh Gradient Overlay */}
            <div className={`absolute inset-0 bg-mesh-gradient ${backgroundImage ? 'opacity-60' : 'opacity-80'}`} />

            {/* Shared 3D Scene in background */}
            <div className="absolute inset-0 opacity-40">
                <Hero3DScene />
            </div>

            <div className="container-premium relative z-10 px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl"
                >
                    {breadcrumb && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex items-center gap-2 text-accent text-sm font-bold tracking-[0.3em] uppercase mb-8"
                        >
                            <span className="w-8 h-[2px] bg-accent" />
                            {breadcrumb}
                        </motion.div>
                    )}

                    <div className="flex items-center gap-6 mb-8">
                        {icon && (
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="w-16 h-16 bg-gradient-to-br from-highlight to-secondary rounded-2xl flex items-center justify-center text-primary-dark shadow-glow"
                            >
                                {icon}
                            </motion.div>
                        )}
                        <div className="relative">
                            <TypingText
                                text={title}
                                fontSize="text-5xl md:text-7xl lg:text-8xl"
                                fontWeight="font-display font-black"
                                color="text-white"
                                className="leading-none tracking-tighter drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </motion.div>
            </div>

            {/* Composition Decorative Element */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.05, scale: 1 }}
                transition={{ delay: 0.8, duration: 2 }}
                className="absolute -right-20 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none"
            >
                <div className="text-[20rem] font-black text-white leading-none tracking-tighter select-none">
                    {title.split(' ')[0][0]}
                </div>
            </motion.div>
        </section>
    );
}
