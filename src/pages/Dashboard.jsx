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
    const { stats, orders } = useData();

    // Use recent 3 orders for display
    const recentOrders = orders.slice(0, 3);

    // Calculate order status counts for the chart
    const totalOrdersCount = orders.length;
    const completedCount = orders.filter(o => o.status === 'completed').length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const processingCount = orders.filter(o => o.status === 'processing').length;
    
    // Calculate percentages for donut chart
    const completedPercent = totalOrdersCount > 0 ? (completedCount / totalOrdersCount) * 100 : 0;
    const pendingPercent = totalOrdersCount > 0 ? (pendingCount / totalOrdersCount) * 100 : 0;
    const processingPercent = totalOrdersCount > 0 ? (processingCount / totalOrdersCount) * 100 : 0;
    
    // SVG circle calculations (circumference = 2 * π * 70 ≈ 440)
    const circumference = 440;
    const completedOffset = circumference - (completedPercent / 100) * circumference;
    const pendingOffset = circumference - (pendingPercent / 100) * circumference;
    const processingOffset = circumference - (processingPercent / 100) * circumference;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Card 1 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>
                        {/* <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-numbers">+15%</span> */}
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalOrders')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-primary-glow transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.totalOrders}</h3>
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
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('activeOrders')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-success transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.activeOrders}</h3>
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
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('pendingOrders')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-warning transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {orders.filter(o => o.status === 'pending').length}
                        </h3>
                    </div>
                </GlassPanel>

                {/* Stat Card 4 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-info/20 text-info">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalRevenue')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-info transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.totalRevenue.toLocaleString()} {t('sar')}</h3>
                    </div>
                </GlassPanel>
            </div>

            {/* Orders Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders Chart */}
                <GlassPanel className="lg:col-span-2 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 relative z-10">
                        <div>
                            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('ordersByStatus')}</h3>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('recentOrders')}</p>
                        </div>
                    </div>
                    {/* Order Status Distribution Bar Chart */}
                    <div className="w-full h-[300px] relative z-10 flex flex-col justify-end gap-4 px-4">
                        <div className="flex items-end justify-around h-[250px] gap-4">
                            {/* Completed Bar */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <span className={`text-sm font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{completedCount}</span>
                                <div 
                                    className="w-full bg-success rounded-t-xl transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                    style={{ height: totalOrdersCount > 0 ? `${(completedCount / totalOrdersCount) * 200}px` : '0px', minHeight: completedCount > 0 ? '4px' : '0px' }}
                                ></div>
                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('completed')}</span>
                            </div>
                            {/* Pending Bar */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <span className={`text-sm font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{pendingCount}</span>
                                <div 
                                    className="w-full bg-warning rounded-t-xl transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                                    style={{ height: totalOrdersCount > 0 ? `${(pendingCount / totalOrdersCount) * 200}px` : '0px', minHeight: pendingCount > 0 ? '4px' : '0px' }}
                                ></div>
                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('pending')}</span>
                            </div>
                            {/* Processing Bar */}
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <span className={`text-sm font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{processingCount}</span>
                                <div 
                                    className="w-full bg-info rounded-t-xl transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                    style={{ height: totalOrdersCount > 0 ? `${(processingCount / totalOrdersCount) * 200}px` : '0px', minHeight: processingCount > 0 ? '4px' : '0px' }}
                                ></div>
                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('processing')}</span>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* Order Status Summary */}
                <GlassPanel className="p-6 flex flex-col gap-6">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('status')}</h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className={`text-3xl font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{totalOrdersCount}</span>
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalOrders')}</span>
                        </div>
                        {/* Dynamic Donut Chart */}
                        <svg className="transform -rotate-90" height="180" viewBox="0 0 180 180" width="180">
                            <circle cx="90" cy="90" fill="none" r="70" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="20"></circle>
                            {/* Completed Segment (Green) */}
                            {completedCount > 0 && (
                                <circle 
                                    className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500" 
                                    cx="90" cy="90" fill="none" r="70" 
                                    stroke="#10b981" 
                                    strokeDasharray={circumference} 
                                    strokeDashoffset={completedOffset}
                                    strokeLinecap="round" 
                                    strokeWidth="20"
                                ></circle>
                            )}
                            {/* Pending Segment (Orange) */}
                            {pendingCount > 0 && (
                                <circle 
                                    className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500" 
                                    cx="90" cy="90" fill="none" r="70" 
                                    stroke="#f59e0b" 
                                    strokeDasharray={circumference} 
                                    strokeDashoffset={pendingOffset}
                                    strokeLinecap="round" 
                                    strokeWidth="20"
                                    style={{ transform: `rotate(${(completedPercent / 100) * 360}deg)`, transformOrigin: '90px 90px' }}
                                ></circle>
                            )}
                            {/* Processing Segment (Blue) */}
                            {processingCount > 0 && (
                                <circle 
                                    className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500" 
                                    cx="90" cy="90" fill="none" r="70" 
                                    stroke="#3b82f6" 
                                    strokeDasharray={circumference} 
                                    strokeDashoffset={processingOffset}
                                    strokeLinecap="round" 
                                    strokeWidth="20"
                                    style={{ transform: `rotate(${((completedPercent + pendingPercent) / 100) * 360}deg)`, transformOrigin: '90px 90px' }}
                                ></circle>
                            )}
                        </svg>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Dynamic Counts */}
                        <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('completed')}</span>
                            </div>
                            <span className={`text-sm font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{completedCount}</span>
                        </div>
                        <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('pending')}</span>
                            </div>
                            <span className={`text-sm font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{pendingCount}</span>
                        </div>
                        <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-info shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('processing')}</span>
                            </div>
                            <span className={`text-sm font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{processingCount}</span>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* Recent Orders Table */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('recentOrders')}</h3>
                    <button onClick={() => navigate('/orders')} className="text-sm text-primary hover:text-primary-glow font-medium flex items-center gap-1 transition-colors">
                        {t('view')} {t('all')}
                        <span className="material-symbols-outlined text-sm dir-flip">arrow_right_alt</span>
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                        <GlassPanel key={idx} className={`p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all cursor-pointer group ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className={`size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary`}>
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{order.customer}</h4>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t(order.service)}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-auto gap-8 md:gap-16">
                                <div className="flex flex-col items-start sm:items-end">
                                    <span className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('price')}</span>
                                    <span className={`text-sm font-numbers ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{order.amount} {t('sar')}</span>
                                </div>
                                <div className="flex flex-col items-start sm:items-end">
                                    <span className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('status')}</span>
                                    <span className={`text-sm font-bold font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{t(order.status)}</span>
                                </div>
                            </div>
                        </GlassPanel>
                    )) : (
                        <div className="text-center py-4 text-slate-500">{t('noData')}</div>
                    )}
                </div>
            </div>


        </div >
    );
};

export default Dashboard;
