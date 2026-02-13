import React, { useState, useEffect } from 'react';
import GlassPanel from '../components/common/GlassPanel';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { pricingAPI } from '../services/api';

const Pricing = () => {
    const { t } = useLanguage();
    const { isDark } = useTheme();
    const { services, addService, updateService, deleteService, fetchData } = useData();

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Edit service state
    const [editService, setEditService] = useState({ id: '', name: '', price: '', desc: '', status: 'active' });

    // New service state
    const [newService, setNewService] = useState({ name: '', price: '', desc: '', status: 'active' });

    const handleUpdateService = async () => {
        if (!editService.name || !editService.price) return;
        try {
            await updateService(editService);
            setIsEditModalOpen(false);
            setEditService({ id: '', name: '', price: '', desc: '', status: 'active' });
            alert(t('serviceUpdated'));
        } catch (error) {
            console.error("Failed to update service:", error);
            alert("Failed to update service: " + (error.response?.data?.message || error.message));
        }
    };

    const handleAddService = async () => {
        if (!newService.name || !newService.price) return;
        try {
            await addService(newService);
            setNewService({ name: '', price: '', desc: '', status: 'active' });
            setIsAddModalOpen(false);
            alert(t('serviceAdded'));
        } catch (error) {
            console.error("Failed to add service:", error);
            alert("Failed to add service: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteService = async (id) => {
        if (window.confirm(t('confirmDeleteService'))) {
            try {
                await deleteService(id);
                alert(t('serviceDeleted'));
            } catch (error) {
                console.error("Failed to delete service:", error);
                alert("Failed to delete service: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const openEditModal = (service) => {
        setEditService({ ...service });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditService({ id: '', name: '', price: '', desc: '', status: 'active' });
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewService({ name: '', price: '', desc: '', status: 'active' });
    };

    const getStatusLabel = (status) => {
        return status === 'active' ? t('active') : t('inactive');
    };

    const getStatusStyles = (status) => {
        return status === 'active'
            ? 'bg-success/10 border-success/20 text-success'
            : 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    };

    // Get service display name (translated if available)
    const getServiceName = (name) => {
        const translated = t(name);
        return translated !== name ? translated : name;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('priceManagement')}</h2>

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
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalServices')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-primary-glow transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{services.length}</h3>
                    </div>
                </GlassPanel>

                {/* Stat Card 2 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-success/20 text-success">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalRevenue')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-success transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{services.reduce((sum, s) => sum + Number(s.price), 0).toLocaleString()} {t('sar')}</h3>
                    </div>
                </GlassPanel>

                {/* Stat Card 3 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-warning/20 text-warning">
                            <span className="material-symbols-outlined">calculate</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('avgPrice')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-warning transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {services.length > 0 ? Math.round(services.reduce((sum, s) => sum + Number(s.price), 0) / services.length) : 0} {t('sar')}
                        </h3>
                    </div>
                </GlassPanel>

                {/* Stat Card 4 */}
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-info/20 text-info">
                            <span className="material-symbols-outlined">update</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('updatesMonth')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-info transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>8</h3>
                    </div>
                </GlassPanel>
            </div>

            {/* Services Table */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('servicesList')}</h3>
                    <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-glass-border' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}>
                            {t('export')}
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-glow transition-all shadow-glow"
                        >
                            {t('addService')}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`text-right text-sm border-b ${isDark ? 'text-slate-400 border-glass-border' : 'text-slate-500 border-slate-200'}`}>
                                <th className="pb-3 px-4 font-medium">{t('serviceName')}</th>
                                <th className="pb-3 px-4 font-medium">{t('description')}</th>
                                <th className="pb-3 px-4 font-medium">{t('price')}</th>
                                <th className="pb-3 px-4 font-medium">{t('status')}</th>
                                <th className="pb-3 px-4 font-medium">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {services.map((service) => (
                                <tr key={service.id} className={`border-b transition-colors last:border-0 ${isDark ? 'border-glass-border hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <td className="py-3 px-4 font-bold">{getServiceName(service.name)}</td>
                                    <td className={`py-3 px-4 max-w-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{service.desc}</td>
                                    <td className="py-3 px-4 font-numbers text-primary font-bold">{service.price} {t('sar')}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full ${getStatusStyles(service.status)} text-xs font-medium`}>
                                            {getStatusLabel(service.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(service)}
                                                className="text-primary hover:text-primary-glow text-sm font-medium transition-colors"
                                            >
                                                {t('edit')}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteService(service.id)}
                                                className="text-danger hover:text-danger-glow text-sm font-medium transition-colors"
                                            >
                                                {t('delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {services.length === 0 && (
                    <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t('noData')}
                    </div>
                )}
            </GlassPanel>

            {/* Edit Service Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeEditModal}
                    ></div>

                    <div className={`relative border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#1e293b] border-glass-border' : 'bg-white border-slate-200'}`}>
                        <button
                            onClick={closeEditModal}
                            className={`absolute top-4 left-4 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('edit')} {t('service')}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('serviceName')}</label>
                                <input
                                    type="text"
                                    value={editService.name}
                                    onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('price')} ({t('sar')})</label>
                                <input
                                    type="number"
                                    value={editService.price}
                                    onChange={(e) => setEditService({ ...editService, price: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-numbers ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('description')}</label>
                                <textarea
                                    value={editService.desc}
                                    onChange={(e) => setEditService({ ...editService, desc: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                    rows="3"
                                ></textarea>
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('status')}</label>
                                <select
                                    value={editService.status}
                                    onChange={(e) => setEditService({ ...editService, status: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                >
                                    <option value="active">{t('active')}</option>
                                    <option value="inactive">{t('inactive')}</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleUpdateService}
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-glow transition-all shadow-glow"
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

            {/* Add Service Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeAddModal}
                    ></div>

                    <div className={`relative border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#1e293b] border-glass-border' : 'bg-white border-slate-200'}`}>
                        <button
                            onClick={closeAddModal}
                            className={`absolute top-4 left-4 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('addService')}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('serviceName')}</label>
                                <input
                                    type="text"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('price')} ({t('sar')})</label>
                                <input
                                    type="number"
                                    value={newService.price}
                                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-numbers ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('description')}</label>
                                <textarea
                                    value={newService.desc}
                                    onChange={(e) => setNewService({ ...newService, desc: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                    rows="3"
                                ></textarea>
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('status')}</label>
                                <select
                                    value={newService.status}
                                    onChange={(e) => setNewService({ ...newService, status: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                >
                                    <option value="active">{t('active')}</option>
                                    <option value="inactive">{t('inactive')}</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleAddService}
                                    className="flex-1 px-4 py-3 bg-success text-white rounded-xl text-sm font-medium hover:bg-success-dark transition-all shadow-glow"
                                >
                                    {t('add')} {t('service')}
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

export default Pricing;
