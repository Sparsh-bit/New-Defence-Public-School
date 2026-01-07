'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FileDown } from 'lucide-react';

interface GlassFolderProps {
    title: string;
    count: number;
    className?: string;
}

export function GlassFolder({ title, count, className }: GlassFolderProps) {
    return (
        <motion.div
            whileHover="hover"
            initial="initial"
            className={cn("relative w-64 h-48 cursor-pointer group perspective-1000", className)}
        >
            {/* Front Panel (The actual folder face) */}
            <motion.div
                variants={{
                    hover: { rotateX: -20, y: 10, scale: 1.05 }
                }}
                className="absolute inset-0 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl z-30 flex flex-col justify-end p-6 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <FileDown size={24} className="text-white" />
                </div>
                <h3 className="text-white font-black text-xl leading-tight mb-1">{title}</h3>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{count} Documents</p>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Middle Sheet 1 */}
            <motion.div
                variants={{
                    hover: { y: -20, rotateX: -10, scale: 0.95 }
                }}
                className="absolute inset-x-4 inset-y-0 bottom-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl z-20 shadow-xl"
            />

            {/* Back Sheet (Folder Tab) */}
            <motion.div
                variants={{
                    hover: { y: -35, rotateX: -5, scale: 0.9 }
                }}
                className="absolute top-0 left-6 w-20 h-8 bg-white/30 backdrop-blur-xl border border-white/40 rounded-t-xl z-10"
            />

            {/* Background Shadow Glow */}
            <div className="absolute -inset-4 bg-accent/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-0" />
        </motion.div>
    );
}
