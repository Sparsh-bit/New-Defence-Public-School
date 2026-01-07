'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { Newspaper, Calendar, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const articles = [
    {
        title: "Innovating Education: The Smart Class Initiative",
        excerpt: "How digital integration is transforming the classroom experience at NDPS...",
        date: "Jan 12, 2024",
        author: "Admin",
        category: "Academic",
        image: "/images/slider/02.jpg"
    },
    {
        title: "Annual Sports Meet: A Display of Grit",
        excerpt: "Students showcased exceptional sportsmanship in our latest inter-house championship...",
        date: "Dec 20, 2023",
        author: "Sports Dept",
        category: "Events",
        image: "/images/slider/01.jpg"
    }
];

export default function InsightPage() {
    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />

                <SubPageHero
                    title="NDPS Insight"
                    subtitle="Latest news, stories, and updates from our campus."
                    breadcrumb="Blog & News"
                    icon={<Newspaper className="w-8 h-8" />}
                />

                <ContentSection>
                    <div className="grid md:grid-cols-2 gap-12">
                        {articles.map((post, idx) => (
                            <motion.article
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white rounded-[48px] overflow-hidden shadow-premium border border-[#0A1628]/5 transition-all duration-500 hover:shadow-[#FFD700]/10"
                            >
                                <div className="h-[300px] relative overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-8 left-8">
                                        <span className="bg-[#0A1628] text-[#FFD700] text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-widest">{post.category}</span>
                                    </div>
                                </div>
                                <div className="p-12">
                                    <div className="flex items-center gap-6 text-gray-400 text-sm font-light mb-6">
                                        <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
                                    </div>
                                    <h4 className="text-3xl font-display font-black text-[#0A1628] mb-6 leading-tight group-hover:text-[#FFD700] transition-colors">{post.title}</h4>
                                    <p className="text-lg text-gray-500 font-light leading-relaxed mb-8">{post.excerpt}</p>
                                    <button className="flex items-center gap-3 text-[#0A1628] font-bold uppercase text-[10px] tracking-[0.3em] group/btn">
                                        Read Full Story <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </ContentSection>

                <Footer />
            </PageTransition>
        </SmoothScroll>
    );
}
