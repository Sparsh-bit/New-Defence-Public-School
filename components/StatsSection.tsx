'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, BookOpen, Globe, Sparkles } from 'lucide-react';

const stats = [
    { icon: TrendingUp, value: '28+', label: 'Years of Excellence', suffix: '', color: 'from-[#FFD700] to-[#FFA500]' },
    { icon: Users, value: '750', label: 'Happy Students', suffix: '+', color: 'from-[#1A3969] to-[#3B82F6]' },
    { icon: Award, value: '90', label: 'Success Rate', suffix: '%+', color: 'from-[#10B981] to-[#34D399]' },
    { icon: BookOpen, value: '25', label: 'Expert Faculty', suffix: '+', color: 'from-[#A855F7] to-[#C084FC]' },
    { icon: Globe, value: '15', label: 'Co-curricular Clubs', suffix: '+', color: 'from-[#FF8C00] to-[#FFA500]' },
    { icon: Sparkles, value: '100', label: 'Board Toppers', suffix: '+', color: 'from-[#D4AF37] to-[#FFD700]' },
];

export default function StatsSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-[#0A1628] via-[#1A3969] to-[#0A1628] relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,215,0,0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }} />
            </div>

            <div className="container-premium relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-4">
                        Our <span className="text-[#FFD700]">Impact</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Numbers that reflect our commitment to educational excellence and student success
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-20 rounded-3xl blur-2xl group-hover:opacity-40 transition-all duration-500`} />
                            <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 text-center hover:border-[#FFD700]/50 transition-all duration-300">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-xl`}
                                >
                                    <stat.icon className="w-10 h-10 text-white" />
                                </motion.div>
                                <div>
                                    <motion.div
                                        initial={{ scale: 1 }}
                                        whileInView={{ scale: [1, 1.2, 1] }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        className="text-6xl font-black text-white mb-2 font-display"
                                    >
                                        {stat.value}{stat.suffix}
                                    </motion.div>
                                    <div className="text-lg text-gray-300 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
