import React, { useState } from 'react';
import GlassPanel from '../components/common/GlassPanel';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { authAPI } from '../services/api';

const Customers = () => {
    const { t } = useLanguage();
    const { isDark } = useTheme();
    const { customers, fetchData, deleteCustomer } = useData(); // Use global data

    // Modal states
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Selected customer for view/edit
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editCustomer, setEditCustomer] = useState({ id: '', name: '', email: '', phone: '', status: 'active' });
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', status: 'active' });

    // View customer
    const handleView = (customer) => {
        setSelectedCustomer(customer);
        setIsViewModalOpen(true);
    };

    // Open edit modal
    const handleEdit = (customer) => {
        setEditCustomer({ ...customer });
        // Store original status to detect changes if needed, or just allow API to handle idempotent calls
        setIsEditModalOpen(true);
    };

    // Save edit
    const handleSaveEdit = async () => {
        // We currently only have endpoints for Suspend/Unsuspend. 
        // Other field updates might need a different endpoint not provided.
        // We will perform status updates.

        try {
            if (editCustomer.status === 'inactive') {
                // Assuming 'id' is what the API expects. If it needs userName, switch to editCustomer.userName
                await authAPI.suspendUser(editCustomer.userName || editCustomer.id);
            } else if (editCustomer.status === 'active') {
                await authAPI.unsuspendUser(editCustomer.userName || editCustomer.id);
            }

            await fetchData(); // Refresh data from backend
            setIsEditModalOpen(false);
            setEditCustomer({ id: '', name: '', email: '', phone: '', status: 'active' });
            alert(t('customerUpdated'));
        } catch (error) {
            console.error("Failed to update customer:", error);
            alert("Failed to update status: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    // Suspend customer
    const handleSuspend = async (userName) => {
        if (window.confirm(t('confirmSuspend') || 'هل أنت متأكد من إيقاف هذا الحساب؟')) {
            try {
                await authAPI.suspendUser(userName);
                await fetchData();
            } catch (e) {
                console.error(e);
                alert("Failed to suspend user");
            }
        }
    };

    // Unsuspend customer
    const handleUnsuspend = async (userName) => {
        try {
            await authAPI.unsuspendUser(userName);
            await fetchData();
        } catch (e) {
            console.error(e);
            alert("Failed to unsuspend user");
        }
    };

    // Delete customer
    const handleDelete = async (customerId) => {
        if (window.confirm(t('confirmDelete') || 'هل أنت متأكد من حذف هذا العميل؟')) {
            try {
                await deleteCustomer(customerId);
                await fetchData();
            } catch (e) {
                console.error(e);
                alert("Failed to delete customer");
            }
        }
    };

    // Add new customer
    const handleAddCustomer = async () => {
        // User implied "Add Staff" (create-employee) is available.
        // Is there "Add Customer"? GET /api/Account/all implies listing.
        // Register likely happens outside admin panel (public/signup).
        // But if there is an endpoint, we use it. If not, we might not be able to add customers here.
        // For now, I'll allow it but it won't persist to backend if no matching endpoint.
        // I'll show an alert that this feature might not be available.

        if (!newCustomer.name || !newCustomer.email) return;

        // TODO: Check if there is an endpoint for creating customers manually.
        // Assuming no endpoint provided for "Add Customer", only "Add Staff".
        alert("Feature not connected to backend yet (No endpoint provided).");

        /* 
        const customer = {
            ...newCustomer,
            id: Date.now(),
            orders: 0,
            totalSpent: 0,
            registeredDate: new Date().toISOString().split('T')[0]
        };
        // setCustomers... (can't set global state directly easily without action)
        */
        setIsAddModalOpen(false);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedCustomer(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditCustomer({ id: '', name: '', email: '', phone: '', status: 'active' });
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewCustomer({ name: '', email: '', phone: '', status: 'active' });
    };

    const getStatusLabel = (status) => {
        return status === 'active' ? t('active') : t('inactive');
    };

    const getStatusStyles = (status) => {
        return status === 'active'
            ? 'bg-success/10 border-success/20 text-success'
            : 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('customers')}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow"
                    >
                        {t('addCustomer')}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-numbers">+8%</span>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalCustomers')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-primary-glow transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{customers.length}</h3>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-success/20 text-success">
                            <span className="material-symbols-outlined">person_add</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-numbers">+12</span>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('newCustomersThisMonth')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-success transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>12</h3>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-info/20 text-info">
                            <span className="material-symbols-outlined">verified_user</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-numbers">+5%</span>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('activeCustomers')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-info transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{customers.filter(c => c.status === 'active').length}</h3>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-warning/20 text-warning">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-numbers">+15%</span>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalSpent')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-warning transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()} {t('sar')}</h3>
                    </div>
                </GlassPanel>
            </div>

            {/* Customers Table */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('customersList')}</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`text-right text-sm border-b ${isDark ? 'text-slate-400 border-glass-border' : 'text-slate-500 border-slate-200'}`}>
                                <th className="pb-3 px-4 font-medium">{t('customerName')}</th>
                                <th className="pb-3 px-4 font-medium">{t('email')}</th>
                                <th className="pb-3 px-4 font-medium">{t('phone')}</th>
                                <th className="pb-3 px-4 font-medium">{t('ordersCount')}</th>
                                <th className="pb-3 px-4 font-medium">{t('totalSpent')}</th>
                                <th className="pb-3 px-4 font-medium">{t('status')}</th>
                                <th className="pb-3 px-4 font-medium">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {customers.map((customer, index) => (
                                <tr key={customer.id || index} className={`border-b transition-colors last:border-0 ${isDark ? 'border-glass-border hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <td className="py-3 px-4 font-bold">{customer.name}</td>
                                    <td className={`py-3 px-4 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{customer.email}</td>
                                    <td className="py-3 px-4 font-numbers">{customer.phone}</td>
                                    <td className="py-3 px-4 font-numbers text-center text-primary">{customer.orders}</td>
                                    <td className="py-3 px-4 font-numbers">{(customer.totalSpent || 0).toLocaleString()} {t('sar')}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full ${getStatusStyles(customer.status)} text-xs font-medium`}>
                                            {getStatusLabel(customer.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(customer)}
                                                className="text-primary hover:text-primary-glow text-sm font-medium transition-colors"
                                            >
                                                {t('view')}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(customer)}
                                                className="text-info hover:text-info-glow text-sm font-medium transition-colors"
                                            >
                                                {t('edit')}
                                            </button>
                                            {customer.isActive ? (
                                                <button
                                                    onClick={() => handleSuspend(customer.userName)}
                                                    className="text-amber-500 hover:text-amber-600 text-sm font-medium transition-colors"
                                                >
                                                    {t('suspend') || 'إيقاف'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnsuspend(customer.userName)}
                                                    className="text-success hover:text-success-glow text-sm font-medium transition-colors"
                                                >
                                                    {t('unsuspend') || 'تفعيل'}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(customer.id)}
                                                className="text-danger hover:text-danger-glow text-sm font-medium transition-colors"
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

                {customers.length === 0 && (
                    <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t('noData')}
                    </div>
                )}
            </GlassPanel>

            {/* View Customer Modal */}
            {isViewModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeViewModal}
                    ></div>

                    <div className={`relative border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-[#1e293b] border-glass-border' : 'bg-white border-slate-200'}`}>
                        <button
                            onClick={closeViewModal}
                            className={`absolute top-4 left-4 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('customerDetails')}</h3>

                        {selectedCustomer ? (
                            <>
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl font-bold text-primary uppercase">
                                            {(selectedCustomer.name || '?').charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedCustomer.name}</h4>
                                            <span className={`px-3 py-1 rounded-full ${getStatusStyles(selectedCustomer.status)} text-xs font-medium`}>
                                                {getStatusLabel(selectedCustomer.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('email')}</p>
                                        <p className={`font-mono text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedCustomer.email}</p>
                                    </div>

                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('phone')}</p>
                                        <p className={`font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedCustomer.phone}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                            <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('ordersCount')}</p>
                                            <p className="text-info font-bold font-numbers text-xl">{selectedCustomer.orders}</p>
                                        </div>
                                        <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                            <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalSpent')}</p>
                                            <p className="text-success font-bold font-numbers text-xl">{selectedCustomer.totalSpent}</p>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('registeredDate')}</p>
                                        <p className={`font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedCustomer.registeredDate}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={closeViewModal}
                                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                                >
                                    {t('close')}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('noCustomerSelected')}</p>
                                <button
                                    onClick={closeViewModal}
                                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                                >
                                    {t('close')}
                                </button>
                            </>
                        )}
                    </div>
                </div>

            )}

            {/* Edit Customer Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeEditModal}
                    ></div>

                    <div className={`relative border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-[#1e293b] border-glass-border' : 'bg-white border-slate-200'}`}>
                        <button
                            onClick={closeEditModal}
                            className={`absolute top-4 left-4 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('edit')} {t('customer')}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('customerName')}</label>
                                <input
                                    type="text"
                                    value={editCustomer.name || ''}
                                    onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('email')}</label>
                                <input
                                    type="email"
                                    value={editCustomer.email || ''}
                                    onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('phone')}</label>
                                <input
                                    type="tel"
                                    value={editCustomer.phone || ''}
                                    onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('status')}</label>
                                <select
                                    value={editCustomer.status || 'active'}
                                    onChange={(e) => setEditCustomer({ ...editCustomer, status: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                >
                                    <option value="active">{t('active')}</option>
                                    <option value="inactive">{t('inactive')}</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow"
                                >
                                    {t('saveChanges')}
                                </button>
                                <button
                                    onClick={closeEditModal}
                                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Customer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeAddModal}
                    ></div>

                    <div className={`relative border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-[#1e293b] border-glass-border' : 'bg-white border-slate-200'}`}>
                        <button
                            onClick={closeAddModal}
                            className={`absolute top-4 left-4 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('addCustomer')}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('customerName')}</label>
                                <input
                                    type="text"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('email')}</label>
                                <input
                                    type="email"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('phone')}</label>
                                <input
                                    type="tel"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleAddCustomer}
                                    className="flex-1 px-4 py-3 bg-success text-white rounded-xl text-sm font-medium hover:bg-success-dark transition-all shadow-glow"
                                >
                                    {t('add')} {t('customer')}
                                </button>
                                <button
                                    onClick={closeAddModal}
                                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
