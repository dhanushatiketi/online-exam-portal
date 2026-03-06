import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const Result = () => {
    const { email } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await api.get(`/result/${email}`);
                setResult(res.data);
            } catch (err) {
                console.error('Failed to fetch result', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [email]);

    if (loading) return <div className="text-center py-20 text-xl font-medium text-gray-500">Loading Result...</div>;
    if (!result) return <div className="text-center py-20 text-xl font-medium text-gray-500">No result found.</div>;

    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const passed = percentage >= 50;

    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <div className="glass-panel p-12 flex flex-col items-center rounded-[48px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden bg-white/40 border-white/60">
                {/* Decorative Blobs */}
                <div className={`absolute top-[-50px] right-[-50px] w-64 h-64 ${passed ? 'bg-emerald-400' : 'bg-rose-400'} rounded-full mix-blend-soft-light filter blur-3xl opacity-30`}></div>
                <div className={`absolute bottom-[-50px] left-[-50px] w-64 h-64 ${passed ? 'bg-indigo-400' : 'bg-violet-400'} rounded-full mix-blend-soft-light filter blur-3xl opacity-30`}></div>

                <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-2">Performance Report</h2>
                        <div className={`h-1.5 w-24 mx-auto rounded-full ${passed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 w-full mb-12">
                        <div className="glass-panel p-8 rounded-3xl bg-white/60 border-white/80 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Candidate Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Name</p>
                                    <p className="text-xl font-black text-gray-900">{result.studentName}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Subject</p>
                                    <p className="text-xl font-black text-indigo-600">{result.exam}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Date</p>
                                    <p className="text-lg font-bold text-gray-700">{new Date(result.submittedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className={`glass-panel p-8 rounded-3xl bg-white/60 border-white/80 shadow-sm flex flex-col items-center justify-center text-center ${passed ? 'ring-2 ring-emerald-500/20' : 'ring-2 ring-rose-500/20'}`}>
                            <div className="relative w-40 h-40 mb-4 scale-110">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="12" />
                                    <circle cx="80" cy="80" r="72" fill="none" className={passed ? "text-emerald-500" : "text-rose-500"} stroke="currentColor" strokeWidth="12" strokeDasharray="452.39" strokeDashoffset={452.39 - (452.39 * percentage) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-gray-900">{percentage}%</span>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>{passed ? 'Success' : 'Attempted'}</span>
                                </div>
                            </div>
                            <div className={`px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm ${passed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-rose-500 text-white shadow-lg shadow-rose-200'}`}>
                                {passed ? 'Passed' : 'Not Qualified'}
                            </div>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-3 gap-6 mb-12">
                        <div className="glass-panel p-6 rounded-3xl bg-white/60 text-center">
                            <span className="block text-3xl font-black text-emerald-600">{result.score}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Correct</span>
                        </div>
                        <div className="glass-panel p-6 rounded-3xl bg-white/60 text-center">
                            <span className="block text-3xl font-black text-rose-500">{result.totalQuestions - result.score}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Incorrect</span>
                        </div>
                        <div className="glass-panel p-6 rounded-3xl bg-white/60 text-center">
                            <span className="block text-3xl font-black text-gray-900">{result.totalQuestions}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Total</span>
                        </div>
                    </div>

                    {result.answers && result.answers.length > 0 && (
                        <div className="w-full">
                            <div className="flex items-center gap-4 mb-8">
                                <h3 className="text-2xl font-black text-gray-900">Detailed Review</h3>
                                <div className="flex-grow h-px bg-gray-200/50"></div>
                            </div>
                            <div className="space-y-6">
                                {result.answers.map((ans, idx) => (
                                    <div key={idx} className={`p-8 rounded-[32px] border-2 transition-all duration-300 bg-white/40 ${ans.isCorrect ? 'border-emerald-500/20 hover:bg-emerald-50/50' : 'border-rose-500/20 hover:bg-rose-50/50'}`}>
                                        <div className="flex gap-6">
                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black ${ans.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                                                {idx + 1}
                                            </div>
                                            <div className="w-full">
                                                <h4 className="font-bold text-lg text-gray-800 mb-6 leading-tight">{ans.questionText}</h4>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className={`p-4 rounded-2xl ${ans.isCorrect ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Your Selection</span>
                                                        <span className={`font-black ${ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{ans.selectedOption || "Skipped"}</span>
                                                    </div>
                                                    {!ans.isCorrect && (
                                                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Correct Answer</span>
                                                            <span className="font-black text-emerald-700">{ans.correctAnswer}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Link to="/dashboard" className="mt-16 group relative px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl shadow-indigo-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            Explore More Courses
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Result;
