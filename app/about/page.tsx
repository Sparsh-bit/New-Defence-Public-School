'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="bg-[#0B1C2D] min-h-screen">

            {/* Premium Hero with Dynamic Image */}
            <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/infra/campus.png"
                        alt="School Building"
                        fill
                        className="object-cover opacity-30 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C2D]/60 via-[#0B1C2D]/95 to-[#0B1C2D]" />
                    <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
                </div>

                <div className="container-premium relative z-10 text-center pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-block py-1.5 px-6 rounded-full bg-[#C6A75E]/20 text-[#C6A75E] border border-[#C6A75E]/30 text-xs font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-md">
                            Legacy Since 1996
                        </span>
                        <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-8 leading-[0.9] tracking-tighter">
                            <span className="text-white">Shaping</span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6A75E] via-white to-[#C6A75E]">Genius Minds</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                            Welcome to New Defence Public School, where tradition meets innovation in the pursuit of excellence.
                        </p>

                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                            <a href="#story" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#C6A75E] hover:border-[#C6A75E] text-white hover:text-[#0B1C2D] font-bold transition-all">Our Story</a>
                            <a href="#vision" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#C6A75E] hover:border-[#C6A75E] text-white hover:text-[#0B1C2D] font-bold transition-all">Vision & Mission</a>
                            <a href="#infrastructure" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#C6A75E] hover:border-[#C6A75E] text-white hover:text-[#0B1C2D] font-bold transition-all">Facilities</a>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20 hidden md:block">
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* Content Sections */}
            <div className="space-y-32 pb-32">

                {/* OUR STORY */}
                <section id="story" className="pt-32 scroll-mt-20">
                    <div className="container-premium px-4">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div className="inline-flex items-center gap-3 text-[#C6A75E] font-black tracking-widest uppercase text-sm">
                                    <span className="w-12 h-[2px] bg-[#C6A75E]"></span>
                                    Our Legacy
                                </div>
                                <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                                    A Foundation of <span className="text-[#C6A75E]">Trust & Values</span>
                                </h2>
                                <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-light">
                                    <p>
                                        Founded in 1996 by <strong className="text-white font-bold">Mahesh Chandra Sharma</strong>, New Defence Public School began with a simple yet profound mission: to provide quality education that is accessible to all.
                                    </p>
                                    <p>
                                        Over three decades, we have evolved from a humble beginning into a premier institution producing state and national level achievers. Our approach combines traditional Indian values with modern scientific pedagogy.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                                        <div className="text-5xl font-black text-[#C6A75E] mb-2">28+</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Years of History</div>
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                                        <div className="text-5xl font-black text-[#C6A75E]/60 mb-2">10k+</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Alumni Network</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl group border border-white/10"
                            >
                                <Image
                                    src="/images/infra/campus.png"
                                    alt="School Building"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/80 via-transparent to-transparent" />
                                <div className="absolute bottom-12 left-12">
                                    <span className="text-white/60 text-xl font-display block mb-2 tracking-widest">ESTD.</span>
                                    <div className="text-white text-8xl font-black tracking-tighter">1996</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* VISION & MISSION */}
                <section id="vision" className="pt-32 scroll-mt-20">
                    <div className="container-premium px-4">
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white/5 p-12 md:p-16 rounded-[3rem] border border-white/10 relative overflow-hidden group hover:border-[#C6A75E]/40 transition-all duration-500"
                            >
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C6A75E]/10 rounded-full blur-[100px] group-hover:bg-[#C6A75E]/20 transition-all" />
                                <Eye className="text-[#C6A75E] mb-8" size={60} />
                                <h2 className="text-4xl font-bold text-white mb-6">Our Vision</h2>
                                <p className="text-xl text-slate-300 leading-relaxed font-light">
                                    To create a society of progressive, thinking individuals who will contribute to the intellectual development of the global community by providing child-centric, value-based education.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/5 p-12 md:p-16 rounded-[3rem] border border-white/10 relative overflow-hidden group hover:border-[#C6A75E]/40 transition-all duration-500"
                            >
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C6A75E]/10 rounded-full blur-[100px] group-hover:bg-[#C6A75E]/20 transition-all" />
                                <Award className="text-[#C6A75E] mb-8" size={60} />
                                <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
                                <p className="text-xl text-slate-300 leading-relaxed font-light">
                                    To empower students to discover their inner potential and achieve excellence in all facets of life while maintaining a strong foundation in human values and ethical conduct.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* INFRASTRUCTURE */}
                <section id="infrastructure" className="pt-32 scroll-mt-20">
                    <div className="container-premium px-4">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <span className="text-[#C6A75E] font-black tracking-[0.2em] uppercase text-xs mb-4 block">Unmatched Environment</span>
                            <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-8">World-Class Facilities</h2>
                            <div className="h-1.5 w-24 bg-[#C6A75E] mx-auto rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: 'Smart Classrooms', desc: 'Interactive digital panels & ergonomic seating', img: '/images/infra/smart_classroom.png' },
                                { title: 'Modern Library', desc: 'Extensive knowledge bank with digital access', img: '/images/infra/library.png' },
                                { title: 'Science Labs', desc: 'Advanced equipment for practical discovery', img: '/images/infra/science_lab.png' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative overflow-hidden rounded-[2.5rem] h-96 border border-white/5"
                                >
                                    <div className="absolute inset-0 bg-slate-800">
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            fill
                                            className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D] via-transparent to-transparent z-10" />

                                    <div className="absolute bottom-0 left-0 p-10 z-20 w-full transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-3xl font-display font-bold text-white mb-3 group-hover:text-[#C6A75E] transition-colors">{item.title}</h3>
                                        <p className="text-slate-300 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
