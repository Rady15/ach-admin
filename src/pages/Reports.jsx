import React, { useState } from 'react';
import GlassPanel from '../components/common/GlassPanel';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { reportsAPI } from '../services/api';

const Reports = () => {
    const { t } = useLanguage();
    const { isDark } = useTheme();
    const [reportType, setReportType] = useState('orders');
    const [timeRange, setTimeRange] = useState('thisMonth');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            let response;
            const params = { timeRange };

            switch (reportType) {
                case 'orders':
                    response = await reportsAPI.getOrdersReport(params);
                    break;
                case 'payments':
                    response = await reportsAPI.getPaymentsReport(params);
                    break;
                case 'customers':
                    response = await reportsAPI.getCustomersReport(params);
                    break;
                case 'performance':
                    response = await reportsAPI.getPerformanceReport(params);
                    break;
                default:
                    throw new Error('Invalid report type');
            }

            setReportData(response.data);
        } catch (error) {
            console.error("Failed to generate report:", error);
            alert("Failed to generate report: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('reports')}</h2>

            {/* Report Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassPanel className="p-6 flex flex-col items-center text-center cursor-pointer group" hoverEffect>
                    <div className="size-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('ordersReport')}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('ordersReportDesc')}</p>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col items-center text-center cursor-pointer group" hoverEffect>
                    <div className="size-14 rounded-xl bg-success/20 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-success text-2xl">payments</span>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('paymentsReport')}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('paymentsReportDesc')}</p>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col items-center text-center cursor-pointer group" hoverEffect>
                    <div className="size-14 rounded-xl bg-info/20 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-info text-2xl">people</span>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('customersReport')}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('customersReportDesc')}</p>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col items-center text-center cursor-pointer group" hoverEffect>
                    <div className="size-14 rounded-xl bg-warning/20 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-warning text-2xl">trending_up</span>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('performanceReport')}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('performanceReportDesc')}</p>
                </GlassPanel>
            </div>

            {/* Report Filters */}
            <GlassPanel className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('filterReport')}</h3>
                    <div className="flex flex-wrap gap-3">
                        <select 
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className={`px-4 py-2 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                        >
                            <option value="orders">{t('ordersReport')}</option>
                            <option value="payments">{t('paymentsReport')}</option>
                            <option value="customers">{t('customersReport')}</option>
                            <option value="performance">{t('performanceReport')}</option>
                        </select>
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className={`px-4 py-2 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                        >
                            <option value="today">{t('today')}</option>
                            <option value="thisWeek">{t('thisWeek')}</option>
                            <option value="thisMonth">{t('thisMonth')}</option>
                            <option value="thisQuarter">{t('thisQuarter')}</option>
                            <option value="thisYear">{t('thisYear')}</option>
                            <option value="custom">{t('custom')}</option>
                        </select>
                        <button 
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('loading') || 'Loading...' : t('createReport')}
                        </button>
                    </div>
                </div>
            </GlassPanel>

            {/* Revenue Chart */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('revenueStats')}</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-glow border border-transparent">{t('monthly')}</button>
                        <button className={`px-3 py-1.5 rounded-lg text-xs transition-colors border border-transparent ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>{t('annual')}</button>
                    </div>
                </div>
                {/* Chart Visualization (SVG) */}
                <div className="w-full h-[300px] relative z-10">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#256af4" stopOpacity="0.4"></stop>
                                <stop offset="100%" stopColor="#256af4" stopOpacity="0"></stop>
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur result="coloredBlur" stdDeviation="4"></feGaussianBlur>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"></feMergeNode>
                                    <feMergeNode in="SourceGraphic"></feMergeNode>
                                </feMerge>
                            </filter>
                        </defs>
                        {/* Grid Lines */}
                        <line stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" x1="0" x2="800" y1="250" y2="250"></line>
                        <line stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" x1="0" x2="800" y1="190" y2="190"></line>
                        <line stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" x1="0" x2="800" y1="130" y2="130"></line>
                        <line stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" x1="0" x2="800" y1="70" y2="70"></line>
                        {/* Area Path */}
                        <path d="M0,250 C100,240 150,150 200,160 C250,170 300,210 400,140 C500,70 550,120 650,90 C720,70 750,50 800,40 V250 H0 Z" fill="url(#chartGradient)"></path>
                        {/* Line Path with Glow */}
                        <path d="M0,250 C100,240 150,150 200,160 C250,170 300,210 400,140 C500,70 550,120 650,90 C720,70 750,50 800,40" fill="none" filter="url(#glow)" stroke="#256af4" strokeWidth="3"></path>
                        {/* Data Points */}
                        <circle cx="200" cy="160" fill={isDark ? "#fff" : "#fff"} r="4" stroke="#256af4" strokeWidth="2"></circle>
                        <circle cx="400" cy="140" fill={isDark ? "#fff" : "#fff"} r="4" stroke="#256af4" strokeWidth="2"></circle>
                        <circle className="shadow-glow" cx="650" cy="90" fill={isDark ? "#fff" : "#fff"} r="6" stroke="#256af4" strokeWidth="3"></circle>
                        {/* Tooltip Mockup */}
                        <g transform="translate(620, 40)">
                            <rect fill={isDark ? "#1e293b" : "#fff"} height="30" rx="6" stroke="#3b82f6" strokeWidth="1" width="80" x="0" y="0" className={isDark ? "" : "shadow-lg"}></rect>
                            <text fill={isDark ? "white" : "#1e293b"} fontFamily="Space Grotesk" fontSize="12" fontWeight="bold" textAnchor="middle" x="40" y="20">SAR 42k</text>
                        </g>
                    </svg>
                    {/* X Axis Labels */}
                    <div className={`flex justify-between mt-2 text-xs font-medium px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span>{t('january')}</span>
                        <span>{t('february')}</span>
                        <span>{t('march')}</span>
                        <span>{t('april')}</span>
                        <span>{t('may')}</span>
                        <span>{t('june')}</span>
                        <span>{t('july')}</span>
                    </div>
                </div>
            </GlassPanel>

            {/* Top Services and Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Services */}
                <GlassPanel className="p-6">
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('topServices')}</h3>
                    <div className="space-y-4">
                        {reportData?.topServices?.map((item, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isDark ? 'bg-white/5 border-glass-border hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded-lg bg-primary/20 flex items-center justify-center`}>
                                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                                    </div>
                                    <div>
                                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.name}</p>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.count} {t('order')}</p>
                                    </div>
                                </div>
                                <span className={`font-bold font-numbers text-sm ${item.change < 0 ? 'text-danger' : 'text-success'}`}>{item.change > 0 ? '+' : ''}{item.change}%</span>
                            </div>
                        )) || (
                            <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('noData')}
                            </div>
                        )}
                    </div>
                </GlassPanel>

                {/* Top Customers */}
                <GlassPanel className="p-6">
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('topCustomers')}</h3>
                    <div className="space-y-4">
                        {reportData?.topCustomers?.map((item, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isDark ? 'bg-white/5 border-glass-border hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">person</span>
                                    </div>
                                    <div>
                                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.name}</p>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.count} {t('order')}</p>
                                    </div>
                                </div>
                                <span className="text-success font-bold font-numbers text-sm">{item.total} {t('sar')}</span>
                            </div>
                        )) || (
                            <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('noData')}
                            </div>
                        )}
                    </div>
                </GlassPanel>
            </div>

            {/* Recent Reports */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('recentReports')}</h3>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow">
                        {t('newReport')}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`text-right text-xs border-b ${isDark ? 'text-slate-400 border-glass-border' : 'text-slate-500 border-slate-200'}`}>
                                <th className="pb-3 px-4 font-medium">{t('reportName')}</th>
                                <th className="pb-3 px-4 font-medium">{t('reportType')}</th>
                                <th className="pb-3 px-4 font-medium">{t('timeRange')}</th>
                                <th className="pb-3 px-4 font-medium">{t('status')}</th>
                                <th className="pb-3 px-4 font-medium">{t('date')}</th>
                                <th className="pb-3 px-4 font-medium">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {reportData?.recentReports?.map((row, idx) => (
                                <tr key={idx} className={`border-b transition-colors last:border-0 ${isDark ? 'border-glass-border hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <td className="py-3 px-4">{row.name}</td>
                                    <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{row.type}</td>
                                    <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{row.range}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 rounded-full bg-${row.statusColor}/10 border border-${row.statusColor}/20 text-${row.statusColor} text-[10px] font-medium`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-4 font-numbers ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{row.date}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button className="text-primary hover:text-primary-glow text-xs font-medium transition-colors">{t('view')}</button>
                                            <button className="text-info hover:text-info-glow text-xs font-medium transition-colors">{t('download')}</button>
                                        </div>
                                    </td>
                                </tr>
                            )) || (
                                <tr>
                                    <td colSpan="6" className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {t('noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>
        </div>
    );
};

export default Reports;
