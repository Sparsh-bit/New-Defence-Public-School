'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ThreeDImageRing } from "@/components/lightswind/3d-image-ring";
import { motion } from 'framer-motion';
import Link from 'next/link';

const infraImages = [
    "/images/infrastructure/fl1.jpg",
    "/images/infrastructure/fl10.jpg",
    "/images/infrastructure/fl7.jpg",
    "/images/infrastructure/fl9.jpg",
    "/images/infrastructure/01.jpg",
    "/images/infrastructure/12.jpg",
    "/images/infrastructure/transport.jpg",
    "/images/gen/smart_classroom_india_1766952364269.png",
];

export default function InfrastructureGallery() {
    return (
        <main className="bg-[#0B1C2D] min-h-screen">
            <SubPageHero
                title="School Infrastructure"
                subtitle="World-class facilities designed for excellence."
                breadcrumb="Gallery"
                icon={<Building2 className="w-8 h-8" />}
                backgroundImage="/images/gen/school_infrastructure_india_1766952342809.png"
            />

            <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden py-20 px-4">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C6A75E]/20 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="w-full h-full"
                    >
                        <ThreeDImageRing
                            images={infraImages}
                            width={320}
                            imageDistance={600}
                            staggerDelay={0.05}
                            animationDuration={1.2}
                            containerClassName="h-[60vh]"
                        />
                    </motion.div>

                    <div className="mt-12 text-center">
                        <p className="text-[#C6A75E] font-black tracking-[0.4em] uppercase text-xs mb-4">Drag to Explore</p>
                        <div className="flex items-center justify-center gap-6 text-white/40">
                            <ChevronLeft size={24} className="animate-pulse" />
                            <div className="w-32 h-px bg-white/10" />
                            <ChevronRight size={24} className="animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white rounded-t-[4rem]">
                <div className="container-premium">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {infraImages.map((src, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl"
                            >
                                <Image
                                    src={src}
                                    alt={`Infra ${idx}`}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-[#0B1C2D]/0 group-hover:bg-[#0B1C2D]/40 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link
                            href="/gallery/events"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-[#0B1C2D] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all"
                        >
                            View Event Gallery
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

import Image from 'next/image';
