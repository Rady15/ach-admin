import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="h-10 px-3 flex items-center justify-center rounded-xl bg-glass-surface border border-glass-border text-slate-300 hover:text-white hover:bg-white/10 transition-all font-display font-bold"
        >
            {language === 'ar' ? 'EN' : 'عربي'}
        </button>
    );
};

export default LanguageToggle;
