'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, RefreshCw, Search, Calendar, User, Phone, Mail, MapPin, GraduationCap, Info, LogOut } from 'lucide-react';

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

export default function AdminPanel() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        const loggedIn = localStorage.getItem('adminLoggedIn');
        if (loggedIn === 'true') {
            setIsAuthenticated(true);
        } else {
            router.push('/admissions/portal');
        }
    }, [router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchApplications();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Filter applications based on search term
        if (searchTerm) {
            const filtered = applications.filter((app) =>
                app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.classApplyingFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.id.includes(searchTerm)
            );
            setFilteredApplications(filtered);
        } else {
            setFilteredApplications(applications);
        }
    }, [searchTerm, applications]);

    const fetchApplications = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    const handleExport = async (format: string) => {
        try {
            const response = await fetch(`/api/admissions/export?format=${format}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `applications-${new Date().toISOString().split('T')[0]}.${format === 'xlsx' ? 'xlsx' : 'csv'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        router.push('/admissions/portal');
    };

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    {/* Title */}
                    <div className="mb-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            Admission Applications
                        </h1>
                        <p className="text-purple-200 text-lg">
                            Admin Dashboard - New Defence Public School
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fetchApplications()}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleExport('csv')}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Export CSV
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleExport('xlsx')}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-colors"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                            Export Excel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </motion.button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <p className="text-purple-200 text-sm font-semibold mb-1">Total Applications</p>
                            <p className="text-4xl font-bold text-white">{applications.length}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <p className="text-purple-200 text-sm font-semibold mb-1">This Month</p>
                            <p className="text-4xl font-bold text-white">
                                {applications.filter(app => {
                                    const date = new Date(app.submittedAt);
                                    const now = new Date();
                                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <p className="text-purple-200 text-sm font-semibold mb-1">Today</p>
                            <p className="text-4xl font-bold text-white">
                                {applications.filter(app => {
                                    const date = new Date(app.submittedAt);
                                    const now = new Date();
                                    return date.toDateString() === now.toDateString();
                                }).length}
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by student name, parent name, class, or application ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all"
                        />
                    </div>
                </motion.div>

                {/* Applications List */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
                            <GraduationCap className="w-12 h-12 text-purple-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Applications Found</h3>
                        <p className="text-purple-200">
                            {searchTerm ? 'Try adjusting your search terms' : 'No admission applications have been submitted yet.'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredApplications.map((app, index) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedApplication(app)}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                                            {app.studentName}
                                        </h3>
                                        <p className="text-sm text-purple-200">ID: {app.id}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-purple-500/30 rounded-full">
                                        <p className="text-xs font-semibold text-purple-200">{app.classApplyingFor}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-purple-200">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-purple-200">
                                        <User className="w-4 h-4" />
                                        <span>{app.fatherName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-purple-200">
                                        <Phone className="w-4 h-4" />
                                        <span>{app.fatherPhone}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <button className="text-sm font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
                                        View Details →
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Modal for Application Details */}
                {selectedApplication && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedApplication(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedApplication.studentName}</h2>
                                    <p className="text-purple-200">Application ID: {selectedApplication.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Student Information */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-300 mb-3">Student Information</h3>
                                    <div>
                                        <p className="text-sm text-purple-200">Date of Birth</p>
                                        <p className="text-white font-semibold">{selectedApplication.dateOfBirth}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Gender</p>
                                        <p className="text-white font-semibold">{selectedApplication.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Nationality</p>
                                        <p className="text-white font-semibold">{selectedApplication.nationality}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Religion</p>
                                        <p className="text-white font-semibold">{selectedApplication.religion || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Category</p>
                                        <p className="text-white font-semibold">{selectedApplication.category || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Aadhar Number</p>
                                        <p className="text-white font-semibold">{selectedApplication.aadharNumber || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Parent Information */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-300 mb-3">Parent Information</h3>
                                    <div>
                                        <p className="text-sm text-purple-200">Father's Name</p>
                                        <p className="text-white font-semibold">{selectedApplication.fatherName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Father's Occupation</p>
                                        <p className="text-white font-semibold">{selectedApplication.fatherOccupation || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Father's Phone</p>
                                        <p className="text-white font-semibold">{selectedApplication.fatherPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Father's Email</p>
                                        <p className="text-white font-semibold">{selectedApplication.fatherEmail || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Mother's Name</p>
                                        <p className="text-white font-semibold">{selectedApplication.motherName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Mother's Phone</p>
                                        <p className="text-white font-semibold">{selectedApplication.motherPhone}</p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-300 mb-3">Address</h3>
                                    <div>
                                        <p className="text-sm text-purple-200">Full Address</p>
                                        <p className="text-white font-semibold">{selectedApplication.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">City</p>
                                        <p className="text-white font-semibold">{selectedApplication.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">State</p>
                                        <p className="text-white font-semibold">{selectedApplication.state}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">PIN Code</p>
                                        <p className="text-white font-semibold">{selectedApplication.pincode}</p>
                                    </div>
                                </div>

                                {/* Academic & Emergency */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-300 mb-3">Academic & Emergency</h3>
                                    <div>
                                        <p className="text-sm text-purple-200">Class Applying For</p>
                                        <p className="text-white font-semibold">{selectedApplication.classApplyingFor}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Previous School</p>
                                        <p className="text-white font-semibold">{selectedApplication.previousSchool || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Emergency Contact</p>
                                        <p className="text-white font-semibold">{selectedApplication.emergencyContact}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Emergency Phone</p>
                                        <p className="text-white font-semibold">{selectedApplication.emergencyPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-200">Medical Conditions</p>
                                        <p className="text-white font-semibold">{selectedApplication.medicalConditions || 'None'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
