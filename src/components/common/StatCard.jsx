import React from 'react';
import GlassPanel from './GlassPanel';
import { useLanguage } from '../../contexts/LanguageContext';

const StatCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
    const { t } = useLanguage();

    const colorMap = {
        primary: 'text-primary bg-primary/20',
        success: 'text-success bg-success/20',
        warning: 'text-warning bg-warning/20',
        info: 'text-info bg-info/20',
        danger: 'text-danger bg-danger/20',
    };

    const trendColor = trend === 'up' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';
    const iconColorClass = colorMap[color] || colorMap.primary;

    return (
        <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${iconColorClass}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {trendValue && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border font-numbers ${trendColor}`}>
                        {trend === 'up' ? '+' : '-'}{trendValue}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{t(title)}</p>
                <h3 className={`text-2xl font-bold font-numbers tracking-tight text-white group-hover:text-${color}-glow transition-colors`}>
                    {value}
                </h3>
            </div>
        </GlassPanel>
    );
};

export default StatCard;
