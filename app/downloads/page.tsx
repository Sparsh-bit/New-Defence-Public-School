'use client';

import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import { Download, FileText, FileImage, FileBarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const resources = [
    { title: "School Prospectus 2025-26", size: "4.2 MB", type: "PDF", icon: <FileText /> },
    { title: "Academic Calendar 2025", size: "1.5 MB", type: "PDF", icon: <FileBarChart /> },
    { title: "Class XII Board Results 2023", size: "0.8 MB", type: "PDF", icon: <FileBarChart /> },
    { title: "Class X Board Results 2023", size: "0.7 MB", type: "PDF", icon: <FileBarChart /> },
    { title: "School Uniform Guide", size: "2.1 MB", type: "PDF", icon: <FileImage /> }
];

export default function DownloadsPage() {
    return (
        <PageTransition>
            <SubPageHero
                title="Resources & Downloads"
                subtitle="Access essential documents and forms."
                breadcrumb="Information Hub"
                icon={<Download className="w-8 h-8" />}
            />

            <ContentSection>
                <div className="max-w-4xl mx-auto space-y-6">
                    {resources.map((res, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-8 bg-white rounded-[32px] border border-[#0A1628]/5 shadow-sm hover:shadow-premium flex items-center justify-between transition-all duration-500"
                        >
                            <div className="flex items-center gap-8">
                                <div className="w-14 h-14 bg-[#0A1628]/5 rounded-2xl flex items-center justify-center text-[#0A1628] group-hover:bg-[#FFD700] transition-colors duration-500">
                                    {res.icon}
                                </div>
                                <div>
                                    <h5 className="text-xl font-display font-black text-[#0A1628] tracking-tight">{res.title}</h5>
                                    <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mt-1">{res.type} • {res.size}</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-12 h-12 bg-[#0A1628] rounded-full flex items-center justify-center text-[#FFD700] shadow-lg"
                            >
                                <Download size={20} />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </ContentSection>
        </PageTransition>
    );
}
