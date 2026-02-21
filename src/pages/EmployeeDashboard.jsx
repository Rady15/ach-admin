import React, { useState } from 'react';
import GlassPanel from '../components/common/GlassPanel';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import OrderModal from '../components/orders/OrderModal';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const EmployeeDashboard = () => {
    const { orders, updateOrderStatus } = useData();
    const { user } = useAuth();
    const { t } = useLanguage();
    const [filter, setFilter] = useState('all');

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalMode, setModalMode] = useState('view');

    // Tasks are already filtered by the API (getMyRequests returns only assigned tasks)
    const myTasks = orders;

    const filteredTasks = filter === 'all' ? myTasks : myTasks.filter(task => task.status === filter);

    const handleStatusUpdate = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setModalMode('edit'); // Use 'edit' to allow status updates if needed, or 'view' if read-only
        setModalOpen(true);
    };

    const columns = [
        { key: 'id', label: 'referenceNumber', className: 'font-numbers text-primary' },
        { key: 'service', label: 'service', render: (row) => t(row.service) },
        {
            key: 'description',
            label: 'description',
            className: 'max-w-[150px] truncate text-slate-400 text-xs',
            render: (row) => row.description || row.serviceDetails?.description || '-'
        },
        { key: 'customer', label: 'customer' },
        { key: 'date', label: 'date', className: 'font-numbers' },
        { key: 'status', label: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{t('welcome')}, {user?.name}</h2>
                    <p className="text-slate-400 text-sm">{t('youHave')} {myTasks.filter(t => t.status === 'processing').length} {t('tasksInProgressToday')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassPanel className="p-6">
                    <h3 className="text-slate-400 text-sm mb-1">{t('activeTasks')}</h3>
                    <p className="text-2xl font-bold text-info font-numbers">{myTasks.filter(t => t.status === 'processing').length}</p>
                </GlassPanel>
                <GlassPanel className="p-6">
                    <h3 className="text-slate-400 text-sm mb-1">{t('completedTasks')}</h3>
                    <p className="text-2xl font-bold text-success font-numbers">{myTasks.filter(t => t.status === 'completed').length}</p>
                </GlassPanel>
                <GlassPanel className="p-6">
                    <h3 className="text-slate-400 text-sm mb-1">{t('completionRate')}</h3>
                    <p className="text-2xl font-bold text-warning font-numbers">
                        {myTasks.length > 0
                            ? Math.round((myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100)
                            : 0}%
                    </p>
                </GlassPanel>
            </div>

            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">{t('assignedTasks')}</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-lg text-xs ${filter === 'all' ? 'bg-primary text-white' : 'bg-white/5 text-slate-400'}`}>{t('all')}</button>
                        <button onClick={() => setFilter('processing')} className={`px-3 py-1 rounded-lg text-xs ${filter === 'processing' ? 'bg-info text-white' : 'bg-white/5 text-slate-400'}`}>{t('processing')}</button>
                        <button onClick={() => setFilter('completed')} className={`px-3 py-1 rounded-lg text-xs ${filter === 'completed' ? 'bg-success text-white' : 'bg-white/5 text-slate-400'}`}>{t('completed')}</button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredTasks}
                    actions={(row) => (
                        <div className="flex gap-2">
                            {row.status !== 'completed' && (
                                <button
                                    onClick={() => handleStatusUpdate(row.id, 'completed')}
                                    className="px-3 py-1 bg-success/20 text-success border border-success/20 rounded-lg text-xs hover:bg-success/30 transition-all font-medium"
                                >
                                    {t('completeTask')}
                                </button>
                            )}
                            <button onClick={() => handleView(row)} className="text-primary hover:text-primary-glow text-sm font-medium">{t('view')}</button>
                        </div>
                    )}
                />
            </GlassPanel>

            {/* Order Modal */}
            {modalOpen && (
                <OrderModal
                    onClose={() => setModalOpen(false)}
                    mode={modalMode}
                    order={selectedOrder}
                />
            )}
        </div>
    );
};

export default EmployeeDashboard;
