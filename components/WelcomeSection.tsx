'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, Building2, Trophy, BookOpen, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
    {
        icon: GraduationCap,
        title: 'Academic Excellence',
        description: 'NCERT & UP Board curriculum with modern teaching methods and proven results',
    },
    {
        icon: Users,
        title: 'Experienced Faculty',
        description: '25+ dedicated teachers committed to student success and holistic development',
    },
    {
        icon: Building2,
        title: 'Modern Infrastructure',
        description: 'Smart classrooms, well-equipped labs, library, and world-class sports facilities',
    },
    {
        icon: Trophy,
        title: 'Proven Track Record',
        description: '90%+ pass rate with numerous board toppers and state-level achievers',
    },
];

export default function WelcomeSection() {
    return (
        <section className="py-24 bg-white">
            <div className="container-premium">
                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/10 border border-[#FFD700]/30 mb-6"
                        >
                            <BookOpen className="w-5 h-5 text-[#FFD700]" />
                            <span className="text-[#D4AF37] font-bold text-sm">WELCOME TO NDPS</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#0A1628] mb-6 leading-tight">
                            New Defence <span className="text-[#FFD700]">Public School</span>
                        </h2>

                        <p className="text-lg text-[#0A1628] mb-6 leading-relaxed font-medium">
                            Established in <strong className="text-[#FFD700]">1996</strong> by Ex-Defence Officer{' '}
                            <strong className="text-[#0A1628]">Shri Mahesh Chandra Sharma</strong>, New Defence Public School
                            has been a beacon of quality education in Agra for over <strong className="text-[#FFD700]">28 years</strong>.
                            Our guiding principle is <strong className="text-[#0A1628]">"For Truth and Service"</strong>.
                        </p>

                        <p className="text-lg text-[#0A1628]/80 mb-6 leading-relaxed">
                            Our co-educational, English medium institution is recognized by the{' '}
                            <strong className="text-[#0A1628]">Uttar Pradesh Secondary Education Board (UP Board)</strong> and
                            focuses on <strong className="text-[#FFD700]">holistic development</strong>.
                        </p>

                        <p className="text-lg text-[#0A1628]/80 mb-8 leading-relaxed">
                            We are committed to providing education that combines{' '}
                            <strong className="text-[#0A1628]">academic excellence</strong> with{' '}
                            <strong className="text-[#FFD700]">character building</strong>,{' '}
                            <strong className="text-[#0A1628]">physical fitness</strong>, and{' '}
                            <strong className="text-[#FFD700]">moral values</strong>.
                        </p>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/about/school"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFA500] text-[#0A1628] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                <Award className="w-6 h-6" />
                                Learn More About Us
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Image with Overlay Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/aerial_view.png"
                                alt="New Defence Public School Campus"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-[#0A1628]/20 to-transparent" />

                            {/* Floating Stats Cards */}
                            <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl"
                                >
                                    <div className="text-4xl font-black text-[#FFD700] mb-1">750+</div>
                                    <div className="text-sm font-bold text-[#0A1628]">Students</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl"
                                >
                                    <div className="text-4xl font-black text-[#1A3969] mb-1">90%+</div>
                                    <div className="text-sm font-bold text-[#0A1628]">Pass Rate</div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                            <div className="relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#FFD700]/50 hover:shadow-2xl transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0A1628] mb-3">{feature.title}</h3>
                                <p className="text-[#0A1628]/70 leading-relaxed">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
