'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import PageTransition from '@/components/PageTransition';
import { Settings, Plus, Trash2, Image as ImageIcon, Save, Bell, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { schoolNewsEvents, galleryImages } from '@/data/cms';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'news' | 'gallery'>('news');

    // News State
    const [newsItems, setNewsItems] = useState(schoolNewsEvents);
    const [newNews, setNewNews] = useState({
        title: '',
        description: '',
        date: '',
        type: 'event', // event, news, holiday
        highlight: false
    });

    // Gallery State
    const [galleryItems, setGalleryItems] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize intent from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('ndps_gallery_images');
        if (saved) {
            setGalleryItems(JSON.parse(saved));
        } else {
            setGalleryItems(galleryImages.events);
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (galleryItems.length > 0) {
            localStorage.setItem('ndps_gallery_images', JSON.stringify(galleryItems));
        }
    }, [galleryItems]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        const newImages: string[] = [];

        // Use FileReader to convert to Base64 for LocalStorage persistence across tabs/reloads
        // (URLs created with createObjectURL are revoked on unload)
        const promises = Array.from(e.target.files).map(file => {
            return new Promise<void>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        newImages.push(reader.result as string);
                    }
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(() => {
            setGalleryItems(prev => [...newImages, ...prev]);
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        });
    };

    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        const item = {
            id: Date.now().toString(),
            ...newNews
        };

        // Optimistic UI Update
        const updatedList = [item, ...newsItems] as any;
        setNewsItems(updatedList);

        // API Call
        await fetch('/api/admin/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'news', action: 'update_news', data: item })
        });

        setNewNews({ title: '', description: '', date: '', type: 'event', highlight: false });
    };

    const handleDeleteNews = (id: string) => {
        setNewsItems(newsItems.filter(item => item.id !== id));
    };

    return (
        <PageTransition>
            <Navbar />
            <SubPageHero
                title="Admin Portal"
                subtitle="Manage website content, school news, and gallery images."
                breadcrumb="Administration"
                icon={<Settings className="w-8 h-8" />}
            />

            <section className="py-20 px-6 bg-[#F7F9FC] min-h-screen">
                <div className="container-premium max-w-6xl">

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        <button
                            onClick={() => setActiveTab('news')}
                            className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'news'
                                ? 'bg-[#0A1628] text-white shadow-xl scale-105'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <Bell size={20} />
                            News & Events
                        </button>
                        <button
                            onClick={() => setActiveTab('gallery')}
                            className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'gallery'
                                ? 'bg-[#0A1628] text-white shadow-xl scale-105'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <ImageIcon size={20} />
                            Gallery Manager
                        </button>
                    </div>

                    {/* News Panel */}
                    {activeTab === 'news' && (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Add News Form */}
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-fit">
                                <h3 className="text-xl font-bold text-[#0A1628] mb-6 flex items-center gap-2">
                                    <Plus className="text-[#C6A75E]" /> Add New Update
                                </h3>
                                <form onSubmit={handleAddNews} className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Title</label>
                                        <input
                                            value={newNews.title}
                                            onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#C6A75E] outline-none"
                                            placeholder="Event title..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Details</label>
                                        <textarea
                                            value={newNews.description}
                                            onChange={e => setNewNews({ ...newNews, description: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#C6A75E] outline-none"
                                            rows={3}
                                            placeholder="Description..."
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Date</label>
                                            <input
                                                type="date"
                                                value={newNews.date}
                                                onChange={e => setNewNews({ ...newNews, date: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Type</label>
                                            <select
                                                value={newNews.type}
                                                onChange={e => setNewNews({ ...newNews, type: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none"
                                            >
                                                <option value="event">Event</option>
                                                <option value="news">News</option>
                                                <option value="holiday">Holiday</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                        <input
                                            type="checkbox"
                                            checked={newNews.highlight}
                                            onChange={e => setNewNews({ ...newNews, highlight: e.target.checked })}
                                            className="w-5 h-5 accent-[#C6A75E]"
                                        />
                                        <span className="text-sm font-semibold text-amber-900">Mark as Highlight</span>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-[#0A1628] text-white rounded-xl font-bold hover:bg-[#C6A75E] hover:text-[#0A1628] transition-colors">
                                        Post Update
                                    </button>
                                </form>
                            </div>

                            {/* News List */}
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-xl font-bold text-[#0A1628] mb-6">Current Updates</h3>
                                {newsItems.length === 0 ? (
                                    <div className="p-12 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">
                                        No active news or events.
                                    </div>
                                ) : (
                                    newsItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start group"
                                        >
                                            <div className="flex gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg ${item.type === 'holiday' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {item.type === 'holiday' ? 'H' : 'E'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#0A1628]">{item.title}</h4>
                                                    <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                                                    <div className="flex gap-3">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 px-2 py-1 rounded text-gray-500">
                                                            {new Date(item.date).toLocaleDateString()}
                                                        </span>
                                                        {item.highlight && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                                                Highlight
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteNews(item.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Gallery Panel */}
                    {activeTab === 'gallery' && (
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-[#0A1628]">Gallery Management</h3>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="px-6 py-3 bg-[#C6A75E] text-[#0B1C2D] rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A1628] hover:text-white transition-colors disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <div className="animate-spin w-5 h-5 border-2 border-[#0B1C2D] border-t-transparent rounded-full" />
                                    ) : (
                                        <Plus size={18} />
                                    )}
                                    {isUploading ? 'Uploading...' : 'Upload Photos'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {galleryItems.map((src, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                                        <button
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Remove Image"
                                            onClick={() => {
                                                const newItems = galleryItems.filter((_, i) => i !== idx);
                                                setGalleryItems(newItems);
                                                // Ideally call API to delete here too
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </section>

        </PageTransition>
    );
}
