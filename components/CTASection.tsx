'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-40 bg-[#f8fafc] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-50 rounded-full blur-[140px] opacity-60" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-pink-50 rounded-full blur-[120px] opacity-40" />

            <div className="container-premium relative z-10 px-4">
                <div className="text-center max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-slate-900/10 bg-slate-900/5 text-slate-900 text-xs font-black tracking-[0.4em] uppercase mb-12"
                    >
                        Admission Open 2025-26
                    </motion.div>

                    <h2 className="text-[12vw] md:text-[8vw] font-display font-black text-slate-950 leading-[0.8] tracking-tighter mb-16">
                        Secure <br /> Your <span className="text-accent italic">Legacy.</span>
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                        <Link
                            href="/admissions/apply"
                            className="w-full md:w-auto px-16 py-8 bg-slate-950 text-white rounded-full font-black text-2xl hover:bg-accent transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            Apply Online
                        </Link>

                        <Link
                            href="/contact"
                            className="w-full md:w-auto px-16 py-8 border border-slate-950/20 text-slate-900 rounded-full font-black text-2xl hover:bg-slate-950 hover:text-white transition-all shadow-sm"
                        >
                            Get Information
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
