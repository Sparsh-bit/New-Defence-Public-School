'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PortalLogin() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple authentication check
        if (username === 'admin' && password === 'admin') {
            // Store login state in localStorage
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminLoginTime', new Date().toISOString());

            // Redirect to admin dashboard
            setTimeout(() => {
                router.push('/admissions/admin');
            }, 500);
        } else {
            setError('Invalid username or password');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center px-4 py-12">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-2xl"
                    >
                        <Shield className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Admission Portal
                    </h1>
                    <p className="text-blue-200">
                        New Defence Public School - Admin Access
                    </p>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-white font-semibold mb-2 text-sm">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 outline-none transition-all"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-white font-semibold mb-2 text-sm">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 outline-none transition-all"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Login Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all duration-300 ${loading
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    Logging in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <LogIn className="w-5 h-5" />
                                    Login to Portal
                                </span>
                            )}
                        </motion.button>
                    </form>

                    {/* Info Text */}
                    <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-center text-blue-200 text-sm">
                            This portal is for authorized administrators only.
                            <br />
                            Unauthorized access is strictly prohibited.
                        </p>
                    </div>
                </motion.div>

                {/* Back to Home Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                >
                    <Link
                        href="/"
                        className="text-blue-300 hover:text-white transition-colors text-sm font-semibold"
                    >
                        ← Back to Home
                    </Link>
                </motion.div>
            </motion.div>

            <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}
