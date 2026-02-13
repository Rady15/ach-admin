import React, { useEffect, useState } from 'react';
import GlassPanel from '../components/common/GlassPanel';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { paymentsAPI } from '../services/api';

const Payments = () => {
    const { t } = useLanguage();
    const { isDark } = useTheme();
    const { payments, fetchData } = useData();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        successfulPayments: 0,
        pendingPayments: 0,
        failedPayments: 0
    });

    useEffect(() => {
        const fetchPaymentsData = async () => {
            try {
                setLoading(true);
                // Fetch payments stats
                const statsRes = await paymentsAPI.getPaymentsStats();
                setStats(statsRes.data);
            } catch (error) {
                console.error("Failed to fetch payments data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentsData();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('payments')}</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Card 1 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-success/20 text-success">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalRevenue')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-success transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{loading ? '...' : stats.totalRevenue.toLocaleString()} {t('sar')}</h3>
                    </div>
                </GlassPanel>

                {/* Stat Card 2 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-success/20 text-success">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('successfulPayments')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-success transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{loading ? '...' : stats.successfulPayments}</h3>
                    </div>
                </GlassPanel>

                {/* Stat Card 3 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-warning/20 text-warning">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('pendingPayments')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-warning transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{loading ? '...' : stats.pendingPayments}</h3>
                    </div>
                </GlassPanel>

                {/* Stat Card 4 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-danger/20 text-danger">
                            <span className="material-symbols-outlined">cancel</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('failedPayments')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-danger transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{loading ? '...' : stats.failedPayments}</h3>
                    </div>
                </GlassPanel>
            </div>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <GlassPanel className="p-6">
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('paymentsSummary')}</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-success/10 rounded-xl">
                            <div>
                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('paymentsThisMonth')}</p>
                                <p className={`text-xl font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{loading ? '...' : stats.totalRevenue.toLocaleString()} {t('sar')}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-info/10 rounded-xl">
                            <div>
                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('successfulPayments')}</p>
                                <p className={`text-xl font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{loading ? '...' : stats.successfulPayments}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-warning/10 rounded-xl">
                            <div>
                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('pendingPayments')}</p>
                                <p className={`text-xl font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{loading ? '...' : stats.pendingPayments.toLocaleString()} {t('sar')}</p>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 md:col-span-2">
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('paymentsAnalysis')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('paymentRate')}</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t('successful')}</span>
                                        <span className="text-success font-numbers">{loading ? '...' : Math.round((stats.successfulPayments / (stats.successfulPayments + stats.pendingPayments + stats.failedPayments)) * 100)}%</span>
                                    </div>
                                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                        <div className="bg-success h-2 rounded-full" style={{ width: loading ? '0%' : `${Math.round((stats.successfulPayments / (stats.successfulPayments + stats.pendingPayments + stats.failedPayments)) * 100)}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t('pending')}</span>
                                        <span className="text-warning font-numbers">{loading ? '...' : Math.round((stats.pendingPayments / (stats.successfulPayments + stats.pendingPayments + stats.failedPayments)) * 100)}%</span>
                                    </div>
                                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                        <div className="bg-warning h-2 rounded-full" style={{ width: loading ? '0%' : `${Math.round((stats.pendingPayments / (stats.successfulPayments + stats.pendingPayments + stats.failedPayments)) * 100)}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t('failed')}</span>
                                        <span className="text-danger font-numbers">{loading ? '...' : Math.round((stats.failedPayments / (stats.successfulPayments + stats.pendingPayments + stats.failedPayments)) * 100)}%</span>
                                    </div>
                                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                        <div className="bg-danger h-2 rounded-full" style={{ width: loading ? '0%' : `${Math.round((stats.failedPayments / (stats.successfulPayments + stats.pendingPayments + stats.failedPayments)) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('paymentMethods')}</h4>
                            <div className="space-y-3">
                                {payments.length > 0 ? (
                                    <>
                                        {(() => {
                                            const methodCounts = payments.reduce((acc, payment) => {
                                                acc[payment.method] = (acc[payment.method] || 0) + 1;
                                                return acc;
                                            }, {});
                                            const total = payments.length;
                                            const methods = Object.entries(methodCounts).map(([method, count]) => ({
                                                method,
                                                count,
                                                percentage: Math.round((count / total) * 100)
                                            }));
                                            return methods.map((item, idx) => (
                                                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-primary text-sm">payment</span>
                                                        </div>
                                                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{t(item.method)}</span>
                                                    </div>
                                                    <span className={`font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.percentage}%</span>
                                                </div>
                                            ));
                                        })()}
                                    </>
                                ) : (
                                    <div className={`text-center py-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {t('noData')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* Payment Actions */}
            <GlassPanel className="p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('paymentActions')}</h3>
                    <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-success text-white rounded-xl text-sm font-medium hover:bg-success-dark transition-all shadow-glow">
                            {t('addPayment')}
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow">
                            {t('claimPayment')}
                        </button>
                        <button className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-glass-border' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}>
                            {t('exportReports')}
                        </button>
                    </div>
                </div>
            </GlassPanel>

            {/* Payments Table */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('paymentsList')}</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow">
                            {t('export')}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`text-right text-sm border-b ${isDark ? 'text-slate-400 border-glass-border' : 'text-slate-500 border-slate-200'}`}>
                                <th className="pb-3 px-4 font-medium">{t('number')}</th>
                                <th className="pb-3 px-4 font-medium">{t('customer')}</th>
                                <th className="pb-3 px-4 font-medium">{t('service')}</th>
                                <th className="pb-3 px-4 font-medium">{t('amount')}</th>
                                <th className="pb-3 px-4 font-medium">{t('method')}</th>
                                <th className="pb-3 px-4 font-medium">{t('status')}</th>
                                <th className="pb-3 px-4 font-medium">{t('date')}</th>
                                <th className="pb-3 px-4 font-medium">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {payments.length > 0 ? (
                                payments.map((row, idx) => (
                                    <tr key={idx} className={`border-b transition-colors last:border-0 ${isDark ? 'border-glass-border hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                        <td className="py-3 px-4 font-numbers">{row.id}</td>
                                        <td className="py-3 px-4">{row.customer}</td>
                                        <td className="py-3 px-4">{t(row.service)}</td>
                                        <td className="py-3 px-4 font-numbers">{row.amount} {t('sar')}</td>
                                        <td className="py-3 px-4">{t(row.method)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full bg-${row.statusColor}/10 border border-${row.statusColor}/20 text-${row.statusColor} text-xs`}>
                                                {t(row.status)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-numbers">{row.date}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button className="text-sm font-medium text-primary hover:text-primary-glow transition-colors">
                                                    {t('view')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {t('noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {payments.length > 0 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('showing')} 1 {t('to')} {payments.length} {t('of')} {payments.length} {t('payments')}
                        </div>
                        <div className="flex gap-2">
                            <button className={`px-3 py-2 rounded-lg text-sm transition-all border ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-glass-border' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}>
                                {t('previous')}
                            </button>
                            <button className="px-3 py-2 bg-primary text-white rounded-lg text-sm transition-all shadow-glow">
                                1
                            </button>
                            <button className={`px-3 py-2 rounded-lg text-sm transition-all border ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-glass-border' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}>
                                {t('next')}
                            </button>
                        </div>
                    </div>
                )}
            </GlassPanel>
        </div>
    );
};

export default Payments;
