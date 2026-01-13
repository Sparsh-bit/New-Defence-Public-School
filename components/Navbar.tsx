'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react';
import Image from 'next/image';

const navigation = [
    {
        name: 'About Us', href: '/about', submenu: [
            { name: 'Our Vision', href: '/about/vision' },
            { name: 'Infrastructure', href: '/about/infrastructure' },
            { name: 'Management', href: '/about/management' },
        ]
    },
    {
        name: 'Academics', href: '/academics/examination', submenu: [
            { name: 'Curriculum', href: '/about/curriculum' },
            { name: 'Assessment', href: '/academics/examination' },
            { name: 'Rules', href: '/rules/conduct' },
        ]
    },
    { name: 'Admissions', href: '/admissions/apply' },
    {
        name: 'Gallery', href: '/gallery/photos', submenu: [
            { name: 'Infrastructure', href: '/gallery/infrastructure' },
            { name: 'Events & Life', href: '/gallery/events' },
            { name: 'Video Tours', href: '/gallery/videos' },
        ]
    },
    { name: 'Pay Fees', href: '/payment' },
    { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide Navbar on Admin Portal
    if (pathname && (pathname.startsWith('/admissions/admin') || pathname.startsWith('/admin'))) {
        return null;
    }

    return (
        <header
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-[#0B1C2D] shadow-xl py-4' : 'bg-transparent py-8'}`}
        >
            <div className="container-premium flex items-center justify-between">

                {/* Official Branding */}
                <Link href="/" className="flex items-center gap-4 group mr-16">
                    <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
                        <Image
                            src="/images/logo_official.png"
                            alt="NDPS Logo"
                            fill
                            sizes="(max-width: 768px) 48px, 48px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col md:hidden lg:flex">
                        <span className="text-lg md:text-xl font-display font-bold text-white tracking-wide whitespace-nowrap">NEW DEFENCE PUBLIC SCHOOL</span>
                        <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#C6A75E]">Excellence Since 1996</span>
                    </div>
                    <div className="flex flex-col md:flex lg:hidden">
                        <span className="text-lg font-display font-bold text-white tracking-wide">NDPS</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navigation.map((item) => (
                        <div
                            key={item.name}
                            className="relative group pt-2 pb-2"
                            onMouseEnter={() => setActiveSubmenu(item.name)}
                            onMouseLeave={() => setActiveSubmenu(null)}
                        >
                            <Link
                                href={item.href}
                                className="text-white/80 hover:text-[#C6A75E] transition-colors text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 whitespace-nowrap"
                            >
                                {item.name}
                                {item.submenu && <ChevronDown size={14} className="opacity-50" />}
                            </Link>

                            <AnimatePresence>
                                {item.submenu && activeSubmenu === item.name && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 w-48 bg-[#1E2933] border border-white/10 rounded-xl overflow-hidden shadow-2xl mt-4"
                                    >
                                        {item.submenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                href={sub.href}
                                                className="block px-6 py-4 text-[11px] font-bold text-white/70 hover:text-white hover:bg-[#C6A75E]/20 transition-all uppercase tracking-widest border-b border-white/5 last:border-0"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <Link
                        href="/admissions/apply"
                        className="px-8 py-3 bg-[#C6A75E] text-[#0B1C2D] font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap"
                    >
                        Apply Now
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden text-white"
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed inset-0 bg-[#0B1C2D] z-[-1] flex flex-col pt-32 p-10 lg:hidden"
                    >
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-display font-medium text-white mb-8 border-b border-white/5 pb-4"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/admissions/apply"
                            onClick={() => setMobileMenuOpen(false)}
                            className="mt-10 py-6 bg-[#C6A75E] text-[#0B1C2D] text-center font-bold uppercase tracking-widest"
                        >
                            Start Admission
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
