'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const links = [
    { title: 'Admissions', href: '/admissions/apply', img: '/images/ad.png' },
    { title: 'Curriculum', href: '/about/curriculum', img: '/images/library.png' },
    { title: 'Infrastructure', href: '/about/infrastructure', img: '/images/lab.png' },
    { title: 'Photo Gallery', href: '/gallery/photos', img: '/images/ndps.jpg' },
    { title: 'Achievements', href: '/achievements', img: '/images/ach1.jpg' },
    { title: 'Messages', href: '/messages/manager', img: '/images/leadership/founder.png' },
];

export function VisualNavSection() {
    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="container-premium">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl px-4">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-8xl font-display font-black text-slate-950 leading-none tracking-tighter"
                        >
                            Navigate <br /> <span className="text-accent italic">Excellence.</span>
                        </motion.h2>
                    </div>
                    <p className="text-slate-600 text-xl font-light max-w-sm px-4 leading-relaxed">
                        Direct access to everything that makes NDPS a premier destination for holistic growth.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {links.map((link, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative h-96 rounded-[3rem] overflow-hidden bg-slate-100 border border-slate-900/5 shadow-sm"
                        >
                            <Image
                                src={link.img}
                                alt={link.title}
                                fill
                                className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

                            <Link href={link.href} className="absolute inset-0 z-10 p-12 flex flex-col justify-end">
                                <div className="flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-3xl font-display font-black text-white tracking-tight">{link.title}</h3>
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center -translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-slate-950 shadow-2xl">
                                        <ArrowUpRight size={24} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
