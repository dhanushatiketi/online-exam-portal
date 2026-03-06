import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserExam from './pages/UserExam';
import Result from './pages/Result';

const Home = () => (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Online Examination Portal</span></h1>
        <p className="mt-5 text-xl text-gray-600 max-w-2xl font-light leading-relaxed">A secure, scalable platform to take your cloud exams with realtime monitoring and instant results.</p>
        <div className="mt-12 flex gap-6">
            <Link to="/login" className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300">Log In</Link>
            <Link to="/register" className="px-8 py-3.5 bg-white/70 text-indigo-700 font-semibold rounded-xl shadow-sm border border-indigo-100 hover:bg-white transition-all backdrop-blur-sm">Register</Link>
        </div>
    </div>
);

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav className="glass-panel w-full sticky top-0 z-50 border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ExamCloud</Link>
                    </div>
                    <div className="flex items-center flex-shrink-0 space-x-6">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors tracking-wide">Dashboard</Link>
                                <div className="flex items-center gap-4 ml-4 pl-6 border-l border-gray-200/60">
                                    <span className="text-sm text-gray-500 font-medium tracking-wide">Hi, <span className="text-gray-900">{user.name}</span></span>
                                    <button onClick={logout} className="text-rose-600 hover:text-white font-medium transition-all duration-300 text-sm bg-rose-50 hover:bg-rose-500 px-4 py-2 rounded-xl shadow-sm">Logout</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors tracking-wide">Login</Link>
                                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};



const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (user === undefined) return null; // let context initialize
    return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    return (
        <Router>
            <div className="min-h-screen w-full flex flex-col font-sans text-gray-900 bg-transparent">
                <Navbar />
                <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/exam/:examName" element={<ProtectedRoute><UserExam /></ProtectedRoute>} />
                        <Route path="/result/:email" element={<ProtectedRoute><Result /></ProtectedRoute>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}
