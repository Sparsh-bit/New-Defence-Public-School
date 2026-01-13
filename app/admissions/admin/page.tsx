'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RefreshCw, Search, Calendar, User, Phone, LogOut, Settings, Plus, Trash2, Image as ImageIcon, Bell, GraduationCap, FileSpreadsheet, UploadCloud, Loader2 } from 'lucide-react';
import { schoolNewsEvents, galleryImages } from '@/data/cms';

// --- Types ---
interface Application {
    id: string;
    submittedAt: string;
    studentName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    religion: string;
    category: string;
    aadharNumber: string;
    fatherName: string;
    fatherOccupation: string;
    fatherPhone: string;
    fatherEmail: string;
    motherName: string;
    motherOccupation: string;
    motherPhone: string;
    motherEmail: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    classApplyingFor: string;
    previousSchool: string;
    previousClass: string;
    medicalConditions: string;
    emergencyContact: string;
    emergencyPhone: string;
}

export default function SuperAdminPortal() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'applications' | 'news' | 'gallery'>('applications');

    // --- Applications State ---
    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    // --- News State ---
    const [newsItems, setNewsItems] = useState(schoolNewsEvents);
    const [newNews, setNewNews] = useState({
        title: '',
        description: '',
        date: '',
        type: 'event', // event, news, holiday
        highlight: false
    });

    // --- Gallery State ---
    const [galleryItems, setGalleryItems] = useState<any>(galleryImages);

    // --- Authentication Check & Data Load ---
    useEffect(() => {
        const loggedIn = localStorage.getItem('adminLoggedIn');
        if (loggedIn === 'true') {
            setIsAuthenticated(true);
            fetchApplications();
            fetchContent();
        } else {
            router.push('/admissions/portal');
        }
    }, [router]);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            if (data.news && Array.isArray(data.news)) {
                setNewsItems(data.news);
            }
            if (data.gallery) {
                setGalleryItems(data.gallery);
            }
        } catch (error) {
            console.error('Failed to load content:', error);
        }
    };

    // --- Applications Logic ---
    useEffect(() => {
        if (searchTerm) {
            const filtered = applications.filter((app) =>
                app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.classApplyingFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.id.includes(searchTerm)
            );
            setFilteredApplications(filtered);
        } else {
            setFilteredApplications(applications);
        }
    }, [searchTerm, applications]);

    const fetchApplications = async () => {
        setLoadingApps(true);
        try {
            const response = await fetch('/api/admissions/list');
            const data = await response.json();
            if (data.success) {
                setApplications(data.applications);
                setFilteredApplications(data.applications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoadingApps(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        router.push('/admissions/portal');
    };

    // --- Applications Logic ---
    const handleDeleteApplication = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm('Are you sure you want to permanently delete this application?')) return;

        try {
            const res = await fetch('/api/admissions/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setApplications(applications.filter(app => app.id !== id));
                setFilteredApplications(filteredApplications.filter(app => app.id !== id));
                if (selectedApplication?.id === id) setSelectedApplication(null);
            } else {
                alert('Failed to delete application');
            }
        } catch (error) {
            console.error('Delete error', error);
        }
    };

    const handleExport = async (format: string) => {
        // We use the same API for both, returning CSV which Excel opens.
        window.location.href = `/api/admissions/export?format=${format}`;
    };

    // --- News Logic ---
    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        const item = {
            id: Date.now().toString(),
            ...newNews
        };
        const updatedList = [item, ...newsItems] as any;
        setNewsItems(updatedList);
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

    // --- Gallery Logic ---
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [galleryCategory, setGalleryCategory] = useState<'events' | 'infrastructure'>('events');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        // Check Limit
        const currentImages = (galleryItems as any)[galleryCategory] || [];
        if (currentImages.length >= 20) {
            alert(`Limit Reached: You can only display 20 images in the ${galleryCategory} gallery. Delete some images to make space.`);
            return;
        }

        setUploading(true);

        try {
            // 1. Upload File
            const formData = new FormData();
            formData.append('file', selectedFile);

            const uploadRes = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (!uploadData.success) throw new Error(uploadData.message);

            const imageUrl = uploadData.url;

            // 2. Update CMS Data
            // Optimistic UI
            const updatedGallery = { ...galleryItems } as any;
            if (!updatedGallery[galleryCategory]) updatedGallery[galleryCategory] = [];
            updatedGallery[galleryCategory].push(imageUrl);
            setGalleryItems(updatedGallery);

            await fetch('/api/admin/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'gallery',
                    action: 'add_image',
                    data: { category: galleryCategory, url: imageUrl }
                })
            });

            setSelectedFile(null); // Clear input
            // Reset file input value if needed via ref, but for now state null is ok logic wise
            (document.getElementById('fileInput') as HTMLInputElement).value = '';

        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (category: string, url: string) => {
        const updatedGallery = { ...galleryItems } as any;
        updatedGallery[category] = updatedGallery[category].filter((img: string) => img !== url);
        setGalleryItems(updatedGallery);

        await fetch('/api/admin/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'gallery',
                action: 'delete_image',
                data: { category, url }
            })
        });
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#0A1628] text-white flex-shrink-0 md:h-screen sticky top-0 md:fixed z-50">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <Settings className="text-[#C6A75E]" />
                    <div>
                        <h2 className="font-bold text-2xl leading-none text-white">Admin Portal</h2>
                        <span className="text-sm text-gray-300">NDPS Management</span>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'applications' ? 'bg-[#C6A75E] text-[#0A1628] font-bold shadow-lg' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                    >
                        <GraduationCap size={20} /> Applications
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'news' ? 'bg-[#C6A75E] text-[#0A1628] font-bold shadow-lg' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Bell size={20} /> News & Events
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'gallery' ? 'bg-[#C6A75E] text-[#0A1628] font-bold shadow-lg' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                    >
                        <ImageIcon size={20} /> Gallery
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-12 overflow-y-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0A1628] mb-2">
                            {activeTab === 'applications' && 'Admissions Overview'}
                            {activeTab === 'news' && 'News & Events Manager'}
                            {activeTab === 'gallery' && 'Gallery Manager'}
                        </h1>
                        <p className="text-gray-500">Welcome back, Administrator.</p>
                    </div>
                    {activeTab === 'applications' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport('csv')}
                                className="bg-[#107C41] text-white px-4 py-3 rounded-xl shadow-sm font-bold flex items-center gap-2 hover:bg-[#0c5e31] transition-colors"
                                title="Download Excel"
                            >
                                <FileSpreadsheet size={20} /> <span className="hidden md:inline">Export Excel</span>
                            </button>
                            <button
                                onClick={fetchApplications}
                                className="bg-white p-3 rounded-xl shadow-sm text-gray-500 hover:text-[#0A1628] transition-colors"
                                title="Refresh Data"
                            >
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    )}
                </header>

                {/* --- APPLICATIONS TAB --- */}
                {activeTab === 'applications' && (
                    <div className="space-y-6">
                        {/* Search & Filters */}
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search student, parent, or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} // Corrected event handler type
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#C6A75E] outline-none shadow-sm"
                                />
                            </div>
                        </div>

                        {loadingApps ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="w-10 h-10 border-4 border-[#C6A75E] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-400">No applications found matching your search.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredApplications.map((app) => (
                                    <div
                                        key={app.id}
                                        onClick={() => setSelectedApplication(app)}
                                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 group relative"
                                    >
                                        <button
                                            onClick={(e) => handleDeleteApplication(app.id, e)}
                                            className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 z-10"
                                            title="Delete Application"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-[#0A1628] group-hover:text-[#C6A75E] transition-colors">{app.studentName}</h3>
                                                <span className="text-xs text-gray-400 font-mono">#{app.id}</span>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                                {app.classApplyingFor}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2"><User size={14} /> Parent: {app.fatherName}</div>
                                            <div className="flex items-center gap-2"><Phone size={14} /> {app.fatherPhone}</div>
                                            <div className="flex items-center gap-2"><Calendar size={14} /> Applied: {new Date(app.submittedAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- NEWS TAB --- */}
                {activeTab === 'news' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Add News Form */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-fit">
                            <h3 className="text-xl font-bold text-[#0A1628] mb-6 flex items-center gap-2">
                                <Plus className="text-[#C6A75E]" /> Add Update
                            </h3>
                            <form onSubmit={handleAddNews} className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Title</label>
                                    <input
                                        value={newNews.title}
                                        onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#C6A75E] outline-none"
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

                        {/* List */}
                        <div className="lg:col-span-2 space-y-4">
                            {newsItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start group"
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg ${item.type === 'holiday' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {item.type === 'holiday' ? 'H' : 'E'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0A1628]">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNews(item.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- GALLERY TAB --- */}
                {activeTab === 'gallery' && (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        {/* Upload Form */}
                        <div className="mb-12 bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                            <h4 className="text-lg font-bold text-[#0A1628] mb-4 flex items-center gap-2">
                                <Plus className="text-[#C6A75E]" /> Add New Image
                            </h4>
                            <form onSubmit={handleUploadImage} className="grid md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Select Image</label>
                                    <div className="relative">
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:border-[#C6A75E] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0A1628] file:text-white hover:file:bg-[#C6A75E] hover:file:text-[#0A1628] transition-all cursor-pointer"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                            <UploadCloud size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Category</label>
                                    <select
                                        value={galleryCategory}
                                        onChange={e => setGalleryCategory(e.target.value as 'events' | 'infrastructure')}
                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none"
                                    >
                                        <option value="events">Events & Life</option>
                                        <option value="infrastructure">Infrastructure</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className="w-full py-3 bg-[#0A1628] text-white rounded-xl font-bold hover:bg-[#C6A75E] hover:text-[#0A1628] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploading ? <Loader2 className="animate-spin" /> : 'Upload Image'}
                                </button>
                            </form>
                        </div>

                        {/* Status / Usage */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                                <div>
                                    <h5 className="font-bold text-blue-900">Events Gallery</h5>
                                    <p className="text-xs text-blue-700">{(galleryItems as any).events?.length || 0} / 20 images used</p>
                                </div>
                                <div className="w-16 h-16 rounded-full border-4 border-blue-200 flex items-center justify-center font-bold text-blue-800">
                                    {((galleryItems as any).events?.length || 0)}
                                </div>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex justify-between items-center">
                                <div>
                                    <h5 className="font-bold text-amber-900">Infrastructure</h5>
                                    <p className="text-xs text-amber-700">{(galleryItems as any).infrastructure?.length || 0} / 20 images used</p>
                                </div>
                                <div className="w-16 h-16 rounded-full border-4 border-amber-200 flex items-center justify-center font-bold text-amber-800">
                                    {((galleryItems as any).infrastructure?.length || 0)}
                                </div>
                            </div>
                        </div>

                        {/* Events Gallery */}
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-[#0A1628] mb-4">Events Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {(galleryItems as any).events?.map((src: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                                        <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => handleDeleteImage('events', src)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Infrastructure Gallery */}
                        <div>
                            <h3 className="text-xl font-bold text-[#0A1628] mb-4">Infrastructure Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {(galleryItems as any).infrastructure?.map((src: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                                        <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => handleDeleteImage('infrastructure', src)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Application Detail Modal */}
            {selectedApplication && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={() => setSelectedApplication(null)}
                >
                    <div
                        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-[#0A1628] mb-1">{selectedApplication.studentName}</h2>
                        <p className="text-gray-500 mb-6">Application ID: {selectedApplication.id}</p>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Student Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">Class:</span> <span className="font-semibold">{selectedApplication.classApplyingFor}</span></div>
                                    <div><span className="text-gray-500">DOB:</span> <span className="font-semibold">{selectedApplication.dateOfBirth}</span></div>
                                    <div><span className="text-gray-500">Gender:</span> <span className="font-semibold">{selectedApplication.gender}</span></div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Parent Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b pb-2"><span>Father Name</span> <span className="font-semibold">{selectedApplication.fatherName}</span></div>
                                    <div className="flex justify-between border-b pb-2"><span>Phone</span> <span className="font-semibold">{selectedApplication.fatherPhone}</span></div>
                                    <div className="flex justify-between border-b pb-2"><span>Mother Name</span> <span className="font-semibold">{selectedApplication.motherName}</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200"
                            >Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
