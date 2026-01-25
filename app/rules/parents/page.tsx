'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import ContentSection from '@/components/ContentSection';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import { HeartHandshake, Users, MessageCircle, Star, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const recommendations = [
    {
        title: "Daily Monitoring",
        desc: "Parents are requested to check the student's diary daily and ensure that homework is completed.",
        icon: <Target />
    },
    {
        title: "Communication",
        desc: "Please respond promptly to teachers' remarks and attend all Parent-Teacher Meetings.",
        icon: <MessageCircle />
    },
    {
        title: "Environment",
        desc: "Provide a quiet and conducive environment at home for study and self-reflection.",
        icon: <Star />
    },
    {
        title: "Punctuality",
        desc: "Ensure your child reaches the school on time and is collected promptly after school hours.",
        icon: <Users />
    }
];

export default function ParentsRecommendationPage() {
    return (
        <main>
            <SubPageHero
                title="For Parents"
                subtitle="Collaborating to build a successful future for your child."
                breadcrumb="Recommendations"
                icon={<HeartHandshake className="w-8 h-8" />}
            />

            <section className="py-24">
                <div className="container-premium">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C6A75E] mb-4 block">PARENTAL GUIDELINES</span>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-[#0A1628]">A Partnership for Growth</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {recommendations.map((rec, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-10 bg-[#0A1628]/5 rounded-[40px] border border-[#0A1628]/10 hover:bg-[#0A1628] hover:text-white transition-all duration-500"
                            >
                                <div className="text-[#C6A75E] mb-8 group-hover:scale-110 transition-transform">{rec.icon}</div>
                                <h4 className="text-2xl font-display font-black mb-4 tracking-tight">{rec.title}</h4>
                                <p className="text-lg opacity-70 font-light leading-relaxed">{rec.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <ContentSection alternate title="Parent-Teacher Interaction" subtitle="JOIN THE CONVERSATION">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <p className="text-2xl font-display font-light text-[#0A1628] leading-relaxed">
                        "Parents are the first teachers and teachers are the second parents."
                        We believe in an open-door policy where constructive feedback leads to student success.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="px-8 py-4 bg-white rounded-full shadow-sm text-sm font-bold uppercase tracking-widest text-[#0A1628]">Every 2nd Saturday: PTM</div>
                        <div className="px-8 py-4 bg-white rounded-full shadow-sm text-sm font-bold uppercase tracking-widest text-[#0A1628]">Time: 9:00 AM - 12:00 PM</div>
                    </div>
                </div>
            </ContentSection>
        </main>
    );
}
