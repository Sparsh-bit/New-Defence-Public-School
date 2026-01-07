'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import { Camera, Building2, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const galleryTypes = [
    {
        title: "Infrastructure",
        desc: "Explore our state-of-the-art campus and facilities.",
        href: "/gallery/infrastructure",
        image: "/images/gen/school_infrastructure_india_1766952342809.png",
        icon: <Building2 className="w-10 h-10" />,
        color: "#C6A75E"
    },
    {
        title: "Events & Life",
        desc: "Vibrant memories of school activities and celebrations.",
        href: "/gallery/events",
        image: "/images/gen/school_art_gallery_india_1766952684781.png",
        icon: <Sparkles className="w-10 h-10" />,
        color: "#3B82F6"
    }
];

export default function GalleryLandingPage() {
    return (
        <main className="bg-[#E5E9EF] min-h-screen">
            <SubPageHero
                title="NDPS Gallery"
                subtitle="A visual journey through our legacy and learning environment."
                breadcrumb="Visuals"
                icon={<Camera className="w-8 h-8" />}
                backgroundImage="/images/gen/school_art_gallery_india_1766952684781.png"
            />

            <section className="py-24 px-4">
                <div className="container-premium">
                    <div className="grid md:grid-cols-2 gap-12">
                        {galleryTypes.map((type, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="group relative"
                            >
                                <Link href={type.href} className="block">
                                    <div className="relative aspect-[16/9] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white">
                                        <Image
                                            src={type.image}
                                            alt={type.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-[#0B1C2D]/60 group-hover:bg-[#0B1C2D]/40 transition-all duration-500" />

                                        <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                            <div className="mb-6 text-white transform group-hover:-translate-y-2 transition-transform duration-500">
                                                <div className="mb-4 text-[#C6A75E]">{type.icon}</div>
                                                <h2 className="text-4xl md:text-5xl font-display font-black mb-4 text-white">{type.title}</h2>
                                                <p className="text-white/70 text-lg max-w-sm font-light">{type.desc}</p>
                                            </div>

                                            <div className="flex items-center gap-4 text-[#C6A75E] font-bold uppercase tracking-widest text-sm translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                Enter Gallery <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-32 p-16 rounded-[4rem] bg-[#0B1C2D] text-white overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6A75E]/10 rounded-full blur-[100px]" />
                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-4xl font-display font-bold mb-6">Experience NDPS</h3>
                                <p className="text-white/60 text-lg leading-relaxed mb-8">
                                    Witness the vibrant atmosphere of our campus firsthand. From academic excellence to spirited sports events,
                                    NDPS offers a nurturing environment for holistic growth. Schedule a visit today.
                                </p>
                                <div className="flex gap-4 items-center">
                                    <Link href="/admissions/apply" className="px-8 py-4 bg-[#C6A75E] text-[#0B1C2D] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
                                        Apply Now
                                    </Link>
                                    <Link href="/contact" className="px-8 py-4 bg-white/10 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors flex items-center">
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                            <div className="relative aspect-video rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group">
                                <Image
                                    src="/images/ndps.jpg"
                                    alt="Campus Life"
                                    fill
                                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-white font-display font-bold text-3xl drop-shadow-lg tracking-wider">NDPS CAMPUS</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
