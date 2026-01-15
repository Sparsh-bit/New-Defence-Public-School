'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, Info, ArrowRight, Sparkles } from 'lucide-react';
import { schoolNewsEvents, NewsItem } from '@/data/cms';

export default function NewsEventsSection() {
    const [events, setEvents] = useState<NewsItem[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                if (data.news) {
                    setEvents(data.news.filter((item: NewsItem) => item.type === 'event'));
                    setNews(data.news.filter((item: NewsItem) => item.type !== 'event'));
                }
            } catch (error) {
                console.error('Failed to load news', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const hasItems = events.length > 0 || news.length > 0;

    if (loading) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#F7F9FC] to-white" />
            <div className="absolute -left-24 top-40 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
            <div className="absolute -right-24 bottom-40 w-96 h-96 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />

            <div className="container-premium relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[#C6A75E] font-bold tracking-widest uppercase text-sm mb-4 block"
                        >
                            Updates & Happenings
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-display font-black text-[#0A1628]"
                        >
                            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A1628] to-[#2A4A7F]">News & Events</span>
                        </motion.h2>
                    </div>
                </div>

                {!hasItems ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-16 text-center"
                    >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Recent Updates</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            There are currently no upcoming events or news announcements. Please check back later for updates from the administration.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Events Column */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0A1628]">Upcoming Events</h3>
                            </div>

                            {events.length === 0 ? (
                                <p className="text-gray-500 italic">No upcoming events scheduled.</p>
                            ) : (
                                <div className="space-y-6">
                                    {events.map((item, idx) => (
                                        <NewsCard key={item.id || `event-${item.title}-${item.date}-${idx}`} item={item} index={idx} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* News Column */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                    <Bell size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0A1628]">School News</h3>
                            </div>

                            {news.length === 0 ? (
                                <p className="text-gray-500 italic">No recent news to display.</p>
                            ) : (
                                <div className="space-y-6">
                                    {news.map((item, idx) => (
                                        <NewsCard key={item.id || `news-${item.title}-${item.date}-${idx}`} item={item} index={idx} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
    const isHoliday = item.type === 'holiday';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${item.highlight ? 'ring-2 ring-[#C6A75E]/20' : ''}`}
        >
            {item.highlight && (
                <div className="absolute top-0 right-0 bg-[#C6A75E] text-[#0A1628] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Highlight
                </div>
            )}

            <div className="flex gap-6 items-start">
                <div className={`shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border ${isHoliday ? 'bg-red-50 border-red-100 text-red-600' : 'bg-[#0A1628] border-[#0A1628] text-white'}`}>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                        {new Date(item.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black">
                        {new Date(item.date).getDate()}
                    </span>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${isHoliday ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {item.type}
                        </span>
                    </div>
                    <h4 className="text-lg font-bold text-[#0A1628] mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        {item.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
