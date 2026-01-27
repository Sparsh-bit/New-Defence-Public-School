'use client';

import { useState, useEffect } from 'react';
import SubPageHero from '@/components/SubPageHero';
import { Sparkles, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ThreeDImageRing } from "@/components/lightswind/3d-image-ring";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsGallery() {
    const [eventImages, setEventImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch default images from API
                const res = await fetch('/api/content');
                const data = await res.json();
                let images = [];

                if (data.gallery && data.gallery.events) {
                    images = data.gallery.events;
                }

                setEventImages(images);
            } catch (error) {
                console.error('Failed to load images', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1C2D] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#C6A75E] animate-spin" />
            </div>
        );
    }
    return (
        <main className="bg-[#0B1C2D] min-h-screen">
            <SubPageHero
                title="School Events"
                subtitle="Capturing the vibrant life and achievements at NDPS."
                breadcrumb="Gallery"
                icon={<Sparkles className="w-8 h-8" />}
                backgroundImage="/images/gen/school_art_gallery_india_1766952684781.png"
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
                            images={eventImages}
                            width={320}
                            imageDistance={650}
                            staggerDelay={0.05}
                            animationDuration={1.2}
                            containerClassName="h-[60vh]"
                        />
                    </motion.div>

                    <div className="mt-12 text-center">
                        <p className="text-[#C6A75E] font-black tracking-[0.4em] uppercase text-xs mb-4">Spin to View Events</p>
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
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-display font-black text-[#0B1C2D] mb-4">Event Archives</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Browse through our collection of memories from annual days, sports meets, and cultural celebrations.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {eventImages.map((src, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative aspect-square rounded-3xl overflow-hidden shadow-md"
                            >
                                <Image
                                    src={src}
                                    alt={`Event ${idx}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        const target = e.target as HTMLElement;
                                        const parent = target.closest('.group');
                                        if (parent) (parent as HTMLElement).style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link
                            href="/gallery/infrastructure"
                            className="inline-flex items-center gap-4 px-10 py-5 bg-[#0B1C2D] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all"
                        >
                            View Infrastructure
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
