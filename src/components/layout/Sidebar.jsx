import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { t } = useLanguage();
    const { user, logout } = useAuth();
    const { isDark } = useTheme();

    const allNavItems = [
        { icon: 'dashboard', label: 'dashboard', path: '/dashboard', roles: ['admin'] },
        { type: 'divider', label: 'orders', roles: ['admin'] },
        { icon: 'receipt_long', label: 'orders', path: '/orders', roles: ['admin'] },
        { icon: 'task', label: 'myTasks', path: '/my-tasks', roles: ['employee'] },
        // { icon: 'price_change', label: 'pricing', path: '/pricing', roles: ['admin'] },
        { icon: 'payments', label: 'payments', path: '/payments', roles: ['admin'] },
        { icon: 'people', label: 'customers', path: '/customers', roles: ['admin'] },
        { icon: 'badge', label: 'employees', path: '/employees', roles: ['admin'] },
        { type: 'divider', label: 'systemManagement', roles: ['admin'] },
        // { icon: 'analytics', label: 'reports', path: '/reports', roles: ['admin'] },
        { icon: 'settings', label: 'settings', path: '/settings', roles: ['admin', 'employee'] },
    ];

    const navItems = allNavItems.filter(item => {
        if (!user) return false;
        return item.roles?.includes(user.role);
    });

    return (
        <aside className={`
            ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)] md:translate-x-0'} 
            fixed md:static inset-y-0 right-0 w-72 h-[calc(100vh-2rem)] my-4 mr-4 
            flex flex-col rounded-2xl z-50 transition-all duration-300 shrink-0
            ${isDark
                ? 'glass-panel'
                : 'bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-lg shadow-slate-200/50'
            }
        `}>
            {/* Logo Area */}
            <div className={`h-20 flex items-center gap-4 px-6 border-b ${isDark ? 'border-glass-border' : 'border-slate-200/50'}`}>
                <div className="relative size-10 rounded-xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center shadow-glow">
                    <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                </div>
                <div className="flex flex-col">
                    <h1 className={`text-lg font-bold leading-none tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('systemManagement')}</h1>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('adminPanel')}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
                {navItems.map((item, index) => {
                    if (item.type === 'divider') {
                        return (
                            <div key={index} className={`text-xs font-bold px-4 mt-4 mb-1 opacity-60 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t(item.label)}
                            </div>
                        );
                    }
                    return (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
                                ${isActive
                                    ? 'bg-primary/20 text-primary border border-primary/20 shadow-glow'
                                    : isDark
                                        ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                        : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                                }
                            `}
                        >
                            <span className={`material-symbols-outlined ${item.path === '/reports' ? 'group-hover:rotate-90' : ''} transition-transform`}>{item.icon}</span>
                            <span className="font-medium">{t(item.label)}</span>
                        </NavLink>
                    );
                })}

                <button
                    onClick={() => logout && logout()}
                    className={`
                        flex items-center gap-4 px-4 py-3 rounded-xl transition-all group mt-auto w-full text-start
                        ${isDark ? 'text-slate-400 hover:bg-white/5' : 'hover:bg-red-50'}
                    `}
                >
                    <span className="material-symbols-outlined text-red-400/80 group-hover:text-red-500 transition-colors">logout</span>
                    <span className="font-medium text-red-400/80 group-hover:text-red-500">{t('logout')}</span>
                </button>
            </nav>

            {/* User Mini Profile */}
            <div className={`p-4 border-t ${isDark ? 'border-glass-border' : 'border-slate-200/50'}`}>
                <div className={`
                    flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer
                    ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}
                `}>
                    <div className="size-10 rounded-full bg-cover bg-center border border-white/20" style={{ backgroundImage: `url("${user?.avatar || 'https://i.pravatar.cc/150'}")` }}></div>
                    <div className="flex flex-col overflow-hidden">
                        <span className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.name}</span>
                        <span className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t(user?.role)}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
