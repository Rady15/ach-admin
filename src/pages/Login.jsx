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

            <div className="w-full max-w-md p-8 m-4 glass-panel rounded-2xl relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center shadow-glow mb-4">
                        <span className="material-symbols-outlined text-white text-4xl">admin_panel_settings</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">{t('systemManagement')}</h1>
                    <p className="text-slate-400 text-sm">تسجيل الدخول للمتابعة</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-slate-300 text-sm mb-2">البريد الإلكتروني</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dir-ltr"
                                placeholder="name@company.com"
                                required
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-[20px]">mail</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm mb-2">كلمة المرور</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dir-ltr"
                                placeholder="••••••••"
                                required
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-[20px]">lock</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary hover:bg-primary-glow text-white rounded-xl font-medium shadow-glow transition-all transform active:scale-[0.98]"
                    >
                        تسجيل الدخول
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
