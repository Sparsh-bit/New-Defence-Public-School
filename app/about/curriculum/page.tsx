'use client';

import Navbar from '@/components/Navbar';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { BookOpen, Award, GraduationCap, Microscope, Palette, Music, Calculator, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const levels = [
    {
        title: "Primary Wing",
        desc: "Focusing on the discovery of self and the world. We emphasize literacy, numeracy, and personal growth through activity-based learning.",
        subjects: ["English Literacy", "Numeracy Skills", "Environmental Science", "Art & Craft"],
        icon: <Palette className="w-6 h-6" />,
        color: "bg-blue-50"
    },
    {
        title: "Middle School",
        desc: "A transition to more formal disciplines while maintaining a holistic approach. Integrated learning of sciences and humanities.",
        subjects: ["Languages", "Pure Sciences", "Modern History", "Geography"],
        icon: <Calculator className="w-6 h-6" />,
        color: "bg-amber-50"
    },
    {
        title: "Senior Secondary",
        desc: "Preparing for life and careers. Specialized streams in Science and Commerce with a focus on competitive readiness.",
        subjects: ["Physics/Accounts", "Chemistry/Business", "Maths/Eco", "Computer Science"],
        icon: <GraduationCap className="w-6 h-6" />,
        color: "bg-emerald-50"
    }
];

export default function CurriculumPage() {
    return (
        <main>
            <SubPageHero
                title="Academic Curriculum"
                subtitle="Empowering minds through a comprehensive and rigorous academic framework."
                breadcrumb="Academics"
                icon={<BookOpen className="w-8 h-8" />}
            />

            <section className="py-24">
                <div className="container-premium">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C6A75E] mb-4 block">OUR PEDAGOGY</span>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-[#0A1628]">Nurturing Brilliance At Every Stage</h2>
                    </div>

                    <div className="space-y-12">
                        {levels.map((level, idx) => (
                            <motion.div
                                key={level.title}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className={`flex flex-col md:flex-row gap-8 items-center p-8 md:p-12 rounded-[40px] ${level.color} border border-black/5`}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-[#0A1628] rounded-xl flex items-center justify-center text-[#FFD700]">
                                            {level.icon}
                                        </div>
                                        <h3 className="text-3xl font-display font-black text-[#0A1628]">{level.title}</h3>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-xl">
                                        {level.desc}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {level.subjects.map((s) => (
                                            <div key={s} className="flex items-center gap-3 text-sm font-bold text-[#0A1628]/60 uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 bg-[#C6A75E] rounded-full" />
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-full md:w-1/3 aspect-square bg-[#0A1628] rounded-[32px] flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-transparent" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="opacity-10"
                                    >
                                        <Globe className="w-48 h-48 text-white" />
                                    </motion.div>
                                    <BookOpen className="w-16 h-16 text-[#FFD700] relative z-10" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <ContentSection alternate title="Co-Curricular Excellence" subtitle="BEYOND ACADEMICS">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Science Club", desc: "Fostering innovation through practical experiments.", icon: <Microscope /> },
                        { title: "Performing Arts", desc: "Encouraging self-expression through music and dance.", icon: <Music /> },
                        { title: "Sports Academy", desc: "Building character and physical excellence.", icon: <Award /> }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-[#0A1628]/5">
                            <div className="text-[#C6A75E] mb-6">{item.icon}</div>
                            <h4 className="text-2xl font-display font-bold text-[#0A1628] mb-4">{item.title}</h4>
                            <p className="text-gray-600 leading-relaxed font-light">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </ContentSection>
        </main>
    );
}
