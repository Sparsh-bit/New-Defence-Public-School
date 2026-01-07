'use client';

import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import { MessageSquare, Quote } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PrincipalMessagePage() {
    return (
        <main>
            <SubPageHero
                title="Principal's Message"
                subtitle="Fostering a culture of shared learning and values."
                breadcrumb="Leadership"
                icon={<MessageSquare className="w-8 h-8" />}
            />

            <ContentSection>
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-[3/4] rounded-[48px] bg-[#0A1628] overflow-hidden shadow-2xl relative border-4 border-[#C6A75E]/10">
                            <Image
                                src="/images/leadership/principal.jpg"
                                alt="Sanjay Sharma"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                            <div className="absolute bottom-12 left-12">
                                <h4 className="text-3xl font-display font-black text-white">Sanjay Sharma</h4>
                                <p className="text-white/60 uppercase tracking-[0.2em] text-sm font-bold mt-2">Principal</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        <Quote className="w-16 h-16 text-[#C6A75E] opacity-20" />
                        <div className="space-y-6 text-xl text-[#0A1628]/80 font-light leading-relaxed">
                            <p className="font-bold italic text-[#0A1628]">
                                "Education is a shared commitment between dedicated teachers, motivated students and enthusiastic parents."
                            </p>
                            <p>
                                Welcome to our vibrant Learning Community! As we celebrate over 24 years of educational legacy,
                                our commitment remains steadfast: to provide an inspiring and nurturing environment
                                where every child can learn, grow, and achieve their dreams.
                            </p>
                            <p>
                                At NDPS, we focus on holistic growth and creative thinking. We believe in preparing
                                students for the challenges of the future while maintaining a deep respect for
                                national and family values.
                            </p>
                            <p>
                                Our teachers are here not just to impart knowledge but to ignite curiosity and
                                challenge students to think deeply. Together, we create a culture of learning
                                where excellence is encouraged in every endeavor.
                            </p>
                        </div>
                        <div className="pt-8 signature italic font-display text-2xl text-[#0A1628]">
                            Sanjay Sharma
                        </div>
                    </div>
                </div>
            </ContentSection>
        </main>
    );
}
