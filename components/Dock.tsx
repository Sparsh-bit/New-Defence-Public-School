'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    FileText,
    Mail,
    Calendar,
    LayoutGrid,
    User,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';

const dockItems = [
    { icon: Home, label: 'Home', href: '/', external: false },
    { icon: GraduationCap, label: 'Admission', href: '/admissions/apply', badge: 3, external: false },
    { icon: FileText, label: 'Downloads', href: '/downloads', external: false },
    { icon: Mail, label: 'Contact', href: '/contact', badge: 12, external: false },
    { icon: Calendar, label: 'Events', href: '/events', external: false },
    { icon: LayoutGrid, label: 'Gallery', href: '/gallery/photos', external: false },
    { icon: User, label: 'Portal', href: 'https://educhanger.in/staff/index.php/signin/login?SchCode=ndps', badge: 1, external: true },
];

export function Dock() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] hidden md:flex items-center justify-center">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-3 p-3 rounded-[2.5rem] bg-[#0B1C2D]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
                {dockItems.map((item, i) => (
                    item.external ? (
                        <a
                            href={item.href}
                            key={i}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.div
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                                animate={{
                                    scale: hoveredIndex === i ? 1.3 : hoveredIndex === i - 1 || hoveredIndex === i + 1 ? 1.1 : 1,
                                    y: hoveredIndex === i ? -10 : 0
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <item.icon className="w-6 h-6 text-[#C6A75E]" />

                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C6A75E] text-[10px] font-black text-[#0B1C2D] border-2 border-[#0B1C2D]">
                                        {item.badge}
                                    </span>
                                )}

                                {/* Tooltip */}
                                <AnimatePresence>
                                    {hoveredIndex === i && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -50, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-[#1E2933] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl pointer-events-none whitespace-nowrap"
                                        >
                                            {item.label}
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1E2933] rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </a>
                    ) : (
                        <Link href={item.href} key={i}>
                            <motion.div
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                                animate={{
                                    scale: hoveredIndex === i ? 1.3 : hoveredIndex === i - 1 || hoveredIndex === i + 1 ? 1.1 : 1,
                                    y: hoveredIndex === i ? -10 : 0
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <item.icon className="w-6 h-6 text-[#C6A75E]" />

                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C6A75E] text-[10px] font-black text-[#0B1C2D] border-2 border-[#0B1C2D]">
                                        {item.badge}
                                    </span>
                                )}

                                {/* Tooltip */}
                                <AnimatePresence>
                                    {hoveredIndex === i && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -50, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-[#1E2933] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl pointer-events-none whitespace-nowrap"
                                        >
                                            {item.label}
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1E2933] rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    )
                ))}
            </motion.div>
        </div>
    );
}
