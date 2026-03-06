import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', rollno: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-[90vh] w-full px-4">
            <div className="w-full max-w-md glass-panel rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 relative overflow-hidden bg-white/40 border-white/40">
                {/* Decorative blobs for premium feel */}
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-teal-400 rounded-full mix-blend-soft-light filter blur-2xl opacity-60 animate-blob"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-emerald-400 rounded-full mix-blend-soft-light filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>

                <div className="relative z-10 w-full">
                    <h2 className="text-4xl font-black text-center text-gray-900 mb-2 tracking-tight">Create Account</h2>
                    <p className="text-gray-600 text-center mb-8 font-medium opacity-70 border-b border-gray-200/50 pb-4">Join for a premium experience</p>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-2xl mb-6 text-center text-sm font-semibold animate-shake">
                            {error}
                        </div>
                    )}

                    {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-2xl mb-6 text-center text-sm font-semibold">Registration successful! Redirecting...</div>}

                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-1 group">
                            <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider group-focus-within:text-teal-600">Full Name</label>
                            <input type="text" name="name" required onChange={handleChange}
                                className="w-full px-5 py-3 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 text-gray-900 placeholder-gray-400 backdrop-blur-md transition-all outline-none shadow-sm"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-1 group">
                            <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider group-focus-within:text-teal-600">Roll Number</label>
                            <input type="text" name="rollno" required onChange={handleChange}
                                className="w-full px-5 py-3 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 text-gray-900 placeholder-gray-400 backdrop-blur-md transition-all outline-none shadow-sm"
                                placeholder="123456"
                            />
                        </div>
                        <div className="space-y-1 group">
                            <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider group-focus-within:text-teal-600">Email Address</label>
                            <input type="email" name="email" required onChange={handleChange}
                                className="w-full px-5 py-3 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 text-gray-900 placeholder-gray-400 backdrop-blur-md transition-all outline-none shadow-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="space-y-1 group">
                            <label className="block text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider group-focus-within:text-teal-600">Password</label>
                            <input type="password" name="password" required onChange={handleChange}
                                className="w-full px-5 py-3 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 text-gray-900 placeholder-gray-400 backdrop-blur-md transition-all outline-none shadow-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit"
                            className="w-full py-4 px-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white font-bold rounded-2xl hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)] focus:ring-4 focus:ring-teal-500/30 transform transition-all duration-300 hover:-translate-y-1 mt-4 text-lg tracking-wide uppercase shadow-lg shadow-teal-500/20"
                        >
                            Sign Up Now
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
                        <p className="text-sm text-gray-600 font-medium">
                            Already have an account? <Link to="/login" className="text-teal-600 font-bold hover:text-teal-800 hover:underline underline-offset-4 transition-all">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
