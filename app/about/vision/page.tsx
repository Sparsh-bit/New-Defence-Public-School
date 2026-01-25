'use client';

import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import { Target, Compass, Heart, Lightbulb, Users, ShieldCheck, Stars } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisionPage() {
    return (
        <main>
            <SubPageHero
                title="Vision & Mission"
                subtitle="Our guiding principles that drive excellence in everything we do."
                breadcrumb="ABOUT NDPS"
                icon={<Target className="w-8 h-8" />}
            />

            <ContentSection className="bg-[#0B1C2D]">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            <div>
                                <h3 className="text-4xl font-display font-black text-white mb-6">Our Vision</h3>
                                <p className="text-xl text-slate-300 leading-relaxed font-light">
                                    To be a premier global institution that nurtures futuristic leaders through balanced education,
                                    technological integration, and values-based character development. We aim to create a world where every
                                    student is empowered to innovate and contribute positively to society.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-4xl font-display font-black text-white mb-6">Our Mission</h3>
                                <p className="text-xl text-slate-300 leading-relaxed font-light">
                                    Our mission is to provide an inclusive learning environment that fosters curiosity,
                                    integrity, and academic excellence. We strive to bridge the gap between traditional
                                    wisdom and modern innovation, ensuring our students are prepared for the challenges
                                    of the 21st century.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="relative order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-square bg-gradient-to-br from-[#0A1628] to-[#1A3969] rounded-[48px] flex items-center justify-center p-12 overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <Stars className="w-full h-full text-[#FFD700]" />
                            </div>
                            <div className="grid grid-cols-2 gap-6 relative z-10 w-full">
                                {[
                                    { icon: <Heart />, label: "Integrity" },
                                    { icon: <Lightbulb />, label: "Innovation" },
                                    { icon: <Users />, label: "Community" },
                                    { icon: <ShieldCheck />, label: "Excellence" }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl flex flex-col items-center gap-4 group transition-colors hover:bg-[#FFD700]/10"
                                    >
                                        <div className="text-[#FFD700] group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <span className="text-white font-bold tracking-widest uppercase text-[10px]">{item.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </ContentSection>

            <ContentSection alternate title="Core Philosophies" subtitle="HOW WE LEAD">
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        {
                            title: "Student Centricity",
                            desc: "Every decision we make starts with how it benefits the student's holistic development.",
                            icon: <Users className="w-12 h-12" />
                        },
                        {
                            title: "Global Perspective",
                            desc: "We prepare our students to compete and collaborate on an international stage.",
                            icon: <Compass className="w-12 h-12" />
                        },
                        {
                            title: "Ethical Leadership",
                            desc: "Success without ethics is failure. We build character first.",
                            icon: <ShieldCheck className="w-12 h-12" />
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-10 bg-white rounded-[32px] shadow-premium hover:shadow-[#FFD700]/10 transition-shadow duration-500"
                        >
                            <div className="text-[#FFD700] mb-8 bg-[#0A1628] w-20 h-20 rounded-2xl flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-1000">
                                {item.icon}
                            </div>
                            <h4 className="text-2xl font-display font-black text-[#0A1628] mb-4">{item.title}</h4>
                            <p className="text-gray-600 font-light leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </ContentSection>
        </main>
    );
}
