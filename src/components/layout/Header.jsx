import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import NotificationDropdown from './NotificationDropdown';

const Header = ({ title, toggleSidebar }) => {
    const { t } = useLanguage();
    const { isDark } = useTheme();

    return (
        <header className="h-20 px-8 flex items-center justify-between shrink-0 z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className={`
                        md:hidden size-10 flex items-center justify-center rounded-xl border transition-all
                        ${isDark
                            ? 'bg-glass-surface border-glass-border text-slate-300 hover:text-white hover:bg-white/10'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-primary hover:bg-slate-50 shadow-sm'
                        }
                    `}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className={`
                    text-2xl font-bold bg-clip-text text-transparent hidden sm:block
                    ${isDark
                        ? 'bg-gradient-to-l from-white to-slate-400'
                        : 'bg-gradient-to-l from-slate-800 to-slate-500'
                    }
                `}>
                    {t(title)}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group hidden md:block">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className={`material-symbols-outlined group-focus-within:text-primary transition-colors ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>search</span>
                    </div>
                    <input
                        className={`
                            block w-64 pr-10 pl-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all
                            ${isDark
                                ? 'bg-glass-surface border-glass-border placeholder-slate-400 text-white'
                                : 'bg-white border-slate-200 placeholder-slate-400 text-slate-800 shadow-sm'
                            }
                        `}
                        placeholder={t('search')}
                        type="text"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                    <NotificationDropdown />
                </div>
            </div>
        </header>
    );
};

export default Header;
