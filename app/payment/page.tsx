'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { CreditCard, ShieldCheck, Smartphone, Landmark, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnlinePaymentPage() {
    return (
        <SmoothScroll>
            <PageTransition>

                <SubPageHero
                    title="Online Payment"
                    subtitle="Fast, secure, and hassle-free fee payments."
                    breadcrumb="Parents Portal"
                    icon={<CreditCard className="w-8 h-8" />}
                />

                <ContentSection>
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Option 1: Online Payment */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#0A1628] rounded-[48px] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <Smartphone className="w-64 h-64" />
                            </div>

                            <div className="relative z-10">
                                <span className="inline-block px-4 py-2 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold tracking-widest uppercase mb-6 border border-[#FFD700]/20">
                                    Option 1
                                </span>
                                <h4 className="text-3xl md:text-4xl font-display font-black text-white mb-6 tracking-tight">
                                    Pay Online <span className="text-[#FFD700]">Instantly</span>
                                </h4>
                                <p className="text-lg text-white/70 font-light leading-relaxed mb-8">
                                    Use our secure Razorpay gateway to pay fees via Credit Card, Debit Card, Net Banking, or UPI.
                                </p>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-4 text-sm font-medium text-white/80">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FFD700]">
                                            <ShieldCheck size={18} />
                                        </div>
                                        100% Secure & Encrypted
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-medium text-white/80">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FFD700]">
                                            <Smartphone size={18} />
                                        </div>
                                        Instant Receipt Generation
                                    </div>
                                </div>

                                <a
                                    href={razorpayLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-1 mt-auto"
                                >
                                    Pay Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <p className="text-center text-xs text-white/30 mt-4">Powered by Razorpay</p>
                            </div>
                        </motion.div>

                        {/* Option 2: Bank Deposit */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[48px] p-10 md:p-14 shadow-xl border border-gray-100 flex flex-col h-full relative overflow-hidden"
                        >
                            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

                            <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-100 w-fit">
                                Option 2
                            </span>

                            <h4 className="text-3xl md:text-4xl font-display font-black text-[#0A1628] mb-6 tracking-tight">
                                Direct Bank <span className="text-blue-600">Deposit</span>
                            </h4>
                            <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                                You can transfer the fees directly to the school bank account via Net Banking or Cash Deposit.
                            </p>

                            <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200">
                                <div className="divide-y divide-gray-200">
                                    {[
                                        { label: "Bank Name", value: bankDetails.bankName },
                                        { label: "Account Name", value: bankDetails.accountName },
                                        { label: "Account Number", value: bankDetails.accountNumber, copy: true },
                                        { label: "IFSC Code", value: bankDetails.ifscCode, copy: true },
                                        { label: "Branch", value: bankDetails.branchName },
                                        { label: "Type", value: bankDetails.accountType },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-white transition-colors gap-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest w-32 shrink-0">{item.label}</span>
                                            <span className="text-[#0A1628] font-semibold text-right md:text-left flex-1 break-words font-mono text-sm md:text-base selection:bg-blue-100">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4 text-xs text-gray-400">
                                <Info size={16} className="shrink-0 mt-0.5" />
                                <p>Please mention the Student Name & Admission Number in the remarks/narration field while transferring.</p>
                            </div>
                        </motion.div>
                    </div>
                </ContentSection>

                <Footer />
            </PageTransition>
        </SmoothScroll>
    );
}

import { bankDetails, razorpayLink } from '@/data/cms';
