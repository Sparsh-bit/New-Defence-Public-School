'use client';

import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import { Users, ShieldCheck, Mail, Phone, Clock } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

const managementTeam = [
    {
        name: "Mahesh Chandra Sharma",
        role: "Manager",
        qual: "Ex-Defence Officer",
        image: "/images/leadership/manager.jpg",
        link: "/messages/manager"
    },
    {
        name: "Rajesh Kumar Sharma",
        role: "Director",
        qual: "M.A., B.Ed.",
        image: "/images/leadership/director.jpg",
        link: "/messages/director"
    },
    {
        name: "Sanjay Sharma",
        role: "Principal",
        qual: "M.Sc., B.Ed.",
        image: "/images/leadership/principal.jpg",
        link: "/messages/principal"
    }
];

export default function ManagementPage() {
    return (
        <main>
            <SubPageHero
                title="School Management"
                subtitle="A dedicated group of visionaries committed to academic excellence."
                breadcrumb="ABOUT NDPS"
                icon={<Users className="w-8 h-8" />}
            />

            <ContentSection
                title="The Hands That Lead"
                subtitle="OUR LEADERSHIP"
            >
                <div className="grid md:grid-cols-3 gap-12">
                    {managementTeam.map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden mb-8 border-4 border-[#C6A75E]/10">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D] via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-10 left-10">
                                    <h3 className="text-2xl font-display font-bold leading-tight text-white">{member.name}</h3>
                                    <p className="text-[#C6A75E] text-xs font-black uppercase tracking-widest mt-2">{member.role}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-500 text-sm font-medium tracking-wide uppercase px-4">{member.qual}</p>
                                <Link
                                    href={member.link}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1C2D] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all rounded-full"
                                >
                                    Read Message
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </ContentSection>

            <ContentSection alternate title="Administrative Office" subtitle="OFFICE HOURS">
                <div className="grid md:grid-cols-2 gap-20">
                    <div className="space-y-8">
                        <div className="flex gap-6 p-10 bg-white rounded-[40px] shadow-sm border border-[#C6A75E]/10">
                            <div className="w-16 h-16 bg-[#0B1C2D] rounded-2xl flex items-center justify-center text-[#C6A75E]">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-display font-medium text-[#0B1C2D] mb-2">Visiting Hours</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Management is available for parents on all working days between <br />
                                    <strong className="text-[#0B1C2D]">09:00 AM to 11:30 AM</strong>.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6 p-10 bg-white rounded-[40px] shadow-sm border border-[#C6A75E]/10">
                            <div className="w-16 h-16 bg-[#C6A75E] rounded-2xl flex items-center justify-center text-[#0B1C2D]">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-display font-medium text-[#0B1C2D] mb-2">Policy Matters</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    For admissions, fee structure, and official board correspondence, please contact the administrative block during office hours.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0B1C2D] p-12 md:p-16 rounded-[48px] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                        <h3 className="text-3xl font-display font-bold mb-8">Contact Administration</h3>
                        <ul className="space-y-8">
                            <li className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Phone size={20} className="text-[#C6A75E]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Office Line</p>
                                    <p className="font-bold">+91 9412362584, +91 9412158024</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Mail size={20} className="text-[#C6A75E]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Email</p>
                                    <p className="font-bold">newdefence@yahoo.co.in</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </ContentSection>
        </main>
    );
}
