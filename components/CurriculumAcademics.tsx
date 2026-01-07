'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TypingText } from './lightswind/typing-text';

export function CurriculumAcademics() {
    return (
        <section className="py-[120px] bg-[#F7F9FC]">
            <div className="container-premium">
                <div className="max-w-4xl mx-auto text-left">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <TypingText
                            fontSize="text-4xl md:text-6xl"
                            fontWeight="font-display font-medium"
                            color="text-[#0B1C2D]"
                            className="mb-8 w-full"
                        >
                            Curriculum & Academics
                        </TypingText>

                        <p className="text-xl text-[#1E2933]/80 mb-16 leading-relaxed">
                            Our academic framework is meticulously designed to foster <span className="italic">intellectual curiosity</span> and logical reasoning. We prioritize a balanced approach where theoretical knowledge meets practical application.
                        </p>

                        <div className="grid md:grid-cols-2 gap-12">
                            <ul className="space-y-10">
                                {[
                                    { num: "01", title: "CBSE Aligned Standards", desc: "Our curriculum strictly follows Central Board of Secondary Education guidelines ensures national benchmarking." },
                                    { num: "02", title: "Holistic Growth Focus", desc: "Emphasis on cognitive, social, and emotional development through integrated learning paths." },
                                    { num: "03", title: "Project-Based Learning", desc: "Encouraging students to apply concepts through creative projects and real-world problem solving." },
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: i * 0.2 }}
                                        className="flex gap-8 group"
                                    >
                                        <span className="text-3xl font-display font-bold text-[#C6A75E]/30 group-hover:text-[#C6A75E] transition-colors duration-500">
                                            {item.num}
                                        </span>
                                        <div>
                                            <h4 className="text-xl font-semibold text-[#0B1C2D] mb-2">{item.title}</h4>
                                            <p className="text-[#1E2933]/70 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>

                            <ul className="space-y-10">
                                {[
                                    { num: "04", title: "Interactive Assessments", desc: "Regular quizzes, group discussions, and oral tests to build confidence and communication skills." },
                                    { num: "05", title: "Digital Literacy", desc: "Integrating technology into classrooms to prepare students for a technologically advanced future." },
                                    { num: "06", title: "Co-scholastic Integration", desc: "Equal weightage to physical education, arts, and value-based schooling." },
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: (i + 3) * 0.2 }}
                                        className="flex gap-8 group"
                                    >
                                        <span className="text-3xl font-display font-bold text-[#C6A75E]/30 group-hover:text-[#C6A75E] transition-colors duration-500">
                                            {item.num}
                                        </span>
                                        <div>
                                            <h4 className="text-xl font-semibold text-[#0B1C2D] mb-2">{item.title}</h4>
                                            <p className="text-[#1E2933]/70 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
