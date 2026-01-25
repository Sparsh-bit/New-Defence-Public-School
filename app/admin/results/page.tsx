'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, ArrowLeft, ShieldCheck, Database, Info, Trash2, Calendar } from 'lucide-react';

export default function AdminResultsPortal() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [selectedClass, setSelectedClass] = useState('10');
    const [selectedStream, setSelectedStream] = useState('GENERAL');
    const [selectedYear, setSelectedYear] = useState('2024-25');
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRepairing, setIsRepairing] = useState(false);
    const [batches, setBatches] = useState<{ batch_id: string, academic_year: string, class: string, stream: string, upload_date: string }[]>([]);
    const [isLoadingBatches, setIsLoadingBatches] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Config
    const academicYears = ['2023-24', '2024-25', '2025-26', '2026-27'];
    const streamOptions = selectedClass === '10'
        ? [{ value: 'GENERAL', label: 'General (-H)' }]
        : [
            { value: 'BIO', label: 'Biology (-BIO)' },
            { value: 'MATH', label: 'Mathematics (-MATH)' },
            { value: 'ARTS', label: 'Arts (-ARTS)' }
        ];

    useEffect(() => {
        if (selectedClass === '10') setSelectedStream('GENERAL');
        else if (selectedClass === '12' && selectedStream === 'GENERAL') setSelectedStream('BIO');
    }, [selectedClass]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
            fetchBatches();
        } else {
            router.push('/admissions/portal');
        }
    }, [router]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    const fetchBatches = async () => {
        setIsLoadingBatches(true);
        try {
            const res = await fetch('/api/admin/upload-results', {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (data.success) setBatches(data.data);
        } catch (e) {
            console.error('Failed to fetch batches');
        } finally {
            setIsLoadingBatches(false);
        }
    };

    const handleAction = async (action: 'upload' | 'delete' | 'delete-batch', extraData?: any) => {
        if (action === 'delete') {
            if (!confirm(`Are you absolutely sure you want to PERMANENTLY DELETE all results for Class ${selectedClass} ${selectedStream} for the year ${selectedYear}? This cannot be undone.`)) return;
            setIsDeleting(true);
        } else if (action === 'delete-batch') {
            if (!confirm(`Delete all records from file: ${extraData}?`)) return;
            setIsDeleting(true);
        } else {
            if (!file) return;
            setIsUploading(true);
        }

        setMessage(null);

        try {
            const formData = new FormData();
            if (file) formData.append('file', file);
            formData.append('class', selectedClass);
            formData.append('stream', selectedStream);
            formData.append('year', selectedYear);
            formData.append('action', action);
            if (extraData) formData.append('batch_id', extraData);

            const res = await fetch('/api/admin/upload-results', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                if (action === 'upload') {
                    setFile(null);
                    const input = document.getElementById('excelUpload') as HTMLInputElement;
                    if (input) input.value = '';
                }
                fetchBatches();
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection error. Database cluster may be unreachable.' });
        } finally {
            setIsUploading(false);
            setIsDeleting(false);
        }
    };

    const handleRepair = async () => {
        setIsRepairing(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/repair', {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Database schema repaired successfully. You can now resume uploads.' });
            } else {
                setMessage({ type: 'error', text: 'Repair failed: ' + (data.error || data.message) });
            }
        } catch (e) {
            setMessage({ type: 'error', text: 'Repair request failed.' });
        } finally {
            setIsRepairing(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-6 text-display text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin w-12 h-12 text-[#C6A75E]" />
                    <p className="font-bold text-xl">Redirecting to Secure Login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F9FC]">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-6 px-10 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><ArrowLeft /></button>
                    <div>
                        <h2 className="text-xl font-display font-bold text-[#0A1628]">Academic History Manager</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">D1 Production Cluster - Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0A1628] rounded-xl flex items-center justify-center text-white">
                        <Database size={20} />
                    </div>
                </div>
            </header>

            <main className="container-premium max-w-5xl py-16">

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Instructions Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0A1628] p-8 rounded-[40px] text-white overflow-hidden relative shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                                <Info size={24} className="text-[#C6A75E]" />
                                Data Rules
                            </h3>
                            <ul className="space-y-4 text-white/70 text-sm font-medium">
                                <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-[#C6A75E] rounded-full mt-1.5 shrink-0"></div>Select the target Year, Class and Stream carefully.</li>
                                <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-[#C6A75E] rounded-full mt-1.5 shrink-0"></div>New uploads for existing categories will OVERWRITE old data.</li>
                                <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-[#C6A75E] rounded-full mt-1.5 shrink-0"></div>The system automatically maps school-standard Excel headers.</li>
                            </ul>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        </div>

                        {/* Authority/Cleanup Panel */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-red-50">
                            <h4 className="text-sm font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                                <Trash2 size={16} /> Data Authority
                            </h4>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleAction('delete')}
                                    disabled={isDeleting}
                                    className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                                >
                                    {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 size={18} />}
                                    Wipe Category
                                </button>

                                <button
                                    onClick={handleRepair}
                                    disabled={isRepairing}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-30 ${message?.text?.includes('SQLITE_ERROR') || message?.text?.includes('column')
                                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white border border-amber-200'
                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    {isRepairing ? <Loader2 className="animate-spin" /> : <Database size={18} />}
                                    Schema Patch
                                </button>
                                {message?.text?.includes('SQLITE_ERROR') && (
                                    <p className="text-[10px] text-amber-600 font-bold text-center animate-pulse">
                                        Found database mismatch. Click Schema Patch to fix.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Uploads / Granular Deletion */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative">
                            <div className="mb-6">
                                <h4 className="text-sm font-black uppercase tracking-widest text-[#0A1628] flex items-center gap-2">
                                    <FileSpreadsheet size={16} /> Database Snapshot
                                </h4>
                                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Total Files Sync</span>
                                    <span className="text-2xl font-black text-emerald-700">{batches.length}</span>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoadingBatches ? (
                                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" /></div>
                                ) : batches.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-10 italic">No recent uploads tracked.</p>
                                ) : (
                                    batches.map((b) => (
                                        <div key={b.batch_id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-[#C6A75E] uppercase tracking-tighter truncate max-w-[140px]">{b.batch_id.split('-')[0]}</p>
                                                <p className="text-[9px] font-bold text-gray-400 mt-1">{new Date(b.upload_date || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAction('delete-batch', b.batch_id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Store Selection & Upload Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-12 rounded-[48px] shadow-sm border border-gray-100">
                            <div className="mb-10">
                                <h3 className="text-3xl font-display font-black text-[#0A1628] mb-2">Sync Records</h3>
                                <p className="text-gray-400 font-medium">Define metadata and upload your student performance spreadsheet.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Academic Year</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="w-full p-5 bg-gray-50 border border-transparent rounded-[24px] outline-none focus:bg-white focus:border-[#C6A75E] transition-all font-bold text-[#0A1628] appearance-none"
                                    >
                                        {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Target Class</label>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="w-full p-5 bg-gray-50 border border-transparent rounded-[24px] outline-none focus:bg-white focus:border-[#C6A75E] transition-all font-bold text-[#0A1628] appearance-none"
                                    >
                                        <option value="10">Class 10th</option>
                                        <option value="12">Class 12th</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Stream</label>
                                    <select
                                        value={selectedStream}
                                        onChange={(e) => setSelectedStream(e.target.value)}
                                        className="w-full p-5 bg-gray-50 border border-transparent rounded-[24px] outline-none focus:bg-white focus:border-[#C6A75E] transition-all font-bold text-[#0A1628] appearance-none"
                                    >
                                        {streamOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="relative mb-8">
                                <input id="excelUpload" type="file" accept=".xlsx, .xls" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                                <label
                                    htmlFor="excelUpload"
                                    className={`w-full h-72 border-4 border-dashed rounded-[40px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${file ? 'border-[#C6A75E] bg-[#C6A75E]/5' : 'border-gray-100 hover:border-[#0A1628] hover:bg-gray-50'}`}
                                >
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${file ? 'bg-[#C6A75E] text-[#0A1628]' : 'bg-[#0A1628] text-white'}`}>
                                        {file ? <FileSpreadsheet size={32} /> : <UploadCloud size={32} />}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-lg text-[#0A1628]">{file ? file.name : 'Select Spreadsheet'}</p>
                                        <p className="text-xs text-gray-400 mt-1">{selectedYear} / Class {selectedClass} / {selectedStream}</p>
                                    </div>
                                </label>
                            </div>

                            <button
                                onClick={() => handleAction('upload')}
                                disabled={!file || isUploading}
                                className="w-full py-6 bg-[#0A1628] text-white rounded-[32px] font-bold text-xl hover:bg-[#C6A75E] hover:text-[#0A1628] transition-all transform active:scale-98 shadow-2xl shadow-[#0A1628]/10 disabled:opacity-30 flex items-center justify-center gap-4"
                            >
                                {isUploading ? <Loader2 className="animate-spin" /> : <Database />}
                                {isUploading ? 'Synchronizing...' : 'Upload & Sync Data'}
                            </button>

                            <AnimatePresence>
                                {message && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className={`mt-10 p-8 rounded-[32px] flex items-start gap-6 border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}
                                    >
                                        {message.type === 'success' ? <CheckCircle className="shrink-0 mt-1" /> : <AlertCircle className="shrink-0 mt-1" />}
                                        <p className="font-bold text-lg leading-relaxed">{message.text}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
