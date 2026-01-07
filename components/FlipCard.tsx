'use client';

import { useState } from 'react';
import { useSpring, a } from '@react-spring/web';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Quote } from 'lucide-react';

interface FlipCardProps {
    leader: {
        id: string;
        name: string;
        title: string;
        image: string;
        quote: string;
        message: string[];
        accentColor: string;
        gradientFrom: string;
        gradientTo: string;
    };
}

export default function FlipCard({ leader }: FlipCardProps) {
    const [flipped, setFlipped] = useState(false);

    const { transform, opacity } = useSpring({
        opacity: flipped ? 1 : 0,
        transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 },
    });

    return (
        <div
            className="relative h-[500px] w-full cursor-pointer group"
            onClick={() => setFlipped(state => !state)}
        >
            {/* Front of Card */}
            <a.div
                className="absolute inset-0 w-full h-full will-change-transform h-full w-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white"
                style={{
                    opacity: opacity.to(o => 1 - o),
                    transform,
                    zIndex: flipped ? 0 : 1,
                    backfaceVisibility: 'hidden',
                }}
            >
                <div className="relative h-full">
                    <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-3xl font-display font-black text-white mb-2">
                            {leader.name}
                        </h3>
                        <div
                            className="inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-2"
                            style={{ backgroundColor: leader.accentColor, color: '#0A1628' }}
                        >
                            {leader.title}
                        </div>
                        <p className="text-white/80 text-sm mt-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-lg">↻</span>
                            </span>
                            Click to Flip
                        </p>
                    </div>
                </div>
            </a.div>

            {/* Back of Card */}
            <a.div
                className="absolute inset-0 w-full h-full will-change-transform h-full w-full rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#0A1628] to-[#1A3969] p-8 flex flex-col justify-between border-2"
                style={{
                    opacity,
                    transform,
                    rotateY: '180deg',
                    zIndex: flipped ? 1 : 0,
                    backfaceVisibility: 'hidden',
                    borderColor: leader.accentColor
                }}
            >
                <div className="overflow-y-auto pr-2 custom-scrollbar">
                    <Quote className="w-10 h-10 mb-4 opacity-50" style={{ color: leader.accentColor }} />
                    <p className="text-xl font-bold text-white mb-6 italic leading-relaxed">
                        "{leader.quote}"
                    </p>
                    <div className="space-y-4">
                        {leader.message.map((para, i) => (
                            <p key={i} className="text-white/80 text-sm leading-relaxed font-light">
                                {para}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-white">{leader.name}</p>
                        <p className="text-xs text-white/60 uppercase">{leader.title}</p>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-wider text-[#FFD700]">
                        Click to Return
                    </button>
                </div>
            </a.div>
        </div>
    );
}
