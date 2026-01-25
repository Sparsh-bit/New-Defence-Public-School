'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { CalendarClock, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const leaveRules = [
    "No leave of absence is granted except on prior written application by the parents.",
    "In case of illness, a medical certificate must be produced.",
    "A student returning to school after a contagious infection must bring a doctor's certificate of fitness.",
    "If a student is absent for more than six consecutive days without leave, his/her name will be struck off the rolls.",
    "Students must have at least 75% attendance to be eligible for terminal examinations."
];

export default function LeaveRulePage() {
    return (
        <main>
            <SubPageHero
                title="Leave Rules"
                subtitle="Guidelines for attendance and absence."
                breadcrumb="Rules & Regulations"
                icon={<CalendarClock className="w-8 h-8" />}
            />

            <section className="py-24">
                <div className="container-premium">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#C6A75E]/10 p-10 rounded-[40px] border border-[#C6A75E]/20"
                            >
                                <FileText className="w-12 h-12 text-[#0A1628] mb-6" />
                                <h4 className="text-2xl font-display font-black text-[#0A1628] mb-4">Application Mode</h4>
                                <p className="text-gray-700 font-light">All leave requests must be submitted through the student diary or the school ERP system.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#0A1628] p-10 rounded-[40px] text-white"
                            >
                                <AlertTriangle className="w-12 h-12 text-[#C6A75E] mb-6" />
                                <h4 className="text-2xl font-display font-black text-[#C6A75E] mb-4">Strict Policy</h4>
                                <p className="text-white/70 font-light">Attendance is mandatory on the first and last day of every term.</p>
                            </motion.div>
                        </div>

                        <div className="space-y-4">
                            {leaveRules.map((rule, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-6 p-8 bg-white rounded-3xl border border-[#0A1628]/5 shadow-sm hover:translate-x-2 transition-transform duration-300"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center text-[#C6A75E] flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <p className="text-lg text-gray-700 font-light leading-relaxed">{rule}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
