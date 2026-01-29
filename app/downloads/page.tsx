'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import PageTransition from '@/components/PageTransition';
import { FileText, Download, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadItem {
    id: string;
    name: string;
    description: string;
    url: string;
    category: 'general' | 'results';
    updatedAt: string;
}

export default function DownloadsPage() {
    const [downloads, setDownloads] = useState<{ general: DownloadItem[], results: DownloadItem[] }>({
        general: [],
        results: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                if (data.downloads) {
                    setDownloads(data.downloads);
                }
            } catch (error) {
                console.error('Failed to fetch downloads:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDownloads();
    }, []);

    return (
        <main>
            <SubPageHero
                title="Resource Center"
                subtitle="Download official school documents, examination results, and academic resources."
                breadcrumb="Downloads"
                icon={<Download className="w-8 h-8" />}
            />

            <section className="py-24 bg-[#F7F9FC] min-h-screen">
                <div className="container-premium max-w-5xl">

                    {/* Class Results Section - Highlighted if exists */}
                    {(downloads.results && downloads.results.length > 0) && (
                        <div className="mb-20">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200"></div>
                                <h2 className="text-3xl font-display font-black text-[#0A1628] uppercase tracking-wider">Examination Results</h2>
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200"></div>
                            </div>

                            <div className="grid gap-6">
                                {downloads.results.map((doc, idx) => (
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 group"
                                    >
                                        <div className="flex gap-6 items-center w-full">
                                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                <FileText size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-[#0A1628] mb-1">{doc.name}</h3>
                                                <p className="text-gray-500 text-sm mb-2">{doc.description}</p>
                                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(doc.updatedAt).toLocaleDateString()}</span>
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded">RESULT</span>
                                                </div>
                                            </div>
                                        </div>
                                        <a
                                            href={`${doc.url}${doc.url.includes('?') ? '&' : '?'}dl=1`}
                                            download
                                            className="w-full md:w-auto px-8 py-4 bg-[#0A1628] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#C6A75E] hover:text-[#0A1628] transition-all"
                                        >
                                            <Download size={20} /> Download PDF
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* General Downloads Section */}
                    <div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200"></div>
                            <h2 className="text-3xl font-display font-black text-[#0A1628] uppercase tracking-wider">Academic Resources</h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200"></div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-[#C6A75E] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading Resources...</p>
                            </div>
                        ) : (downloads.general && downloads.general.length > 0) ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {downloads.general.map((doc, idx) => (
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        viewport={{ once: true }}
                                        className="bg-white p-6 rounded-[28px] shadow-sm hover:shadow-lg transition-all border border-gray-100 flex items-start gap-4 group"
                                    >
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#0A1628] mb-1 group-hover:text-[#C6A75E] transition-colors">{doc.name}</h4>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{doc.description}</p>
                                            <a
                                                href={doc.url}
                                                download
                                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0A1628] border-b-2 border-[#C6A75E]/30 pb-0.5 hover:border-[#C6A75E] transition-all"
                                            >
                                                <Download size={14} /> Get Copy
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[48px] border border-dashed border-gray-200">
                                <Info className="mx-auto text-gray-200 mb-4" size={48} />
                                <p className="text-gray-400 font-medium">No public documents are available at this time.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}
