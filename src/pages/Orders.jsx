import React, { useState, useMemo, useEffect } from 'react';
import GlassPanel from '../components/common/GlassPanel';
import OrderModal from '../components/orders/OrderModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { servicesAPI } from '../services/api';

const Orders = () => {
    const { t } = useLanguage();
    const { isDark } = useTheme();
    const { orders, fetchData } = useData();
    // Removed local mock data


    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view');

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtered orders based on selected filters
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesStatus;
        });
    }, [orders, statusFilter]);

    // Paginated orders
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredOrders, currentPage]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    // Reset filters
    const handleResetFilters = () => {
        setStatusFilter('all');
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (orderId) => {
        if (window.confirm(t('confirmDelete'))) {
            try {
                await servicesAPI.deleteRequest(orderId);
                // Refresh orders after deletion
                await fetchData();
            } catch (error) {
                console.error("Failed to delete order:", error);
                alert("Failed to delete order: " + (error.response?.data?.message || error.message));
            }
        }
    };


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('ordersList')}</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Card 1 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalOrders')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-primary-glow transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{orders.length}</h3>
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
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('completedOrders')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-success transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{orders.filter(o => o.status === 'completed').length}</h3>
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
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-warning transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{orders.filter(o => o.status === 'pending').length}</h3>
                    </div>
                </GlassPanel>

                {/* Stat Card 4 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-info/20 text-info">
                            <span className="material-symbols-outlined">construction</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('inProgressOrders')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-info transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{orders.filter(o => o.status?.toLowerCase() === 'inprogress').length}</h3>
                    </div>
                </GlassPanel>
            </div>

            {/* Filters and Controls */}
            <GlassPanel className="p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('filterOrders')}</h3>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`px-4 py-2 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                        >
                            <option value="all">{t('allStatuses')}</option>
                            <option value="pending">{t('pending')}</option>
                            <option value="inprogress">{t('inProgress')}</option>
                            <option value="waitingforpayment">{t('waitingForPayment')}</option>
                            <option value="paid">{t('paid')}</option>
                            <option value="completed">{t('completed')}</option>
                            <option value="cancelled">{t('cancelled')}</option>
                        </select>
                        <button
                            onClick={handleResetFilters}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                        >
                            {t('resetFilters')}
                        </button>
                    </div>
                </div>
            </GlassPanel>

            {/* Orders Table */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('ordersList')}</h3>
                    <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border border-glass-border' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'}`}>
                            {t('export')}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedOrder(null);
                                setModalMode('add');
                                setIsModalOpen(true);
                            }}
                            className="px-4 py-2 bg-success text-white rounded-xl text-sm font-medium hover:bg-success-dark transition-all shadow-glow"
                        >
                            {t('addOrder')}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`text-right text-sm border-b ${isDark ? 'text-slate-400 border-glass-border' : 'text-slate-500 border-slate-200'}`}>
                                <th className="pb-3 px-4 font-medium">#</th>
                                <th className="pb-3 px-4 font-medium">{t('customer')}</th>
                                <th className="pb-3 px-4 font-medium">{t('service')}</th>
                                <th className="pb-3 px-4 font-medium">{t('price')}</th>
                                <th className="pb-3 px-4 font-medium">{t('status')}</th>
                                <th className="pb-3 px-4 font-medium">{t('date')}</th>
                                <th className="pb-3 px-4 font-medium">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {paginatedOrders.map((row, idx) => (
                                <tr key={idx} className={`border-b transition-colors last:border-0 ${isDark ? 'border-glass-border hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <td className="py-3 px-4 font-numbers">{row.id}</td>
                                    <td className="py-3 px-4">{row.customer}</td>
                                    <td className="py-3 px-4">{t(row.service)}</td>
                                    <td className="py-3 px-4 font-numbers">{row.price} {t('sar')}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full bg-${row.statusColor}/10 border border-${row.statusColor}/20 text-${row.statusColor} text-xs`}>
                                            {t(row.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 font-numbers">{row.date}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(row)}
                                                className="text-primary hover:text-primary-glow text-sm font-medium transition-colors"
                                            >
                                                {t('view')}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(row)}
                                                className="text-info hover:text-info-glow text-sm font-medium transition-colors"
                                            >
                                                {t('update')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row.id)}
                                                className="text-danger hover:text-danger-glow text-sm font-medium transition-colors"
                                                title={t('delete')}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t('noOrders')}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('showing')} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} {t('of')} {filteredOrders.length} {t('order')}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                                    currentPage === 1
                                        ? (isDark ? 'bg-white/5 text-slate-600 border-glass-border cursor-not-allowed' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed')
                                        : (isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-glass-border' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200')
                                }`}
                            >
                                {t('previous')}
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                                        currentPage === pageNum
                                            ? 'bg-primary text-white shadow-glow'
                                            : (isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-glass-border' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200')
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                                    currentPage === totalPages
                                        ? (isDark ? 'bg-white/5 text-slate-600 border-glass-border cursor-not-allowed' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed')
                                        : (isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-glass-border' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200')
                                }`}
                            >
                                {t('next')}
                            </button>
                        </div>
                    </div>
                )}
            </GlassPanel>

            {isModalOpen && (
                <OrderModal
                    order={selectedOrder}
                    mode={modalMode}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Orders;
