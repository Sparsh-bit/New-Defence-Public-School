'use client';

import { motion } from 'framer-motion';
import { Microscope, Library, Monitor, Dumbbell, Bus, Shield } from 'lucide-react';
import Image from 'next/image';

const facilities = [
    { icon: Monitor, title: 'Smart Classes', description: '4K projectors for interactive learning' },
    { icon: Microscope, title: 'Modern Labs', description: 'Physics, Chemistry, Biology & Maths labs' },
    { icon: Library, title: 'Well-Stocked Library', description: 'Vast collection across all genres' },
    { icon: Dumbbell, title: 'Sports Facilities', description: 'Football, Basketball, Cricket & more' },
    { icon: Bus, title: 'Safe Transportation', description: 'Fleet of buses servicing all major areas of Agra' },
    { icon: Shield, title: 'Secure Campus', description: '24/7 CCTV surveillance and disciplined environment' },
];

export default function FacilitiesSection() {
    return (
        <section className="py-24 bg-white">
            <div className="container-premium">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#0A1628] mb-4 text-balance">
                        World-Class <span className="text-[#FFD700]">Facilities</span>
                    </h2>
                    <p className="text-xl text-[#0A1628]/70 max-w-3xl mx-auto font-light">
                        State-of-the-art infrastructure designed to provide the best learning environment
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {facilities.map((facility, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#FFD700]/50 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mb-6">
                                <facility.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0A1628] mb-3">{facility.title}</h3>
                            <p className="text-[#0A1628]/70 font-light">{facility.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Image Gallery Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-64 rounded-3xl overflow-hidden shadow-xl group"
                    >
                        <Image src="/images/classroom.png" alt="Smart Classroom" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 to-transparent flex items-end p-6">
                            <span className="!text-white font-bold text-xl" style={{ color: '#FFFFFF' }}>Smart Classroom</span>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative h-64 rounded-3xl overflow-hidden shadow-xl group"
                    >
                        <Image src="/images/lab.png" alt="Science Laboratory" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 to-transparent flex items-end p-6">
                            <span className="!text-white font-bold text-xl" style={{ color: '#FFFFFF' }}>Science Lab</span>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative h-64 rounded-3xl overflow-hidden shadow-xl group"
                    >
                        <Image src="/images/library.png" alt="Library" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 to-transparent flex items-end p-6">
                            <span className="!text-white font-bold text-xl" style={{ color: '#FFFFFF' }}>Library</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
