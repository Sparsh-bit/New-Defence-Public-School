'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { Play, Video, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const videos = [
    { title: "Annual Day Highlights", id: "dQw4w9WgXcQ", date: "Dec 2023", category: "Events" }, // Placeholder IDs
    { title: "Campus Tour", id: "dQw4w9WgXcQ", date: "Oct 2023", category: "Facilities" },
    { title: "Science Exhibition", id: "dQw4w9WgXcQ", date: "Aug 2023", category: "Academic" },
    { title: "Sports Meet 2023", id: "dQw4w9WgXcQ", date: "May 2023", category: "Sports" }
];

export default function VideoGalleryPage() {
    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />

                <SubPageHero
                    title="Video Gallery"
                    subtitle="Experience NDPS in motion."
                    breadcrumb="Visual NDPS"
                    icon={<Video className="w-8 h-8" />}
                />

                <ContentSection>
                    <div className="grid md:grid-cols-2 gap-12">
                        {videos.map((vid, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative"
                            >
                                <div className="aspect-video bg-[#0A1628] rounded-[48px] overflow-hidden relative shadow-2xl border-4 border-[#0A1628]/5">
                                    {/* Video Placeholder or Embed */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-24 h-24 bg-[#FFD700] rounded-full flex items-center justify-center text-[#0A1628] cursor-pointer shadow-[0_0_50px_rgba(255,215,0,0.4)]"
                                        >
                                            <Play size={40} fill="currentColor" />
                                        </motion.div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent opacity-60 pointer-events-none" />
                                    <div className="absolute bottom-10 left-10 p-2">
                                        <p className="text-[#FFD700] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{vid.category}</p>
                                        <h5 className="text-2xl font-display font-black text-white tracking-tight">{vid.title}</h5>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-center px-4">
                                    <span className="text-gray-400 text-sm font-light">{vid.date}</span>
                                    <a href={`https://youtube.com/watch?v=${vid.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#0A1628] text-[10px] font-bold uppercase tracking-widest hover:text-[#FFD700] transition-colors">
                                        Watch on YouTube <ExternalLink size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ContentSection>


            </PageTransition>
        </SmoothScroll>
    );
}
