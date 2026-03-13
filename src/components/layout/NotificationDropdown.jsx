import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const BellIcon = ({ hasUnread }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        {hasUnread && <circle cx="18" cy="5" r="3" fill="#ef4444" stroke="none" />}
    </svg>
);

const getTypeStyles = (type, isDark) => {
    switch (type?.toLowerCase()) {
        case 'success':
            return {
                icon: 'text-green-500 bg-green-500/10',
                border: 'border-green-500/20',
                bg: isDark ? 'bg-green-500/5' : 'bg-green-50'
            };
        case 'error':
            return {
                icon: 'text-red-500 bg-red-500/10',
                border: 'border-red-500/20',
                bg: isDark ? 'bg-red-500/5' : 'bg-red-50'
            };
        case 'warning':
            return {
                icon: 'text-amber-500 bg-amber-500/10',
                border: 'border-amber-500/20',
                bg: isDark ? 'bg-amber-500/5' : 'bg-amber-50'
            };
        case 'order':
            return {
                icon: 'text-blue-500 bg-blue-500/10',
                border: 'border-blue-500/20',
                bg: isDark ? 'bg-blue-500/5' : 'bg-blue-50'
            };
        case 'payment':
            return {
                icon: 'text-emerald-500 bg-emerald-500/10',
                border: 'border-emerald-500/20',
                bg: isDark ? 'bg-emerald-500/5' : 'bg-emerald-50'
            };
        case 'user':
            return {
                icon: 'text-purple-500 bg-purple-500/10',
                border: 'border-purple-500/20',
                bg: isDark ? 'bg-purple-500/5' : 'bg-purple-50'
            };
        default:
            return {
                icon: 'text-sky-500 bg-sky-500/10',
                border: 'border-sky-500/20',
                bg: isDark ? 'bg-sky-500/5' : 'bg-sky-50'
            };
    }
};

const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'success':
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
        case 'error':
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        case 'warning':
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        case 'order':
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            );
        case 'payment':
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'user':
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            );
        default:
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }
};

const NotificationDropdown = () => {
    const { notifications, unreadCount, dismissNotification, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const { t, isRTL } = useLanguage();
    const { isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (seconds < 10) return t('justNow');
        if (seconds < 60) return `${seconds}s ${t('ago')}`;
        if (minutes < 60) return `${minutes}m ${t('ago')}`;
        if (hours < 24) return `${hours}h ${t('ago')}`;
        return `${days}d ${t('ago')}`;
    };

    const handleNotificationClick = (notif) => {
        if (!notif.isRead) {
            markAsRead(notif.id);
        }
        if (notif.onClick) {
            notif.onClick();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    size-10 flex items-center justify-center rounded-xl border transition-all relative
                    ${isDark
                        ? 'bg-glass-surface border-glass-border text-slate-300 hover:text-white hover:bg-white/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-primary hover:bg-slate-50 shadow-sm'
                    }
                `}
            >
                <BellIcon hasUnread={unreadCount > 0} />
                {unreadCount > 0 && (
                    <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1`}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={`
                    absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 rounded-2xl border shadow-xl z-50 max-h-[70vh] flex flex-col
                    ${isDark
                        ? 'bg-glass-surface border-glass-border'
                        : 'bg-white border-slate-200'
                    }
                `}>
                    <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {t('notifications')}
                        </h3>
                        <div className="flex items-center gap-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                                    title={t('clearAll')}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary hover:text-primary-glow transition-colors"
                                >
                                    {t('markAllRead')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[60vh]">
                        {notifications.length === 0 ? (
                            <div className={`flex flex-col items-center justify-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p className="text-sm">{t('noNotifications')}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200 dark:divide-white/10">
                                {notifications.map((notif) => {
                                    const styles = getTypeStyles(notif.type, isDark);
                                    return (
                                        <div
                                            key={notif.id}
                                            className={`
                                                p-4 transition-all cursor-pointer relative group
                                                ${!notif.isRead ? styles.bg : ''}
                                                ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}
                                            `}
                                            onClick={() => handleNotificationClick(notif)}
                                        >
                                            {!notif.isRead && (
                                                <div className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary`} />
                                            )}
                                            <div className="flex gap-3">
                                                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${styles.icon} border ${styles.border}`}>
                                                    {getTypeIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                        {notif.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            {formatTime(notif.createdAt)}
                                                        </span>
                                                        {notif.metadata?.status && (
                                                            <span className={`
                                                                text-[10px] px-2 py-0.5 rounded-full font-medium uppercase
                                                                ${notif.metadata.status === 'completed' ? 'bg-green-500/10 text-green-600' : ''}
                                                                ${(notif.metadata.status === 'pending' || notif.metadata.status === 'underreview') ? 'bg-amber-500/10 text-amber-600' : ''}
                                                                ${notif.metadata.status === 'in-progress' ? 'bg-blue-500/10 text-blue-600' : ''}
                                                                ${notif.metadata.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : ''}
                                                            `}>
                                                                {notif.metadata.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dismissNotification(notif.id);
                                                    }}
                                                    className={`
                                                        shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all opacity-0 group-hover:opacity-100
                                                        ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}
                                                    `}
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className={`px-4 py-2 border-t text-center ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {notifications.length} {t('notifications')}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
