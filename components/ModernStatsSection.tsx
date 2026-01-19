'use client';

import React from "react";
import { BentoGrid, BentoGridItem } from "./BentoGrid";
import {
    GraduationCap,
    Users,
    Trophy,
    Sparkles,
    ShieldCheck,
    Zap,
    MapPin
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function ModernStatsSection() {
    return (
        <section className="py-32 bg-[#f8fafc]">
            <div className="container-premium">
                <div className="text-center mb-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-900/10 bg-slate-900/5 text-slate-900 text-[10px] font-black tracking-[0.3em] uppercase mb-8"
                    >
                        <Sparkles size={14} />
                        The NDPS Standard
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-display font-black text-slate-950 mb-8 tracking-tighter"
                    >
                        Excellence in <br /> every <span className="text-highlight italic underline decoration-highlight/10">Dimension.</span>
                    </motion.h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                        We combine elite infrastructure with sophisticated pedagogical methods to nurture the genius within every child.
                    </p>
                </div>

                <BentoGrid className="max-w-7xl mx-auto px-4">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}

const Skeleton = ({ src }: { src?: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[12rem] rounded-2xl overflow-hidden relative group">
        {src ? (
            <Image
                src={src}
                alt="Feature Image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
            />
        ) : (
            <div className="w-full h-full bg-slate-100 animate-shimmer" />
        )}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]" />
    </div>
);

const items = [
    {
        title: "Elite Faculty",
        description: "25+ Expert mentors dedicated to individual student growth.",
        header: <Skeleton src="/images/gen/smart_classroom_india_1766952364269.png" />,
        icon: <Users className="h-4 w-4 text-accent" />,
    },
    {
        title: "Digital Ecosystem",
        description: "Smart classrooms and AI-integrated learning paths.",
        header: <Skeleton src="/images/gen/school_infrastructure_india_1766952342809.png" />,
        icon: <Zap className="h-4 w-4 text-highlight" />,
    },
    {
        title: "Safety First",
        description: "GPS-enabled fleet and 24/7 security surveillance.",
        header: <Skeleton src="/images/playground.png" />,
        icon: <ShieldCheck className="h-4 w-4 text-secondary" />,
    },
    {
        title: "Proven Results",
        description:
            "A decade of 100% board pass rates. We don't just teach; we ensure victory.",
        header: <Skeleton src="/images/ach1.jpg" />,
        icon: <Trophy className="h-4 w-4 text-highlight" />,
    },
    {
        title: "Holistic Growth",
        description: "Focus on sports, arts, and moral values alongside academics.",
        header: <Skeleton src="/images/playground.png" />,
        icon: <Sparkles className="h-4 w-4 text-accent" />,
    },
    {
        title: "Prime Location",
        description: "Modern campus in the heart of Agra, safe and accessible.",
        header: <Skeleton src="/images/aerial_view.png" />,
        icon: <MapPin className="h-4 w-4 text-secondary" />,
    },
    {
        title: "Alumni Network",
        description:
            "10,000+ graduates making their mark globally. Join the league of extraordinary achievers.",
        header: <Skeleton src="/images/students.png" />,
        icon: <GraduationCap className="h-4 w-4 text-accent" />,
    },
];
