import React from 'react';
import GlassPanel from '../components/common/GlassPanel';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Dashboard = () => {
    const { t } = useLanguage();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { stats, orders, employees, customers, payments } = useData();

    // Status counts
    const statusCounts = {
        total: orders.length,
        completed: orders.filter(o => o.status === 'completed').length,
        paid: orders.filter(o => o.status === 'paid').length,
        pending: orders.filter(o => o.status === 'underreview').length,
        inProgress: orders.filter(o => o.status === 'inprogress').length,
        waitingPayment: orders.filter(o => o.status === 'waitingforpayment').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    // Quick stats
    const quickStats = [
        { label: t('totalOrders') || 'إجمالي الطلبات', value: statusCounts.total, icon: 'receipt_long', color: 'primary' },
        { label: t('totalCustomers') || 'إجمالي العملاء', value: customers.length, icon: 'group', color: 'info' },
        { label: t('totalRevenue') || 'إجمالي الإيرادات', value: stats.totalRevenue?.toLocaleString() || '0', icon: 'payments', color: 'success', suffix: t('sar') || 'ر.س' },
        { label: t('employees') || 'الموظفين', value: employees.length, icon: 'badge', color: 'warning' }
    ];

    // Recent orders
    const recentOrders = orders.slice(0, 5).map(order => ({
        id: order.id,
        customer: order.customer,
        service: t(order.service) || order.service,
        price: order.price,
        status: order.status,
        statusColor: order.statusColor || 'info'
    }));

    const getStatusStyles = (status) => ({
        completed: 'bg-success/10 text-success',
        paid: 'bg-success/10 text-success', 
        pending: 'bg-warning/10 text-warning',
        'inprogress': 'bg-info/10 text-info',
        waitingforpayment: 'bg-purple-500/10 text-purple-500',
        cancelled: 'bg-danger/10 text-danger'
    }[status] || 'bg-slate-500/10 text-slate-500');

    return (
        <div className="space-y-8 p-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, idx) => (
                    <GlassPanel key={idx} className="p-6 group hoverEffect" hoverEffect>
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl bg-${stat.color}/10 text-${stat.color} flex-shrink-0`}>
                                <span className="material-symbols-outlined text-lg">{stat.icon}</span>
                            </div>
                            <div className="flex-1 ml-4 text-right">
                                <p className={`text-sm font-medium opacity-75 mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {stat.label}
                                </p>
                                <h3 className={`text-2xl lg:text-3xl font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-${stat.color}`}>
                                    {stat.value} {stat.suffix || ''}
                                </h3>
                            </div>
                        </div>
                    </GlassPanel>
                ))}
            </div>

            {/* Status Overview */}
            <GlassPanel className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{t('status') || 'الحالة'}</h3>
                        <p className={`text-sm opacity-75 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('orderStatusOverview') || 'نظرة عامة على حالة الطلبات'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-75">
                        <span className={`px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium`}>
                            {statusCounts.total}
                        </span>
                        <span>{t('total') || 'إجمالي'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Circle Chart */}
                    <div className="relative order-2 lg:order-1">
                        <svg viewBox="0 0 300 300" className="w-80 h-80 mx-auto">
                            {/* Background circle */}
                            <circle 
                                cx="150" cy="150" r="130" 
                                fill="none" 
                                stroke="#374151" 
                                strokeWidth="25"
                                className={isDark ? 'stroke-slate-700' : 'stroke-slate-200'}
                            />
                            {/* Progress ring with multiple colored segments */}
                            {/* Multi-segment donut chart */}
                            <path d="M 150 20 A 130 130 0 0 1 195 90" fill="none" stroke="#10B981" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 transition-all duration-1000"/>
                            <path d="M 195 90 A 130 130 0 0 1 240 35" fill="none" stroke="#F59E0B" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 -rotate-40 transition-all duration-1000"/>
                            <path d="M 240 35 A 130 130 0 0 1 260 105" fill="none" stroke="#3B82F6" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 -rotate-80 transition-all duration-1000"/>
                            <path d="M 260 105 A 130 130 0 0 1 230 170" fill="none" stroke="#A855F7" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 -rotate-120 transition-all duration-1000"/>
                            <path d="M 230 170 A 130 130 0 0 1 170 230" fill="none" stroke="#EF4444" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 -rotate-160 transition-all duration-1000"/>
                            <path d="M 170 230 A 130 130 0 0 1 105 260" fill="none" stroke="#6B7280" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 -rotate-200 transition-all duration-1000"/>
                            <path d="M 105 260 A 130 130 0 0 1 35 240" fill="none" stroke="#6B7280" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 -rotate-240 transition-all duration-1000"/>
                            <path d="M 35 240 A 130 130 0 0 1 90 195" fill="none" stroke="#6B7280" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 -rotate-280 transition-all duration-1000"/>
                            <path d="M 90 195 A 130 130 0 0 1 150 20" fill="none" stroke="#6B7280" strokeWidth="25" strokeLinecap="round" className="origin-center -rotate-90 -rotate-320 transition-all duration-1000"/>
                            
                            {/* Center total */}
                            <text x="150" y="155" className={`text-4xl lg:text-5xl font-black fill-white text-center font-numbers drop-shadow-2xl animate-pulse`} textAnchor="middle">
                                {statusCounts.total}
                            </text>
                            <text x="150" y="195" className={`text-lg font-bold fill-slate-300 text-center`} textAnchor="middle">
                                {t('totalOrders') || 'إجمالي الطلبات'}
                            </text>
                        </svg>
                    </div>
                    
                    {/* Legend on left - RTL */}
                    <div className="order-1 lg:order-2 space-y-3 text-right pr-0 lg:pr-12">
                        <div className="flex items-center justify-end gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 shadow-lg">
                            <div className="w-4 h-4 rounded-lg bg-emerald-500 shadow-md"></div>
                            <div>
                                <div className="font-bold text-lg text-white">{statusCounts.completed}</div>
                                <div className="text-sm text-slate-300">{t('completed') || 'مكتمل'}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 shadow-lg">
                            <div className="w-4 h-4 rounded-lg bg-emerald-500 shadow-md"></div>
                            <div>
                                <div className="font-bold text-lg text-white">{statusCounts.paid}</div>
                                <div className="text-sm text-slate-300">{t('paid') || 'مدفوع'}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 shadow-lg">
                            <div className="w-4 h-4 rounded-lg bg-amber-500 shadow-md"></div>
                            <div>
                                <div className="font-bold text-lg text-white">{statusCounts.pending}</div>
                                <div className="text-sm text-slate-300">{t('pending') || 'قيد الانتظار'}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 shadow-lg">
                            <div className="w-4 h-4 rounded-lg bg-blue-500 shadow-md"></div>
                            <div>
                                <div className="font-bold text-lg text-white">{statusCounts.inProgress}</div>
                                <div className="text-sm text-slate-300">{t('inProgress') || 'قيد التنفيذ'}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-3 p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 shadow-lg">
                            <div className="w-4 h-4 rounded-lg bg-purple-500 shadow-md"></div>
                            <div>
                                <div className="font-bold text-lg text-white">{statusCounts.waitingPayment}</div>
                                <div className="text-sm text-slate-300">{t('waitingForPayment') || 'في انتظار الدفع'}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-3 p-3 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 shadow-lg">
                            <div className="w-4 h-4 rounded-lg bg-red-500 shadow-md"></div>
                            <div>
                                <div className="font-bold text-lg text-white">{statusCounts.cancelled}</div>
                                <div className="text-sm text-slate-300">{t('cancelled') || 'ملغى'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassPanel>

            {/* Recent Orders & Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <GlassPanel className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">{t('recentOrders') || 'آخر الطلبات'}</h3>
                        <button 
                            onClick={() => navigate('/orders')} 
                            className="flex items-center gap-2 text-primary hover:text-primary-glow font-medium transition-colors group"
                        >
                            {t('viewAll') || 'عرض الكل'}
                            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                            <div key={idx} className={`p-4 rounded-xl border transition-all cursor-pointer group ${isDark ? 'border-glass-border hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark shadow-lg`}>
                                            <span className="material-symbols-outlined text-white text-sm">receipt</span>
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{order.customer}</h4>
                                            <p className={`text-xs opacity-75 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{order.service}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-sm font-bold font-numbers text-success`}>
                                            {order.price} <span className="text-xs opacity-75">{t('sar')}</span>
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(order.status)}`}>
                                            {t(order.status) || order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-5xl opacity-25 mb-4 block mx-auto">receipt_long</span>
                                <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {t('noRecentOrders') || 'لا توجد طلبات حديثة'}
                                </p>
                            </div>
                        )}
                    </div>
                </GlassPanel>
            </div>

        </div>
    );
};

export default Dashboard;
