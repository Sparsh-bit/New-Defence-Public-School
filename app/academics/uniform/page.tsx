'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { Shirt, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UniformPage() {
    return (
        <main>
            <SubPageHero
                title="School Uniform"
                subtitle="Dressing for success and equality."
                breadcrumb="Academics"
                icon={<Shirt className="w-8 h-8" />}
            />

            <section className="py-24">
                <div className="container-premium">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Summer Uniform */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white p-12 rounded-[48px] shadow-sm border border-blue-50"
                        >
                            <h4 className="text-3xl font-display font-black text-[#0A1628] mb-8 border-l-8 border-[#C6A75E] pl-6">Summer Schedule</h4>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Boys</p>
                                    <ul className="space-y-3 text-lg text-gray-600 font-light">
                                        <li className="flex gap-4 items-center font-medium text-[#0A1628]">Sky Blue half sleeved shirt</li>
                                        <li>Navy Blue shorts (Primary) / trousers (Senior)</li>
                                        <li>School Belt and Navy Blue socks</li>
                                        <li>Black leather shoes</li>
                                    </ul>
                                </div>
                                <div className="pt-8 border-t border-gray-100">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Girls</p>
                                    <ul className="space-y-3 text-lg text-gray-600 font-light">
                                        <li className="flex gap-4 items-center font-medium text-[#0A1628]">Sky Blue shirt / tunic</li>
                                        <li>Navy Blue skirt</li>
                                        <li>School Belt and Navy Blue socks</li>
                                        <li>Black shoes and white hair bands</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* Winter Uniform */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#0A1628] p-12 rounded-[48px] text-white shadow-xl"
                        >
                            <h4 className="text-3xl font-display font-black text-[#C6A75E] mb-8 border-l-8 border-white pl-6">Winter Schedule</h4>
                            <div className="space-y-8 text-white/70">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4 uppercase">All Students</p>
                                    <ul className="space-y-3 text-lg font-light">
                                        <li className="flex gap-4 items-center font-medium text-white">Full sleeved Sky Blue shirt</li>
                                        <li>Navy Blue Blazers with School Crest</li>
                                        <li>Navy Blue Pullovers ('V' Neck)</li>
                                        <li>Woolen Navy Blue socks</li>
                                        <li>School Tie</li>
                                    </ul>
                                </div>
                                <div className="pt-12">
                                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex items-start gap-6">
                                        <Info className="text-[#C6A75E] flex-shrink-0" />
                                        <p className="text-sm font-light leading-relaxed">
                                            The school uniform is a symbol of belonging. Students must be in neat and clean uniform daily.
                                            Action will be taken against those who do not comply.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
