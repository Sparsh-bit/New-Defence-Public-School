'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { TypingText } from './lightswind/typing-text';

const leaders = [
    {
        name: "Mahesh Chandra Sharma",
        position: "Manager",
        message: "Our vision at NDPS is to provide a platform where every child can grow into a responsible and successful citizen. We focus on bridging the gap between traditional values and modern education.",
        image: "/images/leadership/manager.png",
        link: "/messages/manager"
    },
    {
        name: "Rajesh Kumar Sharma",
        position: "Director",
        message: "Education is the most powerful weapon which you can use to change the world. At NDPS, we strive to ignite the fire of curiosity and integrity in every heart we touch.",
        image: "/images/leadership/director.png",
        link: "/messages/director"
    },
    {
        name: "Sanjay Sharma",
        position: "Principal",
        message: "Welcome to a temple of learning. Our commitment to excellence is reflected in our students' achievements and their contribution to society. We invite you to join our journey.",
        image: "/images/leadership/principal.jpg",
        link: "/messages/principal"
    }
];

export function LeadershipMessages() {
    return (
        <section className="py-[120px] bg-[#0B1C2D]">
            <div className="container-premium text-center mb-20 flex justify-center">
                <TypingText
                    fontSize="text-4xl md:text-6xl"
                    fontWeight="font-display font-medium"
                    color="text-white"
                    className="flex justify-center w-full"
                >
                    Leadership Messages
                </TypingText>
            </div>

            <div className="container-premium px-4">
                <div className="grid lg:grid-cols-3 gap-10">
                    {leaders.map((leader, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            className="bg-[#1E2933] rounded-2xl shadow-xl overflow-hidden flex flex-col items-start p-10 border border-white/10"
                        >
                            <div className="flex items-center gap-6 mb-8 text-left w-full">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-[#C6A75E]/30 bg-slate-100">
                                    <Image
                                        src={leader.image}
                                        alt={leader.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-bold !text-white leading-tight" style={{ color: '#FFFFFF' }}>
                                        {leader.name}
                                    </h3>
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#C6A75E]">
                                        {leader.position}
                                    </span>
                                </div>
                            </div>

                            <p className="text-slate-300 text-base leading-relaxed mb-6 italic line-clamp-4">
                                "{leader.message}"
                            </p>

                            <Link
                                href={leader.link}
                                className="text-xs font-black uppercase tracking-widest text-white border-b-2 border-white/30 pb-1 hover:text-[#C6A75E] hover:border-[#C6A75E] transition-all"
                            >
                                Read More
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
