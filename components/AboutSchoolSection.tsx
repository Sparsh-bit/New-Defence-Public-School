'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TypingText } from './lightswind/typing-text';

export function AboutSchoolSection() {
    return (
        <section className="py-[120px] bg-white overflow-hidden">
            <div className="container-premium">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Column: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-left"
                    >
                        <div className="flex flex-col items-start gap-2 mb-10">
                            <TypingText
                                fontSize="text-4xl md:text-5xl"
                                fontWeight="font-display font-medium"
                                color="text-[#0B1C2D]"
                                className="w-full"
                            >
                                About New Defence Public School
                            </TypingText>
                        </div>

                        <div className="space-y-8 text-lg text-[#1E2933]/80 leading-relaxed">
                            <p>
                                Founded in <span className="font-bold text-[#0B1C2D]">1996</span>, New Defence Public School (NDPS) has established itself as one of Agra's most respected educational institutions. Our legacy is built on a foundation of <span className="italic">unwavering discipline</span> and academic rigor, combined with a commitment to nurturing individual talent.
                            </p>

                            <p>
                                Located in the heart of <span className="font-bold text-[#0B1C2D]">Shahganj, Agra</span>, our campus provides a tranquil yet intellectually stimulating environment. We believe that education extends beyond textbooks; it is about building <span className="italic">character, competence, and leadership</span>.
                            </p>

                            <p>
                                At NDPS, we don't just teach students; we empower them to explore their potential and excel in a rapidly globalizing world. Our focus remains steadfast on <span className="font-semibold text-[#0B1C2D]">holistic development</span>, ensuring every child is equipped with the skills and values necessary for success.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column: Photo */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <Image
                            src="/images/about_school_render.jpg"
                            alt="NDPS School Building Render"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                        {/* Muted Overlay as per spec */}
                        <div className="absolute inset-0 bg-[#0B1C2D]/20 mix-blend-multiply" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
