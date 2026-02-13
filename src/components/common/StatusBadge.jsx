import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const StatusBadge = ({ status }) => {
    const { t } = useLanguage();

    const statusMap = {
        active: 'text-success bg-success/10 border-success/20',
        completed: 'text-success bg-success/10 border-success/20',
        paid: 'text-success bg-success/10 border-success/20',

        pending: 'text-warning bg-warning/10 border-warning/20',
        processing: 'text-info bg-info/10 border-info/20',
        busy: 'text-warning bg-warning/10 border-warning/20',

        cancelled: 'text-danger bg-danger/10 border-danger/20',
        inactive: 'text-danger bg-danger/10 border-danger/20',
        unpaid: 'text-danger bg-danger/10 border-danger/20',
        offline: 'text-slate-400 bg-slate-500/10 border-slate-500/20',

        available: 'text-success bg-success/10 border-success/20',
    };

    const colorClass = statusMap[status] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';

    return (
        <span className={`px-3 py-1 rounded-full border text-xs ${colorClass}`}>
            {t(status)}
        </span>
    );
};

export default StatusBadge;
