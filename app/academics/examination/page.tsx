'use client';

import Navbar from '@/components/Navbar';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { ClipboardCheck, FileText, BarChart, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExaminationPage() {
    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />

                <SubPageHero
                    title="Examination"
                    subtitle="Assessment patterns and promotion guidelines."
                    breadcrumb="Academics"
                    icon={<ClipboardCheck className="w-8 h-8" />}
                    backgroundImage="/images/gen/exam_hall_india_1766952498845.png"
                />

                <ContentSection
                    title="Assessment Methodology"
                    subtitle="EVALUATING GROWTH"
                >
                    <div className="grid lg:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h4 className="text-3xl font-display font-black text-[#0A1628]">Primary & Middle Wing</h4>
                                <p className="text-lg text-gray-600 font-light leading-relaxed">
                                    Assessments are continuous and comprehensive. We focus on the development of cognitive,
                                    affective, and psychomotor domains. Formative assessments are carried out through projects,
                                    quizzes, and oral tests.
                                </p>
                                <ul className="space-y-4">
                                    {["Two Unit Tests per term", "Half Yearly Exams (Sept)", "Final Exams (March)", "Integrated Grading System"].map((item, i) => (
                                        <li key={i} className="flex gap-4 items-center text-gray-700">
                                            <div className="w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center text-[10px] font-bold">0{i + 1}</div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-3xl font-display font-black text-[#0A1628]">Senior Secondary</h4>
                                <p className="text-lg text-gray-600 font-light leading-relaxed">
                                    Adhering strictly to UP Board patterns for Class X and XII. Detailed pre-board
                                    examinations and specialized practical sessions are conducted for competitive readiness.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#0A1628] rounded-[64px] p-12 text-white flex flex-col justify-center">
                            <BarChart className="w-20 h-20 text-[#FFD700] mb-8 opacity-40" />
                            <h4 className="text-4xl font-display font-black text-[#FFD700] mb-8 tracking-tight">Promotion Rules</h4>
                            <div className="space-y-6 text-white font-light">
                                <p className="flex gap-4">
                                    <span className="text-[#FFD700] font-black">75%</span>
                                    Attendance is mandatory for appearing in any examination.
                                </p>
                                <p className="flex gap-4">
                                    <span className="text-[#FFD700] font-black">33%</span>
                                    Minimum marks required in each subject for promotion to the next class.
                                </p>
                                <p className="italic">
                                    "Promotion depends on the student's performance throughout the year and not just on the final exams."
                                </p>
                            </div>
                        </div>
                    </div>
                </ContentSection>

            </PageTransition>
        </SmoothScroll>
    );
}
