'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function OfficialContactSection() {
    return (
        <section className="py-[120px] bg-white">
            <div className="container-premium">
                <div className="grid lg:grid-cols-2 gap-20">

                    {/* Contact Information */}
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-display font-medium text-[#0B1C2D] mb-12">Visit Our Campus</h2>

                            <div className="space-y-12">
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-[#F7F9FC] rounded-xl flex items-center justify-center shrink-0 text-[#C6A75E]">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Location</span>
                                        <p className="text-xl font-semibold text-[#1E2933]">
                                            103–104 Raghuvirpuram, <br /> Shahganj, Agra, UP 282010
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-[#F7F9FC] rounded-xl flex items-center justify-center shrink-0 text-[#C6A75E]">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Phones</span>
                                        <p className="text-xl font-semibold text-[#1E2933]">
                                            +91 9412362584, +91 9412158024
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-[#F7F9FC] rounded-xl flex items-center justify-center shrink-0 text-[#C6A75E]">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Official Mailing List</span>
                                        <p className="text-xl font-semibold text-[#1E2933]">
                                            newdefence@yahoo.co.in
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-[#F7F9FC] rounded-xl flex items-center justify-center shrink-0 text-[#C6A75E]">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Visiting Hours</span>
                                        <p className="text-xl font-semibold text-[#1E2933]">
                                            Monday - Saturday: 08:00 AM - 02:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Google Map Embedded */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative w-full h-[500px] lg:h-auto rounded-[3rem] overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border border-slate-200"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.385312386805!2d77.96853547535498!3d27.1883838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397477a0d78606ef%3A0x6502d739bd0a84d4!2sNew%20Defense%20Public%20school!5e0!3m2!1sen!2sin!4v1735559773000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
