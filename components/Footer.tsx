'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const footerLinks = {
    explore: [
        { label: 'About School', href: '/about' },
        { label: 'Infrastructure', href: '/about/infrastructure' },
        { label: 'Fee Structure', href: '/admissions' },
        { label: 'School Rules', href: '/rules/conduct' },
    ],
    academics: [
        { label: 'CBSE Curriculum', href: '/about/curriculum' },
        { label: 'Examination System', href: '/academics/examination' },
        { label: 'Transfer Certificate', href: '/admissions' },
        { label: 'Book List', href: '/downloads' },
    ],
    connect: [
        { label: 'Admissions Open', href: '/admissions/apply' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Photo Gallery', href: '/gallery/photos' },
        { label: 'Video Showcase', href: '/gallery/videos' },
    ]
};

import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    if (pathname && (pathname.startsWith('/admissions/admin') || pathname.startsWith('/admin'))) {
        return null;
    }

    return (
        <footer className="bg-[#0B1C2D] pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-24 sm:pb-28 md:pb-12 text-white relative overflow-hidden">

            {/* Background Branding (Subtle) - Hidden on mobile */}
            <div className="absolute top-0 right-0 p-10 select-none pointer-events-none opacity-5 hidden md:block">
                <h2 className="text-[15vw] lg:text-[20vw] font-display font-bold leading-none">NDPS</h2>
            </div>

            <div className="container-premium relative z-10 px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 md:gap-16 lg:gap-24 mb-16 sm:mb-20 md:mb-24 lg:mb-32 text-left">

                    {/* Official Info */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 group">
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-transform group-hover:scale-110 flex-shrink-0">
                                <Image
                                    src="/images/logo_official.png"
                                    alt="NDPS Logo"
                                    fill
                                    sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-tight !text-white" style={{ color: '#FFFFFF' }}>New Defence <br className="hidden sm:block" /><span className="sm:hidden"> </span>Public School</h2>
                        </Link>
                        <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-sm">
                            Pioneering excellence in school education since 1996. Dedicated to building strong foundations for future world leaders.
                        </p>
                        <div className="flex gap-3 sm:gap-4">
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all duration-300 border border-white/10"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} className="sm:hidden" />
                                <Facebook size={20} className="hidden sm:block" />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all duration-300 border border-white/10"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} className="sm:hidden" />
                                <Instagram size={20} className="hidden sm:block" />
                            </a>
                            <a
                                href="https://www.youtube.com/@newdefencepublichr.sec.94123"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all duration-300 border border-white/10"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} className="sm:hidden" />
                                <Youtube size={20} className="hidden sm:block" />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all duration-300 border border-white/10"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} className="sm:hidden" />
                                <Twitter size={20} className="hidden sm:block" />
                            </a>
                        </div>
                    </div>

                    {/* Links Groups */}
                    <FooterGroup title="Explore" links={footerLinks.explore} />
                    <FooterGroup title="Academics" links={footerLinks.academics} />
                    <FooterGroup title="Admission" links={footerLinks.connect} />

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 sm:pt-10 md:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8">
                    <p className="text-white/40 text-xs sm:text-sm font-medium tracking-wide text-center md:text-left">
                        © 2024 New Defence Public School. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 md:gap-10 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/50">
                        <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Terms of Use</Link>
                        <Link href="/admissions/portal" className="hover:text-[#FFD700] transition-colors flex items-center gap-1">
                            🔐 Admin Portal
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterGroup({ title, links }: { title: string; links: any[] }) {
    return (
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-10">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#C6A75E]">{title}</h4>
            <ul className="flex flex-col gap-3 sm:gap-4 md:gap-6">
                {links.map((link, i) => (
                    <li key={i}>
                        <Link
                            href={link.href}
                            className="group flex items-center gap-1.5 text-base sm:text-lg font-medium text-white/60 hover:text-white transition-colors"
                        >
                            {link.label}
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
