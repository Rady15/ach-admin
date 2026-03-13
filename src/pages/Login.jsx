import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            const errorKey = result.errorKey || 'loginError';
            setError(t(errorKey));
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background-dark relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[140px] mix-blend-screen"></div>

            <div className="w-full max-w-4xl lg:max-w-6xl mx-4 lg:mx-8 flex flex-col lg:flex-row items-center lg:items-stretch gap-12 p-8 glass-panel rounded-3xl relative z-10">
                {/* Logo Section - Left */}
                <div className="flex flex-col items-center lg:items-start gap-6 text-center lg:text-left flex-shrink-0 lg:w-1/2">
                    <img src="/ach.svg" alt="ACH Logo" className="h-40 w-120 lg:h-80 lg:w-120 " />
                </div>

                {/* Form Section - Right */}
                <div className="w-full lg:w-1/2 max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-lg font-medium text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-slate-300 text-lg font-semibold mb-3">البريد الإلكتروني</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-glass-border rounded-2xl text-white text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all dir-ltr shadow-glow"
                                    placeholder="name@company.com"
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">mail</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-300 text-lg font-semibold mb-3">كلمة المرور</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-glass-border rounded-2xl text-white text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all dir-ltr shadow-glow"
                                    placeholder="••••••••"
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">lock</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-primary to-neon-purple hover:from-primary hover:to-primary-dark text-white rounded-2xl text-xl font-bold shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            تسجيل الدخول
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

