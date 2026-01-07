'use client';

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users, Trophy } from "lucide-react";
import { TypingText } from "./lightswind/typing-text";

const highlights = [
    {
        icon: GraduationCap,
        title: "Established: 1996",
        desc: "Nearly three decades of educational excellence in Agra.",
        isSerif: true
    },
    {
        icon: Trophy,
        title: "100% Focused Results",
        desc: "Consistent record of academic superiority in board examinations.",
        hasUnderline: true
    },
    {
        icon: Users,
        title: "Experienced Teaching",
        desc: "Highly qualified faculty dedicated to holistic student development.",
    }
];

export function KeyHighlights() {
    return (
        <section className="py-[120px] bg-[#F7F9FC]">
            <div className="container-premium">
                <div className="grid md:grid-cols-3 gap-16 md:gap-24">
                    {highlights.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            className="flex flex-col items-start text-left group"
                        >
                            <div className="mb-8 p-4 bg-[#E5E9EF] rounded-2xl transition-colors duration-500 group-hover:bg-[#0B1C2D] group-hover:text-white text-[#1E2933]">
                                <item.icon size={32} strokeWidth={1.5} />
                            </div>

                            <h3 className={`text-3xl mb-4 leading-tight ${item.isSerif ? 'font-display font-bold' : 'font-sans font-semibold'}`}>
                                <TypingText
                                    fontSize="text-3xl"
                                    fontWeight={item.isSerif ? 'font-bold' : 'font-semibold'}
                                    color="text-[#0B1C2D]"
                                    delay={i * 0.2}
                                >
                                    {item.title}
                                </TypingText>
                            </h3>

                            <p className="text-[#1E2933]/70 text-lg leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
