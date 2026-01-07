'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, GraduationCap, Percent } from 'lucide-react';
import { TypingText } from './lightswind/typing-text';

export function AssessmentSection() {
    return (
        <section className="py-[120px] bg-white">
            <div className="container-premium">
                <div className="grid lg:grid-cols-2 gap-20">

                    {/* Assessment Methodology */}
                    <div className="text-left">
                        <TypingText
                            fontSize="text-3xl md:text-4xl"
                            fontWeight="font-display font-medium"
                            color="text-[#0B1C2D]"
                            className="mb-12"
                        >
                            Assessment Methodology
                        </TypingText>
                        <div className="space-y-8">
                            {[
                                { title: "Unit Tests", desc: "Two comprehensive unit tests conducted per academic term to track continuous progress.", icon: CheckCircle2 },
                                { title: "Half-Yearly Examinations", desc: "Standard assessment conducted in September to evaluate first-term learning.", icon: Calendar },
                                { title: "Final Examinations", desc: "Annual evaluation held in March to assess cumulative yearly performance.", icon: GraduationCap },
                                { title: "Integrated Grading", desc: "Standardized CBSE-aligned grading system focusing on both scholastic and co-scholastic areas.", icon: Percent },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className="flex gap-6 items-start"
                                >
                                    <div className="mt-1 text-[#C6A75E]">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#0B1C2D] mb-1">{item.title}</h4>
                                        <p className="text-[#1E2933]/70">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Promotion Rules - Minimal Charcoal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-[#1E2933] rounded-[2rem] p-12 text-[#F7F9FC] flex flex-col justify-center"
                    >
                        <h3 className="text-2xl font-display font-medium !text-white mb-8 border-b border-[#C6A75E]/30 pb-4" style={{ color: '#FFFFFF' }}>
                            Promotion Rules
                        </h3>

                        <div className="space-y-10">
                            <div className="flex items-center gap-8">
                                <div className="text-4xl font-display font-bold text-[#C6A75E]">75%</div>
                                <div className="text-lg">
                                    <span className="block font-semibold">Minimum Attendance</span>
                                    <span className="text-slate-400 text-sm">Mandatory attendance required for exam eligibility.</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-4xl font-display font-bold text-[#C6A75E]">33%</div>
                                <div className="text-lg">
                                    <span className="block font-semibold">Passing Criteria</span>
                                    <span className="text-slate-400 text-sm">Minimum marks required in each subject for promotion.</span>
                                </div>
                            </div>

                            <p className="mt-8 text-sm text-slate-400 italic font-light leading-relaxed">
                                * Promotion is granted based on the overall performance throughout the academic year, including internal assessments and final examinations.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
