'use client';

import Navbar from '@/components/Navbar';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { ShieldAlert, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const rules = [
    "Students must reach the school at least 5 minutes before the commencement of the assembly.",
    "Cleanliness of person and surroundings is expected from everyone.",
    "English being the medium of instruction, the students are expected to speak in English only.",
    "Personal cleanliness, grooming and hygiene should be maintained.",
    "Tattooing and threading of eyebrows are strictly prohibited.",
    "No student is allowed to bring mobile phones or any other electronic gadgets to school.",
    "Care must be taken of school property. Damaging school property will lead to heavy fines."
];

export default function ConductPage() {
    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />

                <SubPageHero
                    title="Code of Conduct"
                    subtitle="Standards of behavior and discipline for our students."
                    breadcrumb="Rules & Regulations"
                    icon={<ShieldAlert className="w-8 h-8" />}
                />

                <ContentSection
                    title="General Rules of Discipline"
                    subtitle="ENSURING A SAFE HARMONY"
                >
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-4">
                            {rules.map((rule, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-4 p-6 bg-[#0A1628]/80 rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <CheckCircle2 className="w-6 h-6 text-[#FFD700] flex-shrink-0" />
                                    <p className="text-white font-light leading-relaxed">{rule}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#0A1628] p-12 rounded-[40px] text-white space-y-8 sticky top-32"
                        >
                            <div className="flex items-center gap-4 text-[#FFD700]">
                                <AlertCircle className="w-8 h-8" />
                                <h4 className="text-2xl font-display font-black tracking-tight uppercase bg-[#C6A75E] text-white px-2">CRUCIAL NOTE</h4>
                            </div>
                            <p className="text-lg text-white/70 font-light leading-relaxed">
                                The school reserves the right to suspend or dismiss any student whose conduct is
                                prejudicial to the interest of the school. Discipline is non-negotiable at NDPS.
                            </p>
                            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                                <Info className="w-6 h-6 text-[#FFD700] mb-4" />
                                <p className="text-sm font-bold tracking-widest uppercase mb-2">School Hours</p>
                                <p className="text-white/60">Summer: 7:30 AM - 1:30 PM</p>
                                <p className="text-white/60">Winter: 8:00 AM - 2:00 PM</p>
                            </div>
                        </motion.div>
                    </div>
                </ContentSection>

            </PageTransition>
        </SmoothScroll>
    );
}
