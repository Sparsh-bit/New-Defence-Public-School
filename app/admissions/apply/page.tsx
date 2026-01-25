'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import SubPageHero from '@/components/SubPageHero';
import PageTransition from '@/components/PageTransition';

interface FormData {
    // Student Information
    studentName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    religion: string;
    category: string;
    aadharNumber: string;

    // Parent/Guardian Information
    fatherName: string;
    fatherOccupation: string;
    fatherPhone: string;
    fatherEmail: string;
    motherName: string;
    motherOccupation: string;
    motherPhone: string;
    motherEmail: string;

    // Address Information
    address: string;
    city: string;
    state: string;
    pincode: string;

    // Academic Information
    classApplyingFor: string;
    previousSchool: string;
    previousClass: string;

    // Additional Information
    medicalConditions: string;
    emergencyContact: string;
    emergencyPhone: string;
}

export default function ApplicationForm() {
    const [formData, setFormData] = useState<FormData>({
        studentName: '',
        dateOfBirth: '',
        gender: '',
        nationality: 'Indian',
        religion: '',
        category: '',
        aadharNumber: '',
        fatherName: '',
        fatherOccupation: '',
        fatherPhone: '',
        fatherEmail: '',
        motherName: '',
        motherOccupation: '',
        motherPhone: '',
        motherEmail: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        classApplyingFor: '',
        previousSchool: '',
        previousClass: '',
        medicalConditions: '',
        emergencyContact: '',
        emergencyPhone: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/admissions/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    submittedAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit application');
            }

            setSubmitStatus('success');

            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({
                    studentName: '',
                    dateOfBirth: '',
                    gender: '',
                    nationality: 'Indian',
                    religion: '',
                    category: '',
                    aadharNumber: '',
                    fatherName: '',
                    fatherOccupation: '',
                    fatherPhone: '',
                    fatherEmail: '',
                    motherName: '',
                    motherOccupation: '',
                    motherPhone: '',
                    motherEmail: '',
                    address: '',
                    city: '',
                    state: '',
                    pincode: '',
                    classApplyingFor: '',
                    previousSchool: '',
                    previousClass: '',
                    medicalConditions: '',
                    emergencyContact: '',
                    emergencyPhone: '',
                });
                setSubmitStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-white border border-[#0A1628]/10 rounded-lg focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 outline-none transition-all duration-200";
    const labelClasses = "block text-sm font-semibold text-[#0A1628] mb-2";

    return (
        <main>
            <SubPageHero
                title="Admission Application"
                subtitle="Begin your journey to excellence"
                breadcrumb="Apply Now"
            />

            <section className="py-20 bg-gradient-to-b from-white to-[#F8F9FA]">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-[48px] shadow-2xl border border-[#0A1628]/5 p-8 md:p-12"
                    >
                        {/* Student Information */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-display font-black text-[#0A1628] mb-1">
                                Student Information
                            </h2>
                            <div className="h-1 w-20 bg-[#FFD700] mb-8"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="Enter student's full name"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Date of Birth <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Gender <span className="text-red-500">*</span></label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClasses}>Nationality <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Religion</label>
                                    <input
                                        type="text"
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter religion"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="General">General</option>
                                        <option value="OBC">OBC</option>
                                        <option value="SC">SC</option>
                                        <option value="ST">ST</option>
                                        <option value="EWS">EWS</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Aadhar Number</label>
                                    <input
                                        type="text"
                                        name="aadharNumber"
                                        value={formData.aadharNumber}
                                        onChange={handleChange}
                                        maxLength={12}
                                        className={inputClasses}
                                        placeholder="Enter 12-digit Aadhar number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Parent/Guardian Information */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-display font-black text-[#0A1628] mb-1">
                                Parent/Guardian Information
                            </h2>
                            <div className="h-1 w-20 bg-[#FFD700] mb-8"></div>

                            {/* Father's Details */}
                            <h3 className="text-xl font-semibold text-[#0A1628] mb-4">Father's Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className={labelClasses}>Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={formData.fatherName}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="Father's name"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Occupation</label>
                                    <input
                                        type="text"
                                        name="fatherOccupation"
                                        value={formData.fatherOccupation}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Occupation"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Phone <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="fatherPhone"
                                        value={formData.fatherPhone}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="Contact number"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Email</label>
                                    <input
                                        type="email"
                                        name="fatherEmail"
                                        value={formData.fatherEmail}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>

                            {/* Mother's Details */}
                            <h3 className="text-xl font-semibold text-[#0A1628] mb-4">Mother's Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="motherName"
                                        value={formData.motherName}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="Mother's name"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Occupation</label>
                                    <input
                                        type="text"
                                        name="motherOccupation"
                                        value={formData.motherOccupation}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Occupation"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Phone <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="motherPhone"
                                        value={formData.motherPhone}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="Contact number"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Email</label>
                                    <input
                                        type="email"
                                        name="motherEmail"
                                        value={formData.motherEmail}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-display font-black text-[#0A1628] mb-1">
                                Address Information
                            </h2>
                            <div className="h-1 w-20 bg-[#FFD700] mb-8"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Full Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className={inputClasses + " resize-none"}
                                        placeholder="House number, street, locality"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>City <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="City name"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>State <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="State name"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClasses}>PIN Code <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        required
                                        maxLength={6}
                                        className={inputClasses}
                                        placeholder="6-digit PIN code"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-display font-black text-[#0A1628] mb-1">
                                Academic Information
                            </h2>
                            <div className="h-1 w-20 bg-[#FFD700] mb-8"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Class Applying For <span className="text-red-500">*</span></label>
                                    <select
                                        name="classApplyingFor"
                                        value={formData.classApplyingFor}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    >
                                        <option value="">Select Class</option>
                                        <option value="Nursery">Nursery</option>
                                        <option value="LKG">LKG</option>
                                        <option value="UKG">UKG</option>
                                        <option value="Class 1">Class 1</option>
                                        <option value="Class 2">Class 2</option>
                                        <option value="Class 3">Class 3</option>
                                        <option value="Class 4">Class 4</option>
                                        <option value="Class 5">Class 5</option>
                                        <option value="Class 6">Class 6</option>
                                        <option value="Class 7">Class 7</option>
                                        <option value="Class 8">Class 8</option>
                                        <option value="Class 9">Class 9</option>
                                        <option value="Class 10">Class 10</option>
                                        <option value="Class 11">Class 11</option>
                                        <option value="Class 12">Class 12</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClasses}>Previous Class</label>
                                    <input
                                        type="text"
                                        name="previousClass"
                                        value={formData.previousClass}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Last class attended"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Previous School Name</label>
                                    <input
                                        type="text"
                                        name="previousSchool"
                                        value={formData.previousSchool}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Name of previous school"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-display font-black text-[#0A1628] mb-1">
                                Additional Information
                            </h2>
                            <div className="h-1 w-20 bg-[#FFD700] mb-8"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Medical Conditions (if any)</label>
                                    <textarea
                                        name="medicalConditions"
                                        value={formData.medicalConditions}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputClasses + " resize-none"}
                                        placeholder="Any allergies, medical conditions, or special needs"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Emergency Contact Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="Emergency contact person"
                                    />
                                </div>

                                <div>
                                    <label className={labelClasses}>Emergency Phone <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="emergencyPhone"
                                        value={formData.emergencyPhone}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="Emergency contact number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col items-center gap-4 pt-6">
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : submitStatus === 'success'
                                        ? 'bg-green-600 text-white'
                                        : submitStatus === 'error'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-[#FFD700] text-[#0A1628] hover:bg-[#FFC700] shadow-[#FFD700]/30'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting Application...
                                    </span>
                                ) : submitStatus === 'success' ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Application Submitted Successfully!
                                    </span>
                                ) : submitStatus === 'error' ? (
                                    'Submission Failed - Please Try Again'
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-5 h-5" />
                                        Submit Application
                                    </span>
                                )}
                            </motion.button>

                            {submitStatus === 'success' && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-green-600 font-semibold text-center max-w-md"
                                >
                                    Thank you for your application! We have received your information and will contact you soon.
                                </motion.p>
                            )}

                            {submitStatus === 'error' && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-600 font-semibold text-center max-w-md"
                                >
                                    There was an error submitting your application. Please try again or contact us directly.
                                </motion.p>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone</p>
                                    <a href="tel:+919412362584" className="text-gray-900 hover:text-[#FFD700] font-black text-lg transition-colors block">
                                        +91 9412362584
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">+91 9412158024</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</p>
                                    <a href="mailto:newdefence@yahoo.co.in" className="text-gray-900 hover:text-[#FFD700] font-black text-lg transition-colors block">
                                        newdefence@yahoo.co.in
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">Official Inquiries & Admissions</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Campus</p>
                                    <p className="text-gray-900 font-black text-lg">103-104, Raghuvirpuram</p>
                                    <p className="text-sm text-gray-500 mt-1">Shahganj, Agra - 282010</p>
                                </div>
                            </div>
                        </div>
                    </motion.form>
                </div>
            </section>
        </main>
    );
}
