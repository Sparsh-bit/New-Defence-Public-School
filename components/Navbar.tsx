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
            { name: 'Annual Results', href: '/result' },
            { name: 'Downloads', href: '/downloads' },
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

    // Hide Navbar on Admin Portal & Login
    if (pathname && (pathname.startsWith('/admissions/admin') || pathname.startsWith('/admin') || pathname === '/admissions/portal')) {
        return null;
    }

    return (
        <header
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-[#0B1C2D] shadow-xl py-3 md:py-4' : 'bg-[#0B1C2D]/90 backdrop-blur-md py-4 md:py-6 lg:py-8'}`}
        >
            <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between">

                {/* Official Branding - Improved responsive sizing */}
                <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 group flex-shrink-0">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 transition-transform group-hover:scale-110 flex-shrink-0">
                        <Image
                            src="/images/logo_official.png"
                            alt="NDPS Logo"
                            fill
                            sizes="(max-width: 640px) 40px, (max-width: 768px) 44px, 48px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    {/* Full name on large screens */}
                    <div className="hidden xl:flex flex-col">
                        <span className="text-base lg:text-lg xl:text-xl font-display font-bold text-white tracking-wide whitespace-nowrap">NEW DEFENCE PUBLIC SCHOOL</span>
                        <span className="text-[8px] lg:text-[9px] font-black tracking-[0.2em] lg:tracking-[0.3em] uppercase text-[#C6A75E]">Excellence Since 1996</span>
                    </div>
                    {/* Abbreviated on medium screens */}
                    <div className="hidden md:flex xl:hidden flex-col">
                        <span className="text-sm lg:text-base font-display font-bold text-white tracking-wide whitespace-nowrap">NDPS</span>
                        <span className="text-[7px] lg:text-[8px] font-black tracking-[0.15em] uppercase text-[#C6A75E]">Est. 1996</span>
                    </div>
                    {/* Compact on small screens */}
                    <div className="flex md:hidden flex-col">
                        <span className="text-sm sm:text-base font-display font-bold text-white tracking-wide">NDPS</span>
                    </div>
                </Link>

                {/* Desktop Menu - Improved gap spacing */}
                <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 flex-shrink-0">
                    {navigation.map((item) => (
                        <div
                            key={item.name}
                            className="relative group py-2"
                            onMouseEnter={() => setActiveSubmenu(item.name)}
                            onMouseLeave={() => setActiveSubmenu(null)}
                        >
                            <Link
                                href={item.href}
                                className="text-white/80 hover:text-[#C6A75E] transition-colors text-[10px] xl:text-xs font-bold tracking-wider xl:tracking-widest uppercase flex items-center gap-1 whitespace-nowrap"
                            >
                                {item.name}
                                {item.submenu && <ChevronDown size={12} className="opacity-50" />}
                            </Link>

                            <AnimatePresence>
                                {item.submenu && activeSubmenu === item.name && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 w-44 xl:w-48 bg-[#1E2933] border border-white/10 rounded-xl overflow-hidden shadow-2xl mt-3"
                                    >
                                        {item.submenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                href={sub.href}
                                                className="block px-4 xl:px-6 py-3 xl:py-4 text-[10px] xl:text-[11px] font-bold text-white/70 hover:text-white hover:bg-[#C6A75E]/20 transition-all uppercase tracking-widest border-b border-white/5 last:border-0"
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
                        className="px-4 xl:px-6 2xl:px-8 py-2.5 xl:py-3 bg-[#C6A75E] text-[#0B1C2D] font-bold text-[10px] xl:text-xs uppercase tracking-wider xl:tracking-widest hover:bg-white transition-colors whitespace-nowrap rounded-sm flex-shrink-0"
                    >
                        Apply Now
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden text-white p-2 -mr-2"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Menu Overlay - Improved */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 top-0 bg-[#0B1C2D] z-[-1] flex flex-col pt-24 sm:pt-28 md:pt-32 p-6 sm:p-8 md:p-10 lg:hidden overflow-y-auto"
                    >
                        {navigation.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xl sm:text-2xl font-display font-medium text-white mb-6 sm:mb-8 border-b border-white/10 pb-4 block"
                                >
                                    {item.name}
                                </Link>
                                {/* Mobile submenu items */}
                                {item.submenu && (
                                    <div className="pl-4 mb-4">
                                        {item.submenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                href={sub.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block text-sm text-white/60 hover:text-[#C6A75E] py-2 transition-colors"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link
                                href="/admissions/apply"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-6 sm:mt-10 py-4 sm:py-6 bg-[#C6A75E] text-[#0B1C2D] text-center font-bold uppercase tracking-widest block rounded-lg"
                            >
                                Start Admission
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
