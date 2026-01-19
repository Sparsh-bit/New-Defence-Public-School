'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const items = [
    { title: 'Interactive Learning', subtitle: 'Smart class ecosystems', img: '/images/classroom.png' },
    { title: 'Practical Wisdom', subtitle: 'Advanced research labs', img: '/images/lab.png' },
    { title: 'Vast Horizons', subtitle: 'Our global library', img: '/images/library.png' },
    { title: 'Athletic Spirit', subtitle: 'Professional arenas', img: '/images/playground.png' },
];

export function CinematicShowcase() {
    return (
        <section className="bg-[#f8fafc] pb-32">
            <div className="space-y-4">
                {items.map((item, i) => (
                    <ShowcaseItem key={i} item={item} index={i} />
                ))}
            </div>
        </section>
    );
}

function ShowcaseItem({ item, index }: { item: typeof items[0], index: number }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <div ref={ref} className="h-screen flex items-center justify-center sticky top-0 overflow-hidden">
            <motion.div
                style={{ scale, opacity }}
                className="relative w-[90vw] h-[80vh] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white border border-slate-900/5"
            >
                <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="90vw"
                    className="object-cover transition-transform duration-1000 scale-105"
                />
                <div className="absolute inset-0 bg-white/10 bg-gradient-to-t from-slate-950/60 via-transparent to-white/20" />

                <motion.div
                    style={{ y }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                >
                    <span className="text-accent font-black tracking-[0.6em] uppercase text-xs mb-4">{item.subtitle}</span>
                    <h3 className="text-6xl md:text-9xl font-display font-black text-white drop-shadow-2xl tracking-tighter">{item.title}</h3>
                </motion.div>
            </motion.div>
        </div>
    );
}
