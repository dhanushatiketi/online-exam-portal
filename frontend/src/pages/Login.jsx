import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] w-full px-4">
            <div className="w-full max-w-md glass-panel rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 relative overflow-hidden bg-white/40 border-white/40">
                {/* Decorative blobs for premium feel */}
                <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-indigo-400 rounded-full mix-blend-soft-light filter blur-2xl opacity-60 animate-blob"></div>
                <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-purple-400 rounded-full mix-blend-soft-light filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-center text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-600 text-center mb-10 font-medium opacity-70">Enter your details to continue</p>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-2xl mb-8 text-center text-sm font-semibold animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5 group">
                            <label className="block text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-indigo-600">Email Address</label>
                            <div className="relative">
                                <input type="email" name="email" required onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 placeholder-gray-400 backdrop-blur-md transition-all outline-none shadow-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5 group">
                            <label className="block text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-indigo-600">Password</label>
                            <div className="relative">
                                <input type="password" name="password" required onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 placeholder-gray-400 backdrop-blur-md transition-all outline-none shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button type="submit"
                            className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:shadow-[0_10px_30px_rgba(79,70,229,0.4)] focus:ring-4 focus:ring-indigo-500/30 transform transition-all duration-300 hover:-translate-y-1 mt-6 text-lg tracking-wide uppercase shadow-lg shadow-indigo-500/20"
                        >
                            Log In Securely
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-200/50 text-center">
                        <p className="text-sm text-gray-600 font-medium">
                            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline underline-offset-4 transition-all">Register Here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
