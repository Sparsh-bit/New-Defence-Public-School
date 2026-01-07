'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { UserPlus, ClipboardCheck, ArrowRight, FileCheck, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
    {
        title: "Registration",
        desc: "Strictly based on merit and vacancy. Register online or at school. Minimum age 3+ years for kids section.",
        icon: <UserPlus />
    },
    {
        title: "Evaluation",
        desc: "Selection through a comprehensive Admission Test including both Written and Oral assessments.",
        icon: <ClipboardCheck />
    },
    {
        title: "Documentation",
        desc: "Submission of Progress Report, Transfer Certificate (T.C.), and Original Birth Certificate (Nagar Mahapalika).",
        icon: <FileCheck />
    },
    {
        title: "Finalization",
        desc: "Grant of admission is at the discretion of the Principal. Fees must be paid within stipulated timelines.",
        icon: <Landmark />
    }
];

export default function AdmissionProcessPage() {
    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />

                <SubPageHero
                    title="Admission Process"
                    subtitle="Your journey to excellence starts here."
                    breadcrumb="Join Our Community"
                    icon={<UserPlus className="w-8 h-8" />}
                />

                <ContentSection>
                    <div className="grid lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative group"
                            >
                                <div className="p-10 bg-white rounded-[48px] border border-[#0A1628]/5 shadow-premium hover:shadow-[#FFD700]/10 transition-all duration-500 h-full flex flex-col">
                                    <div className="w-16 h-16 bg-[#0A1628] rounded-2xl flex items-center justify-center text-[#FFD700] mb-8 group-hover:scale-110 transition-transform duration-500">
                                        {step.icon}
                                    </div>
                                    <h4 className="text-2xl font-display font-black text-[#0A1628] mb-4">
                                        {idx + 1}. {step.title}
                                    </h4>
                                    <p className="text-[#0A1628]/70 font-light leading-relaxed mb-8 flex-grow">
                                        {step.desc}
                                    </p>
                                    {idx < steps.length - 1 && (
                                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block text-[#FFD700]/20">
                                            <ArrowRight size={48} />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ContentSection>

                <ContentSection alternate title="Essential Documents" subtitle="CHECKLIST">
                    <div className="bg-white rounded-[64px] p-12 md:p-20 shadow-2xl grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h5 className="text-3xl font-display font-black text-[#0A1628]">What you need</h5>
                            <ul className="space-y-4">
                                {[
                                    "Original Birth Certificate (issued by Nagar Mahapalika)",
                                    "Transfer Certificate (T.C.) from previous school",
                                    "Progress Report/Report Card of last class",
                                    "4 Passport size photographs",
                                    "Photocopy of Aadhaar Card",
                                    "Caste Certificate (for SC/ST/OBC categories)"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-center text-lg text-[#0A1628]/80 font-light">
                                        <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center items-center text-center space-y-8 p-12 bg-[#0A1628] rounded-[48px] text-white">
                            <h5 className="text-2xl font-display font-medium">Ready to start?</h5>
                            <p className="text-white/60 font-light max-w-xs">Our online registration portal is open for the academic session 2025-26.</p>
                            <div className="w-full space-y-4">
                                <Link href="/admissions/apply" className="block btn-gold w-full py-5 text-lg">Apply Now Online</Link>
                                <Link href="/admissions/portal" className="block bg-white/10 hover:bg-white/20 backdrop-blur-lg border-2 border-white/30 text-white font-semibold rounded-xl py-4 text-center transition-all duration-300">
                                    🔐 Admin Portal Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </ContentSection>

                <Footer />
            </PageTransition>
        </SmoothScroll>
    );
}
