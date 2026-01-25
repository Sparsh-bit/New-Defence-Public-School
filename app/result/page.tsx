'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap, Award, FileText, CheckCircle, AlertCircle, Loader2, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubPageHero from '@/components/SubPageHero';
import PageTransition from '@/components/PageTransition';

interface SubjectMark {
    subject: string;
    marks: number;
}

interface StudentResult {
    srNo: string;
    studentName: string;
    class: string;
    stream: string;
    subjects: SubjectMark[];
    totalMarks: number;
    percentage: number;
    status: string;
    year: string;
}

export default function ResultSearchPage() {
    const [srNo, setSrNo] = useState('');
    const [studentName, setStudentName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<StudentResult | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const res = await fetch('/api/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Normalize locally before sending
                body: JSON.stringify({ sr_no: srNo.trim(), student_name: studentName.trim() }),
            });

            const data = await res.json();

            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('System temporarily offline. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <Navbar />
            <SubPageHero
                title="Academic Performance"
                subtitle="Official 2024-25 Annual Examination Result Portal."
                breadcrumb="EXAMINATIONS"
                icon={<Award className="w-8 h-8" />}
            />

            <section className="py-24 bg-[#F7F9FC] min-h-screen">
                <div className="container-premium max-w-4xl">

                    {/* Search Form Card */}
                    <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-sm border border-gray-100 mb-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-black text-[#0A1628] mb-4">Secure Result Access</h2>
                            <p className="text-gray-400 font-medium leading-relaxed">Verification of SR No and Official Name required for privacy.</p>
                        </div>

                        <form onSubmit={handleSearch} className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#C6A75E] ml-2">Admission No (SR No)</label>
                                <div className="relative group">
                                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0A1628] transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="e.g. 314-BIO"
                                        value={srNo}
                                        onChange={(e) => setSrNo(e.target.value)}
                                        className="w-full pl-16 pr-6 py-6 bg-gray-50 border border-transparent rounded-[28px] outline-none focus:bg-white focus:border-[#C6A75E] transition-all font-bold text-[#0A1628] uppercase"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#C6A75E] ml-2">Student Full Name</label>
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0A1628] transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Full Name as per records"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="w-full pl-16 pr-6 py-6 bg-gray-50 border border-transparent rounded-[28px] outline-none focus:bg-white focus:border-[#C6A75E] transition-all font-bold text-[#0A1628] uppercase"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-center pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-16 py-6 bg-[#0A1628] text-white rounded-[32px] font-bold text-xl hover:bg-[#C6A75E] hover:text-[#0A1628] transform active:scale-95 transition-all shadow-2xl shadow-black/10 disabled:opacity-50 flex items-center gap-4"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <GraduationCap size={28} />}
                                    {loading ? 'Authenticating...' : 'View Marksheet'}
                                </button>
                            </div>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="mt-10 p-8 bg-red-50 text-red-600 rounded-[32px] flex items-center gap-6 border border-red-100"
                                >
                                    <AlertCircle className="shrink-0" size={24} />
                                    <p className="font-bold text-lg leading-relaxed">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {result && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white overflow-hidden rounded-[56px] shadow-2xl border border-gray-100">
                                {/* Result Card Header */}
                                <div className="bg-[#0A1628] p-12 md:p-20 text-white relative">
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <Calendar className="text-[#C6A75E]" size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#C6A75E]">Academic Year {result.year}</span>
                                            </div>
                                            <h3 className="text-5xl md:text-6xl font-display font-black leading-tight mb-4 text-white">{result.studentName}</h3>
                                            <div className="flex items-center gap-4 text-white/60">
                                                <span className="font-bold">Admission No: {result.srNo}</span>
                                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                                                <span className="font-bold">Class {result.class}</span>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <div className="text-7xl font-display font-black text-[#C6A75E] mb-2">{result.percentage}%</div>
                                            <div className={`inline-flex px-8 py-2 rounded-full font-black text-sm uppercase tracking-widest ${result.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {result.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A75E]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                </div>

                                {/* Body */}
                                <div className="p-12 md:p-20">
                                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                                        <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 flex items-center gap-8">
                                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#0A1628] shadow-sm">
                                                <Award size={32} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Marks</p>
                                                <p className="text-3xl font-black text-[#0A1628]">{result.totalMarks}</p>
                                            </div>
                                        </div>
                                        <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 flex items-center gap-8">
                                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#0A1628] shadow-sm">
                                                <GraduationCap size={32} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Academic Stream</p>
                                                <p className="text-3xl font-black text-[#0A1628]">{result.stream}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden rounded-[40px] border border-gray-100 mb-12">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Subject Name</th>
                                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Marks Obtained</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {result.subjects.map((sub, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-10 py-8 font-bold text-lg text-[#0A1628]">{sub.subject}</td>
                                                        <td className="px-10 py-8 text-center font-black text-xl text-[#C6A75E]">{sub.marks}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="text-center p-10 bg-[#0A1628]/5 rounded-[40px] border border-[#0A1628]/5">
                                        <p className="!text-black text-sm font-medium leading-relaxed">
                                            Authorized computerized report for NDPS internal assessment. Valid for internal reference only. Original certificates issued by the examination board follow standard protocols.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!result && !loading && (
                        <div className="text-center py-32 opacity-20">
                            <GraduationCap className="mx-auto mb-8 text-gray-400" size={80} />
                            <p className="text-xl font-bold text-gray-500">Your digital marksheet will generate here.</p>
                        </div>
                    )}
                </div>
            </section>
        </PageTransition>
    );
}
