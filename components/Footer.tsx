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
        <footer className="bg-[#0B1C2D] pt-32 pb-12 text-white relative overflow-hidden">

            {/* Background Branding (Subtle) */}
            <div className="absolute top-0 right-0 p-10 select-none pointer-events-none opacity-5">
                <h2 className="text-[20vw] font-display font-bold leading-none">NDPS</h2>
            </div>

            <div className="container-premium relative z-10 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 md:gap-24 mb-32 text-left">

                    {/* Official Info */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-4 mb-10 group">
                            <div className="relative w-16 h-16 transition-transform group-hover:scale-110">
                                <Image
                                    src="/images/logo_official.png"
                                    alt="NDPS Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="text-3xl font-display font-bold tracking-tight !text-white" style={{ color: '#FFFFFF' }}>New Defence <br /> Public School</h2>
                        </Link>
                        <p className="text-white/60 text-lg font-light leading-relaxed mb-10 max-w-sm">
                            Pioneering excellence in school education since 1996. Dedicated to building strong foundations for future world leaders.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all duration-300 border border-white/10"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all duration-300 border border-white/10"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://www.youtube.com/@newdefencepublichr.sec.94123"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all duration-300 border border-white/10"
                            >
                                <Youtube size={20} />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D] transition-all duration-300 border border-white/10"
                            >
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links Groups */}
                    <FooterGroup title="Explore" links={footerLinks.explore} />
                    <FooterGroup title="Academics" links={footerLinks.academics} />
                    <FooterGroup title="Admission" links={footerLinks.connect} />

                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-white/40 text-sm font-medium tracking-wide">
                        © 2024 New Defence Public School. All rights reserved.
                    </p>
                    <div className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
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
        <div className="flex flex-col gap-10">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-[#C6A75E]">{title}</h4>
            <ul className="flex flex-col gap-6">
                {links.map((link, i) => (
                    <li key={i}>
                        <Link
                            href={link.href}
                            className="group flex items-center gap-1.5 text-lg font-medium text-white/60 hover:text-white transition-colors"
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
