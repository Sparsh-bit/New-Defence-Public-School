'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sun, CloudRain, Snowflake } from 'lucide-react';

const seasons = [
    {
        title: "Summer",
        subtitle: "Innovation & Tech Camps",
        img: "/images/gen/smart_classroom_india_1766952364269.png",
        accent: "from-orange-500/20 to-yellow-500/20",
        icon: Sun,
        text: "Hot Envo + Vacations"
    },
    {
        title: "Winter",
        subtitle: "Cultural & Sports Meet",
        img: "/images/gen/home_corridor_india_1766952480683.png",
        accent: "from-blue-500/20 to-indigo-500/20",
        icon: Snowflake,
        text: "Cold Envo + Vacations"
    },
    {
        title: "Monsoon",
        subtitle: "Eco-Friendly Arts",
        img: "/images/playground.png",
        accent: "from-green-500/20 to-teal-500/20",
        icon: CloudRain,
        text: "Rainy Envo + Seasoning"
    }
];

export function SeasonalHoverCards() {
    return (
        <section className="py-32 bg-primary">
            <div className="container-premium">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6">
                        Our <span className="text-secondary">Seasons</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                        Each semester brings a new atmosphere of learning and discovery.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {seasons.map((season, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -20 }}
                            className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden group border border-white/5"
                        >
                            <Image
                                src={season.img}
                                alt={season.title}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className={cn("absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80", season.accent)} />

                            <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                <div className="mb-6 p-4 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                    <season.icon className="text-white w-8 h-8" />
                                </div>
                                <h3 className="text-4xl font-display font-black text-white mb-2">{season.title}</h3>
                                <p className="text-white/60 font-bold uppercase tracking-tighter text-sm mb-4">{season.subtitle}</p>
                                <p className="text-xs font-black tracking-[0.3em] uppercase text-white/40">{season.text}</p>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { cn } from '@/lib/utils';
