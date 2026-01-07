'use client';

import { useState } from 'react';
import PhoneCard from '@/components/PhoneCard';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const leaders = [
    {
        id: 'principal',
        name: 'Sanjay Sharma',
        title: 'Principal',
        image: '/images/leadership/principal.jpg',
        quote: 'Education is a shared commitment between dedicated teachers, motivated students and enthusiastic parents.',
        message: [
            'Welcome to our vibrant Learning Community! As we celebrate over 24 years of educational legacy, our commitment remains steadfast.',
            'At NDPS, we focus on holistic growth and creative thinking. We believe in preparing students for the challenges of the future.',
            'Our teachers are here not just to impart knowledge but to ignite curiosity and challenge students to think deeply.'
        ],
        accentColor: '#C6A75E',
        gradientFrom: '#C6A75E',
        gradientTo: '#B5964D'
    },
    {
        id: 'manager',
        name: 'Mahesh Chandra Sharma',
        title: 'Manager',
        image: '/images/leadership/manager.jpg',
        quote: 'All Birds find shelter during a rain. But Eagle avoids rain by flying above the Clouds.',
        message: [
            'As the founder of New Defence Public School, it gives me immense pleasure to welcome you to our institution.',
            'Our focus remains on excellence in academic, cultural, and sporting endeavors. We provide an inclusive environment.',
            'Together, we will continue to uphold our motto of \'Truth and Service.\''
        ],
        accentColor: '#C6A75E',
        gradientFrom: '#C6A75E',
        gradientTo: '#B5964D'
    },
    {
        id: 'director',
        name: 'Rajesh Kumar Sharma',
        title: 'Director',
        image: '/images/leadership/director.jpg',
        quote: 'School is more than just a place for academic excellence; it is about realizing the true potential of every student.',
        message: [
            'At New Defence Public School, we are committed to creating an environment where learning is joyful and meaningful.',
            'Beyond academics, we focus on character development, social responsibility, and leadership skills.',
            'Join our family and experience the difference that dedicated teaching and a nurturing environment can make.'
        ],
        accentColor: '#C6A75E',
        gradientFrom: '#C6A75E',
        gradientTo: '#B5964D'
    }
];

export default function MessagesPage() {
    const [activeId, setActiveId] = useState<string>('manager');

    return (
        <main className="bg-[#E5E9EF] min-h-screen">
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
                {/* Background Box */}
                <div className="absolute top-0 inset-x-0 h-[50vh] bg-[#0B1C2D] rounded-b-[4rem]" />

                {/* Header */}
                <div className="relative z-10 text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white mb-4"
                    >
                        <Sparkles size={14} className="text-[#C6A75E]" />
                        <span className="text-xs font-bold uppercase tracking-widest leading-none">Leadership Voices</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white">
                        Messages from the Desk
                    </h1>
                </div>

                {/* Phones Container */}
                <div className="relative z-10 w-full max-w-[1400px] px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 perspective-1000">
                        {leaders.map((leader, index) => (
                            <motion.div
                                key={leader.id}
                                layout
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                            >
                                <PhoneCard
                                    leader={leader}
                                    isActive={activeId === leader.id}
                                    onClick={() => setActiveId(leader.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <p className="fixed bottom-8 text-center w-full text-xs text-white/40 font-bold uppercase tracking-widest pointer-events-none">
                    Select a device to read full message
                </p>
            </section>
        </main>
    );
}
