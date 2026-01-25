'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { CreditCard, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeesPage() {
    return (
        <main>
            <SubPageHero
                title="Fees Structure"
                subtitle="Transparent and competitive fee policy."
                breadcrumb="Admissions"
                icon={<CreditCard className="w-8 h-8" />}
            />

            <section className="py-24">
                <div className="container-premium">
                    <div className="grid lg:grid-cols-3 gap-8 mb-20">
                        {[
                            { title: "Monthly Fees", amount: "Varies by Class", desc: "Covers tuition and academic resources.", icon: <Wallet /> },
                            { title: "Annual Charges", amount: "Payable in April", desc: "Includes lab, library, and development fees.", icon: <Calendar /> },
                            { title: "Transport Fees", amount: "Distance Based", desc: "Calculated based on pick-up location.", icon: <AlertCircle /> }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 bg-white rounded-[48px] shadow-sm border border-[#0A1628]/5 text-center flex flex-col items-center"
                            >
                                <div className="w-16 h-16 bg-[#0A1628]/5 rounded-2xl flex items-center justify-center text-[#0A1628] mb-8">{item.icon}</div>
                                <h4 className="text-2xl font-display font-black text-[#0A1628] mb-2 uppercase tracking-tight">{item.title}</h4>
                                <p className="text-[#C6A75E] text-lg font-bold mb-4">{item.amount}</p>
                                <p className="text-gray-500 font-light text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-[#0A1628] rounded-[64px] p-12 md:p-20 text-white grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h4 className="text-4xl font-display font-black text-[#C6A75E] tracking-tight">Payment Schedule & Rules</h4>
                            <div className="space-y-6 text-white/70 font-light leading-relaxed">
                                <p>1. Fees are payable by the 10th of every month. A late fee will be charged after the due date.</p>
                                <p>2. Fees once paid are non-refundable under any circumstances.</p>
                                <p>3. One month's notice or one month's fee in lieu of notice is required for withdrawal of transport facility.</p>
                            </div>
                            <Link href="/payment" className="btn-gold inline-flex px-12 py-5 text-lg">Pay Online Now</Link>
                        </div>
                        <div className="aspect-square bg-white/5 rounded-[48px] border border-white/10 flex items-center justify-center p-12">
                            <div className="text-center">
                                <CreditCard size={100} className="mx-auto text-[#C6A75E] opacity-20 mb-8" />
                                <p className="text-2xl font-display font-bold text-white mb-4">Digital Payments Preferred</p>
                                <p className="text-white/40 font-light">Supporting UPI, Credit/Debit Cards, and Net Banking for your convenience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
