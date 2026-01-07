'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Quote, Wifi, Battery, Signal } from 'lucide-react';

interface PhoneCardProps {
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
    isActive: boolean;
    onClick: () => void;
}

export default function PhoneCard({ leader, isActive, onClick }: PhoneCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    return (
        <div style={{ perspective: 2000 }}>
            <motion.div
                className={`relative w-[300px] h-[600px] rounded-[3rem] border-8 border-gray-900 bg-gray-900 shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 ${isActive ? 'z-50 scale-110' : 'z-10 scale-95 opacity-80 hover:opacity-100'}`}
                animate={{
                    rotateY: isActive ? 0 : -10,
                    rotateX: isActive ? 0 : 5,
                    y: isActive ? -20 : 0
                }}
                whileHover={{
                    scale: isActive ? 1.1 : 1,
                    rotateY: 0,
                    rotateX: 0,
                    y: -10
                }}
                onClick={onClick}
                style={{
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Phone Frame Details */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-50 flex justify-center items-end pb-1">
                    <div className="w-16 h-1 bg-gray-800 rounded-full" />
                </div>

                {/* Screen Content */}
                <div className="relative w-full h-full bg-white overflow-hidden rounded-[2.5rem]">

                    {/* Status Bar */}
                    <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-40 text-xs font-medium text-white mix-blend-difference">
                        <span>9:41</span>
                        <div className="flex gap-1.5">
                            <Signal size={12} />
                            <Wifi size={12} />
                            <Battery size={12} />
                        </div>
                    </div>

                    {/* Header Image */}
                    <div className="relative h-[45%] w-full">
                        <Image
                            src={leader.image}
                            alt={leader.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />

                        <motion.div
                            className="absolute bottom-4 left-6 right-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span
                                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 text-white shadow-sm"
                                style={{ backgroundColor: leader.accentColor }}
                            >
                                {leader.title}
                            </span>
                            <h3 className="text-2xl font-display font-black text-[#0A1628] leading-tight">
                                {leader.name}
                            </h3>
                        </motion.div>
                    </div>

                    {/* Animated Content */}
                    <div className="h-[55%] p-6 pt-2 overflow-y-auto custom-scrollbar">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="relative pl-4 border-l-2" style={{ borderColor: leader.accentColor }}>
                                <p className="text-sm font-medium italic text-gray-800 leading-relaxed">
                                    "{leader.quote}"
                                </p>
                            </div>

                            <motion.div layout className="space-y-3">
                                {leader.message.map((para, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                        className="text-xs text-gray-600 leading-relaxed"
                                    >
                                        {para}
                                    </motion.p>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900/20 rounded-full" />
                </div>
            </motion.div>
        </div>
    );
}
