'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { TypingText } from './lightswind/typing-text';

export function AdmissionInfoSection() {
    return (
        <section className="py-[120px] bg-[#F7F9FC]">
            <div className="container-premium">
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
                    <div className="grid lg:grid-cols-2">

                        {/* Text Content */}
                        <div className="p-10 md:p-20 text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                            >
                                <span className="text-xs font-black tracking-[0.4em] uppercase text-[#C6A75E] mb-6 block">Join Our Community</span>
                                <TypingText
                                    fontSize="text-3xl md:text-5xl"
                                    fontWeight="font-display font-medium"
                                    color="text-[#0B1C2D]"
                                    className="mb-8 leading-tight w-full"
                                >
                                    Admissions & Selection Process
                                </TypingText>

                                <div className="space-y-6 text-lg text-[#1E2933]/80 leading-relaxed mb-12">
                                    <p>
                                        Admission to <span className="font-bold underline decoration-[#C6A75E]/30">New Defence Public School</span> is strictly based on merit and the availability of vacancies in each grade level.
                                    </p>
                                    <p>
                                        Our selection process includes a rigorous <span className="italic">Written Test</span> followed by an <span className="italic">Oral Interaction</span> (interview) to assess the candidate's academic baseline and aptitude.
                                    </p>

                                    <div className="pt-6 space-y-4">
                                        <div className="flex items-center gap-4 text-[#0B1C2D]">
                                            <Phone size={20} className="text-[#C6A75E]" />
                                            <span className="font-semibold">+91 9412362584, +91 9412158024</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[#0B1C2D]">
                                            <Mail size={20} className="text-[#C6A75E]" />
                                            <span className="font-semibold">newdefence@yahoo.co.in</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/admissions/apply"
                                    className="group relative inline-flex items-center gap-3 px-10 py-5 border-2 border-[#C6A75E] text-[#C6A75E] font-bold tracking-widest uppercase text-xs overflow-hidden transition-all duration-500 hover:text-white"
                                >
                                    <span className="relative z-10 transition-colors duration-500">Apply Online</span>
                                    <div className="absolute inset-0 bg-[#0B1C2D] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Visual / Image Side */}
                        <div className="relative bg-[#0B1C2D] overflow-hidden hidden lg:block">
                            <div className="absolute inset-0 grayscale-[50%] opacity-40">
                                <motion.div
                                    initial={{ scale: 1.1 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 5 }}
                                    className="w-full h-full relative"
                                >
                                    <img
                                        src="/images/ndps.jpg"
                                        alt="School Building"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </div>
                            <div className="absolute inset-0 flex flex-col justify-center p-20 text-white z-10">
                                <h3 className="text-3xl font-display italic mb-6 text-white">"Investing in your child's education is the best legacy you can leave behind."</h3>
                                <p className="text-[#C6A75E] font-bold tracking-widest uppercase text-sm">— NDPS Admissions Bureau</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
