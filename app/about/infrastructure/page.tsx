'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { Building2, Microscope, Library, Monitor, Dumbbell, Bus, Shield, Apple, Coffee } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const facilities = [
    {
        title: "Smart Classrooms",
        desc: "Equipped with 4K projectors and interactive whiteboards, our classrooms transform traditional learning into a dynamic, visual experience.",
        icon: <Monitor className="w-8 h-8" />,
        image: "/images/slider/ndps.jpg" // Fallback to campus or relevant image
    },
    {
        title: "Advanced Laboratories",
        desc: "Specialized Physics, Chemistry, Biology, and Mathematics labs designed for hands-on experimentation and scientific discovery.",
        icon: <Microscope className="w-8 h-8" />,
        image: "/images/slider/02.jpg"
    },
    {
        title: "Digital Library",
        desc: "A vast collection of over 10,000 books, journals, and digital resources in a quiet, modern environment conducive to research.",
        icon: <Library className="w-8 h-8" />,
        image: "/images/slider/04.jpg"
    },
    {
        title: "Sports Complex",
        desc: "Professional-grade football ground, basketball courts, and indoor sports facilities to nurture physical fitness and teamwork.",
        icon: <Dumbbell className="w-8 h-8" />,
        image: "/images/slider/01.jpg"
    }
];

export default function InfrastructurePage() {
    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />

                <SubPageHero
                    title="World-Class Infrastructure"
                    subtitle="Designed to provide an environment where innovation meets tradition."
                    breadcrumb="Facilities & Campus"
                    icon={<Building2 className="w-8 h-8" />}
                />

                <ContentSection
                    title="State-of-the-art Learning Spaces"
                    subtitle="OUR FACILITIES"
                >
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                        {facilities.map((fac, idx) => (
                            <motion.div
                                key={fac.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="group"
                            >
                                <div className="relative h-[400px] mb-8 overflow-hidden rounded-[32px] bg-navy-900 shadow-2xl">
                                    <Image
                                        src={fac.image}
                                        alt={fac.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 to-transparent" />
                                    <div className="absolute bottom-8 left-8 right-8 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#FFD700] rounded-xl flex items-center justify-center text-[#0A1628]">
                                            {fac.icon}
                                        </div>
                                        <h3 className="text-2xl font-display font-bold text-white tracking-tight">{fac.title}</h3>
                                    </div>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed font-light">
                                    {fac.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </ContentSection>

                <ContentSection alternate title="Additional Amenities" subtitle="COMPLETE CAMPUS">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: <Bus size={32} />, label: "Transportation", gradient: "from-blue-500 to-cyan-500" },
                            { icon: <Shield size={32} />, label: "CCTV Security", gradient: "from-purple-500 to-indigo-500" },
                            { icon: <Coffee size={32} />, label: "Hygienic Cafeteria", gradient: "from-orange-500 to-amber-500" },
                            { icon: <Apple size={32} />, label: "Health Center", gradient: "from-emerald-500 to-teal-500" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-premium border border-[#0A1628]/5 flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${item.gradient} mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                                    {item.icon}
                                </div>
                                <span className="text-lg font-bold uppercase tracking-wider text-[#0A1628] group-hover:tracking-widest transition-all duration-300">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </ContentSection>

                <Footer />
            </PageTransition>
        </SmoothScroll>
    );
}
