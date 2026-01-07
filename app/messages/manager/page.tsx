'use client';

import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import { MessageSquare, Quote } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ManagerMessagePage() {
    return (
        <main>
            <SubPageHero
                title="Manager's Message"
                subtitle="Leading with discipline and vision."
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
                                src="/images/leadership/manager.jpg"
                                alt="Mahesh Chandra Sharma"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                            <div className="absolute bottom-12 left-12">
                                <h4 className="text-3xl font-display font-black text-white">Mahesh Chandra Sharma</h4>
                                <p className="text-white/60 uppercase tracking-[0.2em] text-sm font-bold mt-2">Manager & Founder</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        <Quote className="w-16 h-16 text-[#C6A75E] opacity-20" />
                        <div className="space-y-6 text-xl text-[#0A1628]/80 font-light leading-relaxed">
                            <p className="font-bold italic text-[#0A1628]">
                                "All Birds find shelter during a rain. But Eagle avoids rain by flying above the Clouds."
                            </p>
                            <p>
                                As the founder of New Defence Public School, it gives me immense pleasure to welcome you to our institution.
                                Coming from a defence background, I have always believed in the principles of dedication, integrity, and service.
                                These values form the foundation of our school's ethos.
                            </p>
                            <p>
                                Our focus remains on excellence in academic, cultural, and sporting endeavors. We provide an inclusive
                                environment that fosters collaborative learning and ethical boundaries. We strive to create an
                                environment where every child can discover their potential and develop into responsible,
                                compassionate citizens.
                            </p>
                            <p>
                                I thank all parents for entrusting us with the education and development of their children.
                                Together, we will continue to uphold our motto of 'Truth and Service.'
                            </p>
                        </div>
                        <div className="pt-8 signature italic font-display text-2xl text-[#0A1628]">
                            Mahesh Chandra Sharma
                        </div>
                    </div>
                </div>
            </ContentSection>
        </main>
    );
}
