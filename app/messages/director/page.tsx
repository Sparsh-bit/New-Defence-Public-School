'use client';

import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import { MessageSquare, Quote } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DirectorMessagePage() {
    return (
        <main>
            <SubPageHero
                title="Director's Message"
                subtitle="Empowering students to realize their full potential."
                breadcrumb="Leadership"
                icon={<MessageSquare className="w-8 h-8" />}
            />

            <ContentSection>
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative lg:order-2"
                    >
                        <div className="aspect-[3/4] rounded-[48px] bg-[#0A1628] overflow-hidden shadow-2xl relative border-4 border-[#C6A75E]/10">
                            <Image
                                src="/images/leadership/director.jpg"
                                alt="Rajesh Kumar Sharma"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                            <div className="absolute bottom-12 left-12">
                                <h4 className="text-3xl font-display font-black text-white">Rajesh Kumar Sharma</h4>
                                <p className="text-white/60 uppercase tracking-[0.2em] text-sm font-bold mt-2">Director</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-8 lg:order-1">
                        <Quote className="w-16 h-16 text-[#C6A75E] opacity-20" />
                        <div className="space-y-6 text-xl text-[#0A1628]/80 font-light leading-relaxed">
                            <p className="font-bold italic text-[#0A1628]">
                                "School is more than just a place for academic excellence; it is about realizing the
                                true potential of every student."
                            </p>
                            <p>
                                At New Defence Public School, we are committed to creating an environment where
                                learning is joyful and meaningful. Our dedicated faculty works tirelessly to ensure
                                that each child receives personalized attention and guidance.
                            </p>
                            <p>
                                Beyond academics, we focus on character development, social responsibility, and
                                leadership skills. We strive to provide an environment that fosters collaborative
                                learning and ethical boundaries.
                            </p>
                            <p>
                                I invite you to join our family and experience the difference that dedicated
                                teaching and a nurturing environment can make in your child's life.
                            </p>
                        </div>
                        <div className="pt-8 signature italic font-display text-2xl text-[#0A1628]">
                            Rajesh Kumar Sharma
                        </div>
                    </div>
                </div>
            </ContentSection>
        </main>
    );
}
