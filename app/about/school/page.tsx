'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { School, Building2, Users, Trophy, Target, Heart, History, Award } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutSchoolPage() {
    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />

                <SubPageHero
                    title="Our Legacy"
                    subtitle="Excellence in education since 1996."
                    breadcrumb="ABOUT NDPS"
                    icon={<School className="w-8 h-8" />}
                />

                <ContentSection>
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-[64px] overflow-hidden shadow-2xl relative">
                                <Image
                                    src="/images/infra/campus.png"
                                    alt="NDPS Campus"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FFD700] rounded-[48px] flex flex-col items-center justify-center text-[#0A1628] shadow-2xl p-6 text-center">
                                <h4 className="text-4xl font-black mb-1">28+</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest">Years of Excellence</p>
                            </div>
                        </motion.div>

                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-display font-black text-[#0A1628] leading-tight tracking-tight">
                                A Journey of <span className="text-[#FFD700]">Truth & Service</span>
                            </h2>
                            <p className="text-xl text-gray-600 font-light leading-relaxed">
                                Established in 1996 by Ex-Defence Officer Shri Mahesh Chandra Sharma, New Defence Public School has remained
                                steadfast in its commitment to providing high-quality educational experiences that are both rigorous
                                and inclusive.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-[#0A1628]/5 rounded-xl flex items-center justify-center text-[#0A1628]">
                                        <History />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-[#0A1628]">Since 1996</h5>
                                        <p className="text-sm text-gray-400">Founded by Visionaries</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-[#0A1628]/5 rounded-xl flex items-center justify-center text-[#0A1628]">
                                        <Award />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-[#0A1628]">UP Board</h5>
                                        <p className="text-sm text-gray-400">Official Recognition</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentSection>

                <ContentSection alternate title="Our Core Attributes" subtitle="WHAT DEFINES US">
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: <Target />, title: "Precision", desc: "Meticulous focus on academic standards." },
                            { icon: <Users />, title: "Inclusion", desc: "Welcoming students from all walks of life." },
                            { icon: <Heart />, title: "Values", desc: "Character building and moral depth." },
                            { icon: <Trophy />, title: "Success", desc: "Consistent records in board results." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-[40px] shadow-premium border border-[#0A1628]/5 text-center transition-all duration-500"
                            >
                                <div className="text-[#FFD700] mb-6 flex justify-center">{item.icon}</div>
                                <h4 className="text-xl font-bold text-[#0A1628] mb-3">{item.title}</h4>
                                <p className="text-gray-500 font-light text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </ContentSection>


            </PageTransition>
        </SmoothScroll>
    );
}
