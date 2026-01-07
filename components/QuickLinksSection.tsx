'use client';

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Building2, Image as ImageIcon, Trophy, CreditCard, FileText, Users } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
    {
        icon: GraduationCap,
        title: 'Admissions',
        description: 'Apply for admission online. Learn about our admission process and requirements.',
        href: '/admissions/apply',
        gradient: 'from-[#FFD700] to-[#FFA500]',
    },
    {
        icon: BookOpen,
        title: 'Curriculum',
        description: 'Explore our comprehensive curriculum designed for holistic development.',
        href: '/about/curriculum',
        gradient: 'from-[#1A3969] to-[#3B82F6]',
    },
    {
        icon: Building2,
        title: 'Infrastructure',
        description: 'State-of-the-art facilities including smart classrooms, labs, and sports grounds.',
        href: '/about/infrastructure',
        gradient: 'from-[#10B981] to-[#34D399]',
    },
    {
        icon: ImageIcon,
        title: 'Gallery',
        description: 'View our photo and video gallery showcasing school events and activities.',
        href: '/gallery/photos',
        gradient: 'from-[#A855F7] to-[#C084FC]',
    },
    {
        icon: Trophy,
        title: 'Achievements',
        description: 'Celebrate the accomplishments of our students in academics and sports.',
        href: '/achievements',
        gradient: 'from-[#FF8C00] to-[#FFA500]',
    },
    {
        icon: CreditCard,
        title: 'Online Payment',
        description: 'Pay your school fees securely online with quick and easy payment options.',
        href: '/payment',
        gradient: 'from-[#D4AF37] to-[#FFD700]',
    },
    {
        icon: FileText,
        title: 'Examination',
        description: 'Learn about our examination system, promotion criteria, and grading system.',
        href: '/academics/examination',
        gradient: 'from-[#0A1628] to-[#1A3969]',
    },
    {
        icon: Users,
        title: 'Messages',
        description: 'Read messages from our Manager, Director, and Principal.',
        href: '/messages/manager',
        gradient: 'from-[#FF8C00] to-[#D4AF37]',
    },
];

export default function QuickLinksSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container-premium">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/10 border border-[#FFD700]/30 mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                        <span className="text-[#D4AF37] font-bold text-sm">EXPLORE</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#0A1628] mb-4">
                        Quick <span className="text-[#FFD700]">Access</span>
                    </h2>
                    <p className="text-xl text-[#0A1628]/70 max-w-3xl mx-auto font-light">
                        Everything you need to know about New Defence Public School at your fingertips
                    </p>
                </motion.div>

                {/* Quick Links Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {quickLinks.map((link, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -10 }}
                        >
                            <Link href={link.href} className="block group">
                                <div className="relative h-full">
                                    {/* Glow Effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-2xl transition-all duration-500`} />

                                    {/* Card */}
                                    <div className="relative h-full bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                        {/* Top Border Animation */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${link.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

                                        {/* Icon */}
                                        <div className={`w-16 h-16 bg-gradient-to-br ${link.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                                            <link.icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-2xl font-bold text-[#0A1628] mb-3 group-hover:text-[#1A3969] transition-colors">
                                            {link.title}
                                        </h3>
                                        <p className="text-[#0A1628]/70 leading-relaxed mb-4 text-sm font-light">
                                            {link.description}
                                        </p>

                                        {/* Arrow */}
                                        <div className="flex items-center gap-2 text-[#FFD700] font-bold group-hover:gap-4 transition-all duration-300">
                                            <span>Learn More</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
