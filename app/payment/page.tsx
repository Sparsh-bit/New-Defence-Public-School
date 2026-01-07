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
                <Navbar />

                <SubPageHero
                    title="Online Payment"
                    subtitle="Fast, secure, and hassle-free fee payments."
                    breadcrumb="Parents Portal"
                    icon={<CreditCard className="w-8 h-8" />}
                />

                <ContentSection>
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-[#0A1628] rounded-[64px] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <Smartphone className="w-48 h-48" />
                                </div>
                                <h4 className="text-4xl font-display font-black text-[#FFD700] mb-8 tracking-tight relative z-10">Secure Gateway</h4>
                                <p className="text-xl text-white/70 font-light leading-relaxed mb-12 relative z-10">
                                    Pay school fees, transport charges, and other dues using our industry-standard encrypted payment gateway.
                                </p>

                                <div className="space-y-6 relative z-10">
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center gap-6">
                                        <Smartphone className="text-[#FFD700]" />
                                        <p className="text-sm font-bold tracking-widest uppercase">UPI / Mobile Wallets</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center gap-6">
                                        <CreditCard className="text-[#FFD700]" />
                                        <p className="text-sm font-bold tracking-widest uppercase">Net Banking & Cards</p>
                                    </div>
                                </div>

                                <button className="btn-gold w-full mt-12 py-6 text-xl flex items-center justify-center gap-4 group">
                                    Proceed to Payment <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </motion.div>
                        </div>

                        <div className="space-y-12">
                            <div className="flex gap-8 group">
                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                    <ShieldCheck size={40} />
                                </div>
                                <div>
                                    <h5 className="text-2xl font-display font-black text-[#0A1628] mb-2">100% Encrypted</h5>
                                    <p className="text-gray-500 font-light">Your transaction details are protected by SSL encryption.</p>
                                </div>
                            </div>

                            <div className="flex gap-8 group">
                                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                                    <Info size={40} />
                                </div>
                                <div>
                                    <h5 className="text-2xl font-display font-black text-[#0A1628] mb-2">Payment Receipts</h5>
                                    <p className="text-gray-500 font-light">E-receipts are generated instantly and sent to your registered email.</p>
                                </div>
                            </div>

                            <div className="p-12 bg-gray-50 rounded-[48px] border border-[#0A1628]/5">
                                <h6 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#0A1628]/40 mb-6">Payment Support</h6>
                                <p className="text-2xl font-display font-light text-[#0A1628] leading-relaxed mb-6">
                                    Facing issues with your payment? Our finance team is available to assist you.
                                </p>
                                <a href="mailto:finance@newdefencepublicschool.com" className="text-[#0A1628] font-black underline underline-offset-8 decoration-[#FFD700] hover:text-[#FFD700] transition-colors">finance@ndpsagra.com</a>
                            </div>
                        </div>
                    </div>
                </ContentSection>

                <Footer />
            </PageTransition>
        </SmoothScroll>
    );
}
