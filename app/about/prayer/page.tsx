'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { Heart, Stars, Music, BookText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrayerPage() {
    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />

                <SubPageHero
                    title="Prayer & Pledge"
                    subtitle="Spiritual and moral anchors for our students."
                    breadcrumb="Spirit of NDPS"
                    icon={<Heart className="w-8 h-8" />}
                />

                <ContentSection>
                    <div className="max-w-4xl mx-auto space-y-32">
                        {/* School Prayer */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <Music className="w-12 h-12 text-[#FFD700] mx-auto mb-10 opacity-40" />
                            <h3 className="text-4xl md:text-5xl font-display font-black text-[#0A1628] mb-12 tracking-tight">Our School Prayer</h3>
                            <div className="space-y-6 text-2xl md:text-3xl font-light text-gray-600 leading-[1.6] italic font-display">
                                <p>"O God, our Father, help us today</p>
                                <p>To be good and kind in every way.</p>
                                <p>Bless our school and our land,</p>
                                <p>Keep us always in Thy hand.</p>
                                <p>Give us wisdom, strength, and grace,</p>
                                <p>To make this world a better place."</p>
                            </div>
                            <div className="w-40 h-[1px] bg-[#FFD700] mx-auto mt-16" />
                        </motion.div>

                        {/* School Pledge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#0A1628] text-white p-12 md:p-20 rounded-[48px] shadow-2xl relative overflow-hidden text-center"
                        >
                            <div className="absolute inset-0 opacity-10">
                                <Stars className="w-full h-full" />
                            </div>
                            <BookText className="w-12 h-12 text-[#FFD700] mx-auto mb-10 opacity-40 relative z-10" />
                            <h3 className="text-4xl md:text-5xl font-display font-black text-[#FFD700] mb-12 tracking-tight relative z-10">National Pledge</h3>
                            <div className="space-y-6 text-xl md:text-2xl font-light text-white/80 leading-[1.8] relative z-10 uppercase tracking-wide">
                                <p>"India is my country. All Indians are my brothers and sisters.</p>
                                <p>I love my country and I am proud of its rich and varied heritage.</p>
                                <p>I shall always strive to be worthy of it.</p>
                                <p>I shall give my parents, teachers and all elders respect and treat everyone with courtesy.</p>
                                <p>To my country and my people, I pledge my devotion.</p>
                                <p>In their well-being and prosperity alone lies my happiness."</p>
                            </div>
                        </motion.div>
                    </div>
                </ContentSection>

                <Footer />
            </PageTransition>
        </SmoothScroll>
    );
}
