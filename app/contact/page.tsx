'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { Mail, Phone, MapPin, Send, Globe, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <SmoothScroll>
            <PageTransition>
                <Navbar />
                <SubPageHero
                    title="Get In Touch"
                    subtitle="We are here to answer your questions and welcome you to our campus."
                    breadcrumb="Contact & Support"
                    icon={<Mail className="w-8 h-8" />}
                    backgroundImage="/images/gen/school_reception_india_1766952527898.png"
                />

                <ContentSection>
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-8">
                            {[
                                {
                                    icon: <Phone />,
                                    title: "Phone",
                                    info: "+91 9412362584",
                                    sub: "+91 9412362584 | +91 9412158024",
                                    href: "tel:+919412362584"
                                },
                                {
                                    icon: <Mail />,
                                    title: "Email",
                                    info: "newdefence@yahoo.co.in",
                                    sub: "Official Inquiries & Admissions",
                                    href: "mailto:newdefence@yahoo.co.in"
                                },
                                {
                                    icon: <MapPin />,
                                    title: "Campus",
                                    info: "103-104, Raghuvirpuram",
                                    sub: "Shahganj, Agra - 282010"
                                }
                            ].map((item, idx) => (
                                <motion.a
                                    key={idx}
                                    href={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="block p-10 bg-white rounded-[40px] border border-[#0A1628]/5 shadow-premium hover:border-[#FFD700] transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-[#0A1628] rounded-xl flex items-center justify-center text-[#FFD700] mb-6 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0A1628]/40 mb-2">{item.title}</h5>
                                    <p className="text-xl font-display font-black !text-[#0A1628] break-words">{item.info}</p>
                                    <p className="text-sm !text-[#0A1628]/70 mt-2">{item.sub}</p>
                                </motion.a>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#0A1628] p-12 md:p-16 rounded-[64px] text-white relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-20 opacity-10">
                                    <Globe className="w-64 h-64" />
                                </div>

                                <h4 className="text-4xl font-display font-black text-white mb-4 tracking-tight">
                                    <span className="bg-[#C6A75E] px-2 leading-relaxed decoration-clone box-decoration-clone">Send a Message</span>
                                </h4>
                                <p className="text-white/60 font-light mb-12 max-w-md">Our team will get back to you within 24 business hours.</p>

                                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formState.name}
                                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#FFD700] transition-all outline-none"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formState.email}
                                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#FFD700] transition-all outline-none"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">How can we help?</label>
                                        <textarea
                                            rows={4}
                                            required
                                            value={formState.message}
                                            onChange={e => setFormState({ ...formState, message: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#FFD700] transition-all outline-none resize-none"
                                            placeholder="Tell us about your inquiry..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="btn-gold py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {status === 'submitting' ? <Loader2 className="animate-spin" /> :
                                            status === 'success' ? <span className="flex items-center gap-2"><CheckCircle /> Sent!</span> :
                                                <>Send Message <Send className="w-5 h-5" /></>}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </ContentSection>

                {/* Map Integration */}
                <section className="relative h-[500px] w-full bg-gray-100">
                    <iframe
                        title="New Defence Public School Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.385312386805!2d77.96853547535498!3d27.1883838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397477a0d78606ef%3A0x6502d739bd0a84d4!2sNew%20Defense%20Public%20school!5e0!3m2!1sen!2sin!4v1735559773000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute bottom-4 right-4 z-10">
                        <a
                            href="https://www.google.com/maps/place/New+Defense+Public+school/@27.1883838,77.9685355,17z/data=!3m1!4b1!4m6!3m5!1s0x397477a0d78606ef:0x6502d739bd0a84d4!8m2!3d27.1883838!4d77.9711104!16s%2Fg%2F11h0ghp_g4"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-[#0A1628] text-white rounded-xl font-semibold hover:bg-[#FFD700] hover:text-[#0A1628] transition-all shadow-lg"
                        >
                            Open in Google Maps
                        </a>
                    </div>
                </section>
            </PageTransition>
        </SmoothScroll>
    );
}
