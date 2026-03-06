import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Usually we would fetch distinct exams from the backend. 
        // Here we'll hardcode some sample exams or try to fetch from questions
        const mockExams = [
            { id: 1, name: 'Cloud Computing' },
            { id: 2, name: 'AWS Certified Solutions Architect' },
            { id: 3, name: 'JavaScript Fundamentals' }
        ];
        setExams(mockExams);
    }, []);

    const handleStartExam = (examName) => {
        navigate(`/exam/${encodeURIComponent(examName)}`);
    };

    const themes = {
        'Cloud Computing': {
            bg: 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20',
            border: 'border-blue-400/30',
            accent: 'from-blue-500 to-indigo-600',
            text: 'text-blue-700',
            glow: 'shadow-blue-500/20'
        },
        'AWS Certified Solutions Architect': {
            bg: 'bg-gradient-to-br from-orange-400/20 to-amber-600/20',
            border: 'border-orange-400/30',
            accent: 'from-orange-500 to-amber-600',
            text: 'text-orange-700',
            glow: 'shadow-orange-500/20'
        },
        'JavaScript Fundamentals': {
            bg: 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20',
            border: 'border-yellow-400/30',
            accent: 'from-yellow-400 to-orange-500',
            text: 'text-yellow-700',
            glow: 'shadow-yellow-500/20'
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-16 px-4">
            <div className="mb-16 text-center">
                <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-gray-900">
                    Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Learning Path</span>
                </h2>
                <p className="text-gray-600 text-xl font-medium max-w-2xl mx-auto opacity-80">
                    Empower your future with industry-leading certifications. Choose your challenge below and start excellence.
                </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 relative">
                {exams.map(exam => {
                    const theme = themes[exam.name] || themes['Cloud Computing'];
                    return (
                        <div key={exam.id} className={`group relative glass-panel rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] bg-white/40 border-white/50`}>
                            {/* Animated Background Glow */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${theme.accent} rounded-[32px] blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>

                            <div className={`h-48 ${theme.bg} flex flex-col items-center justify-center p-8 relative overflow-hidden`}>
                                {/* Abstract Shapes */}
                                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700 delay-100"></div>

                                <div className={`w-16 h-16 rounded-2xl bg-white/80 shadow-lg flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform duration-500`}>
                                    <span className={`text-2xl font-black ${theme.text}`}>{exam.name.charAt(0)}</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 text-center z-10 leading-tight">{exam.name}</h3>
                            </div>

                            <div className="p-8 relative">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Questions</span>
                                        <span className="text-lg font-black text-gray-800">15 Items</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duration</span>
                                        <span className="text-lg font-black text-gray-800">30 Min</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleStartExam(exam.name)}
                                    className={`w-full py-4 px-6 bg-gradient-to-r ${theme.accent} text-white font-black rounded-2xl shadow-xl ${theme.glow} hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-wider text-sm flex items-center justify-center gap-2`}
                                >
                                    Begin Challenge
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
