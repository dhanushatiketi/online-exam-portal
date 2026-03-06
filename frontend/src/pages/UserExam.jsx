import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserExam = () => {
    const { examName } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [warnings, setWarnings] = useState(0);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/questions');
                const examQuestions = res.data.filter(q => q.examName === examName);
                setQuestions(examQuestions);
            } catch (err) {
                console.error('Failed to fetch questions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarnings(prev => {
                    const newWarnings = prev + 1;
                    alert(`Warning: Tab switching is not allowed. Warning ${newWarnings}/3`);
                    if (newWarnings >= 3) {
                        handleSubmit();
                    }
                    return newWarnings;
                });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(timerRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [examName]);

    const handleOptionSelect = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        clearInterval(timerRef.current);
        const answersArray = Object.keys(answers).map(qId => ({
            questionId: qId,
            selectedOption: answers[qId]
        }));

        try {
            await api.post('/submitExam', { answers: answersArray, examName });
            const user = JSON.parse(localStorage.getItem('user'));
            navigate(`/result/${encodeURIComponent(user.email)}`);
        } catch (err) {
            console.error('Failed to submit exam:', err);
            alert('Failed to submit exam. Please try again.');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return <div className="text-center py-20 text-xl font-medium text-indigo-200">Loading Premium Exam...</div>;
    if (questions.length === 0) return <div className="text-center py-20 text-xl font-medium text-indigo-200">No questions found for {examName}.</div>;

    const completedCount = Object.keys(answers).length;
    const progressPercent = questions.length > 0 ? (completedCount / questions.length) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 relative">
            {/* Header / StatusBar */}
            <div className="glass-panel bg-white/50 rounded-3xl p-8 mb-10 sticky top-6 z-30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-2xl border-white/60">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{examName}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Examination in Progress</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex flex-col items-center px-6 py-3 rounded-2xl border transition-all duration-300 ${timeLeft < 60 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                            <span className="text-xs font-black uppercase tracking-widest opacity-60">Time Remaining</span>
                            <span className="text-2xl font-black font-mono">{formatTime(timeLeft)}</span>
                        </div>

                        {warnings > 0 && (
                            <div className="flex flex-col items-center px-6 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 animate-bounce">
                                <span className="text-xs font-black uppercase tracking-widest opacity-60">Warnings</span>
                                <span className="text-2xl font-black">{warnings}/3</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-black inline-block py-1 px-3 uppercase rounded-full text-indigo-600 bg-indigo-100 ring-1 ring-indigo-200">
                                Progress
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-black inline-block text-indigo-600">
                                {Math.round(progressPercent)}% Complete
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-indigo-100 ring-1 ring-indigo-200/50">
                        <div
                            style={{ width: `${progressPercent}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                        ></div>
                    </div>
                </div>
            </div>

            <div className="space-y-8 relative z-10">
                {questions.map((q, index) => (
                    <div key={q._id} className={`group glass-panel p-10 rounded-[40px] transition-all duration-500 bg-white/40 border-white/60 hover:border-indigo-400/50 hover:bg-white/60 ${answers[q._id] ? 'ring-2 ring-indigo-500/20' : ''}`}>
                        <div className="flex gap-6 mb-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 transition-colors duration-300 ${answers[q._id] ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-indigo-600 shadow-sm border border-indigo-50'}`}>
                                {index + 1}
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 leading-tight pt-2">
                                {q.questionText}
                            </h3>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {q.options.map((opt, i) => {
                                const isSelected = answers[q._id] === opt;
                                return (
                                    <label key={i} className={`relative flex items-center p-6 rounded-3xl cursor-pointer transition-all duration-300 border-2 ${isSelected ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-100/50 scale-[1.02] z-10' : 'border-white/50 bg-white/30 hover:bg-white/80 hover:border-indigo-200 hover:scale-[1.01] opacity-80 hover:opacity-100'}`}>
                                        <input
                                            type="radio"
                                            name={`question-${q._id}`}
                                            value={opt}
                                            checked={isSelected}
                                            onChange={() => handleOptionSelect(q._id, opt)}
                                            className="hidden"
                                        />
                                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors duration-300 ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </div>
                                        <span className={`text-lg font-bold transition-colors duration-300 ${isSelected ? 'text-indigo-900' : 'text-gray-600'}`}>{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 flex justify-center pb-20 relative z-10">
                <button
                    onClick={handleSubmit}
                    className="group relative px-16 py-6 bg-gray-900 text-white font-black text-xl rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center gap-3">
                        Submit Examination
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default UserExam;
