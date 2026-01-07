'use client';

import { motion } from 'framer-motion';
import { User, Lock, ArrowLeft, GraduationCap, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-6 pt-32 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFD700]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl rounded-[48px] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Branding Side */}
                <div className="hidden md:flex md:w-[45%] bg-[#FFD700] p-16 flex-col justify-between items-start relative overflow-hidden text-[#0A1628]">
                    <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                        <GraduationCap size={300} strokeWidth={0.5} />
                    </div>

                    <Link href="/" className="flex items-center gap-3 font-bold uppercase tracking-widest text-[#0A1628] group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </Link>

                    <div>
                        <h2 className="text-6xl font-display font-black leading-none tracking-tighter mb-8">ERP Portal</h2>
                        <p className="text-xl font-light opacity-80 max-w-xs uppercase tracking-wide">Secure access for staff, students, and parents.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0A1628] rounded-xl flex items-center justify-center text-[#FFD700]">
                            <Building2 />
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-[0.3em]">
                            New Defence<br />Public School
                        </div>
                    </div>
                </div>

                {/* Login Side */}
                <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
                    <div className="mb-12">
                        <h3 className="text-4xl font-display font-black text-white mb-4 tracking-tight">Welcome Back</h3>
                        <p className="text-white/40 font-light">Please log in to your account to continue.</p>
                    </div>

                    <form className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-1">User Identification</label>
                            <div className="relative">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Username or Email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-white focus:ring-2 focus:ring-[#FFD700] outline-none transition-all placeholder:text-white/10 font-light"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Secure Password</label>
                                <a href="#" className="text-[10px] uppercase font-bold tracking-widest text-[#FFD700] hover:text-white transition-colors">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-white focus:ring-2 focus:ring-[#FFD700] outline-none transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <button className="btn-gold w-full py-6 text-xl mt-4 flex items-center justify-center gap-3 text-white">
                            Log In Securely
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 justify-center">
                        <Link href="/contact" className="text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-[#FFD700] transition-colors">Support</Link>
                        <Link href="/rules/conduct" className="text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-[#FFD700] transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
