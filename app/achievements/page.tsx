'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { Trophy, Star, Award, Medal, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const achievements = [
    {
        year: "2023",
        title: "Cleanest Campus Award",
        desc: "Recognized by the Municipal Corporation for maintaining an eco-friendly and hygienic campus environment.",
        icon: <Trophy />
    },
    {
        year: "2022",
        title: "State Level Sports",
        desc: "Our students secured 5 Gold Medals in the State Level Athletics Championship held in Lucknow.",
        icon: <Medal />
    },
    {
        year: "2021",
        title: "Academic Excellence",
        desc: "100% result in Board Examinations with over 40% of students scoring above 90%.",
        icon: <Award />
    }
];

export default function AchievementsPage() {
    return (
        <main>
            <SubPageHero
                title="Our Achievements"
                subtitle="Celebrating milestones and excellence in every field."
                breadcrumb="Success Stories"
                icon={<Trophy className="w-8 h-8" />}
                backgroundImage="/images/gen/school_achievements_trophies_1766952542058.png"
            />

            <section className="py-24">
                <div className="container-premium">
                    <div className="relative space-y-20">
                        {/* Timeline Connector */}
                        <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#C6A75E] via-[#0A1628]/10 to-transparent hidden md:block" />

                        {achievements.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-[#C6A75E] flex items-center justify-center text-[#0A1628] z-10 hidden md:flex shadow-xl">
                                    {item.icon}
                                </div>

                                <div className="w-full md:w-1/2 p-12 bg-white rounded-[40px] border border-[#0A1628]/5 shadow-sm hover:shadow-[#C6A75E]/10 transition-all duration-500">
                                    <span className="text-[#C6A75E] text-sm font-bold tracking-[0.4em] uppercase mb-4 block">{item.year}</span>
                                    <h4 className="text-3xl font-display font-black text-[#0A1628] mb-6 tracking-tight">{item.title}</h4>
                                    <p className="text-xl text-gray-600 font-light leading-relaxed">{item.desc}</p>
                                </div>

                                <div className="w-full md:w-1/2" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <ContentSection alternate title="Board Toppers" subtitle="ACADEMIC PRIDE">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Priya Singh", score: "98.2%", class: "XII Science", year: "2023" },
                        { name: "Rahul Yadav", score: "97.8%", class: "XII Commerce", year: "2023" },
                        { name: "Ananya Goyal", score: "99.0%", class: "X General", year: "2023" }
                    ].map((topper, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[40px] shadow-sm text-center border-t-4 border-[#C6A75E]">
                            <div className="w-20 h-20 bg-[#0A1628] rounded-full flex items-center justify-center text-[#C6A75E] mx-auto mb-8">
                                <GraduationCap size={40} />
                            </div>
                            <h5 className="text-2xl font-display font-black text-[#0A1628] mb-2">{topper.name}</h5>
                            <p className="text-[#C6A75E] text-4xl font-black mb-4">{topper.score}</p>
                            <div className="flex justify-between items-center pt-6 border-t border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <span>{topper.class}</span>
                                <span>{topper.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentSection>
        </main>
    );
}
