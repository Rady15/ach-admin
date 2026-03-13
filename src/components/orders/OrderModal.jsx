import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const OrderModal = ({ onClose, order = null, mode = 'add' }) => {
    const { t } = useLanguage();
    const { services, employees, addOrder, updateOrder } = useData(); // Get employees
    const { user } = useAuth(); // Get current user

    const normalizeStatus = (status) => {
        const s = String(status || '').toLowerCase().trim();
        if (s === 'pending') return 'underreview';
        return s;
    };

    const [formData, setFormData] = useState({
        requestId: '',
        serviceType: 'Custom',
        status: 'underreview',
        createdAt: '',
        assignedEmployeeUserId: null,
        fileUrls: [],
        userId: '',
        serviceDetails: {
            serviceName: '',
            details: '',
            contactNumber: ''
        },
        price: null
    });

    useEffect(() => {
        if (order) {
            setFormData({
                requestId: order.id,
                serviceType: order.service,
                status: normalizeStatus(order.status),
                createdAt: order.date,
                assignedEmployeeUserId: order.assignedTo,
                fileUrls: order.attachments || [],
                userId: order.customer,
                serviceDetails: order.serviceDetails || {
                    serviceName: '',
                    details: '',
                    contactNumber: ''
                },
                price: order.amount
            });
        }
    }, [order]);

    const renderServiceDetails = () => {
        if (!formData.serviceDetails || Object.keys(formData.serviceDetails).length === 0) return null;

        return (
            <div className="p-4 bg-white/5 rounded-xl border border-glass-border space-y-3">
                <h4 className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    {t('serviceAdditionalDetails') || 'تفاصيل إضافية للخدمة'}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.serviceDetails).map(([key, value]) => {
                        if (value === null || value === undefined) return null;
                        return (
                            <div key={key}>
                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{t(key) || key}</p>
                                <p className="text-sm font-medium text-slate-200">
                                    {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'view') return;

        const orderData = {
            requestId: formData.requestId,
            serviceType: formData.serviceType,
            status: formData.status,
            assignedEmployeeUserId: formData.assignedEmployeeUserId,
            userId: formData.userId,
            serviceDetails: formData.serviceDetails,
            price: Number(formData.price)
        };

        if (mode === 'edit') {
            updateOrder({
                ...order,
                ...orderData
            });
        } else {
            addOrder(orderData);
        }
        onClose();
    };

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        const selectedService = services.find(s => s.name === serviceId);
        setFormData({
            ...formData,
            service: serviceId,
            amount: selectedService ? selectedService.price : ''
        });
    };

    const isView = mode === 'view';
    const isAdmin = user?.role === 'admin';
    const isEmployee = user?.role === 'employee';

    const getTitle = () => {
        if (mode === 'view') return t('viewOrder') || 'عرض الطلب';
        if (mode === 'edit') return t('editOrder') || 'تعديل الطلب';
        return t('addOrder');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#1e293b] rounded-2xl border border-glass-border shadow-2xl overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-glass-border flex justify-between items-center bg-white/5 sticky top-0 backdrop-blur-md z-10">
                    <h3 className="text-xl font-bold text-white">{getTitle()}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-primary font-bold text-sm uppercase tracking-wider">{t('orderDetails') || 'تفاصيل الطلب'}</h4>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('requestId')}</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm opacity-50"
                                    value={formData.requestId}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('userId')}</label>
                                <input
                                    type="text"
                                    required
                                    disabled={isView || mode === 'edit'}
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all disabled:opacity-50"
                                    value={formData.userId}
                                    onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('serviceType')}</label>
                                <select
                                    required
                                    disabled={isView || mode === 'edit'}
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all [&>option]:bg-[#1e293b]"
                                    value={formData.serviceType}
                                    onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                                >
                                    <option value="Custom">{t('custom')}</option>
                                    {/* Add other service types if needed */}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('serviceName')}</label>
                                <input
                                    type="text"
                                    required
                                    disabled={isView || mode === 'edit'}
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all disabled:opacity-50"
                                    value={formData.serviceDetails.serviceName}
                                    onChange={e => setFormData({ ...formData, serviceDetails: { ...formData.serviceDetails, serviceName: e.target.value } })}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('details')}</label>
                                <textarea
                                    disabled={isView || (mode === 'edit' && user?.role !== 'admin')}
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all h-20 resize-none disabled:opacity-50"
                                    value={formData.serviceDetails.details}
                                    onChange={e => setFormData({ ...formData, serviceDetails: { ...formData.serviceDetails, details: e.target.value } })}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('contactNumber')}</label>
                                <input
                                    type="text"
                                    required
                                    disabled={isView || mode === 'edit'}
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all disabled:opacity-50"
                                    value={formData.serviceDetails.contactNumber}
                                    onChange={e => setFormData({ ...formData, serviceDetails: { ...formData.serviceDetails, contactNumber: e.target.value } })}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('description')}</label>
                                <textarea
                                    disabled={isView || (mode === 'edit' && user?.role !== 'admin')}
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all h-24 resize-none disabled:opacity-50"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('price')}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        disabled={isView}
                                        className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all font-numbers disabled:opacity-50"
                                        value={formData.price || ''}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                    <span className="absolute left-4 top-3 text-slate-400 text-sm">SAR</span>
                                </div>
                            </div>
                        </div>

                        {/* Workflow Info (Status, Assignment, Files) */}
                        <div className="space-y-4">
                            <h4 className="text-primary font-bold text-sm uppercase tracking-wider">{t('workflow') || 'سير العمل'}</h4>

                            {/* Status - Editable by Admin & Employee */}
                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('status')}</label>
                                <select
                                    disabled={isView}
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all [&>option]:bg-[#1e293b] disabled:opacity-50"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="underreview">{t('underReview')}</option>
                                    <option value="pending">{t('pending')}</option>
                                    <option value="inprogress">{t('inProgress')}</option>
                                    <option value="waitingforpayment">{t('waitingForPayment')}</option>
                                    <option value="paid">{t('paid')}</option>
                                    <option value="completed">{t('completed')}</option>
                                    <option value="cancelled">{t('cancelled')}</option>
                                </select>
                            </div>

                            {/* Assign Task - Visible to all, Editable ONLY by Admin */}
                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('assignedTo') || 'مسند إلى'}</label>
                                {isView ? (
                                    <div className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm opacity-80">
                                        {formData.assignedEmployeeUserId 
                                            ? (employees.find(emp => emp.id === formData.assignedEmployeeUserId || emp.userName === formData.assignedEmployeeUserId)?.name || formData.assignedEmployeeUserId)
                                            : (t('unassigned') || 'غير مسند')
                                        }
                                    </div>
                                ) : (
                                    <select
                                        disabled={!isAdmin}
                                        className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all [&>option]:bg-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={formData.assignedEmployeeUserId || ''}
                                        onChange={e => setFormData({ ...formData, assignedEmployeeUserId: e.target.value })}
                                    >
                                        <option value="">{t('unassigned') || 'غير مسند'}</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                )}
                                {!isAdmin && mode !== 'add' && <p className="text-xs text-slate-500 mt-1">* {t('onlyAdminCanAssign') || 'فقط المشرف يمكنه تعيين الموظفين'}</p>}
                            </div>

                            {/* File URLs - Read Only */}
                            <div>
                                <label className="block text-slate-300 text-sm mb-2">{t('fileUrls') || 'روابط الملفات'}</label>
                                <div className="space-y-2">
                                    {formData.fileUrls.length === 0 ? (
                                        <div className="p-3 rounded-xl border border-dashed border-glass-border text-center text-slate-500 text-sm">
                                            {t('noFiles') || 'لا توجد ملفات'}
                                        </div>
                                    ) : (
                                        formData.fileUrls.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-glass-border group hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                                        <span className="material-symbols-outlined text-sm">description</span>
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-white truncate w-full" title={file.name}>{file.name}</p>
                                                        <p className="text-[10px] text-slate-400 scale-90 origin-right">{file.size || '---'}</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-white transition-colors p-1"
                                                >
                                                    <span className="material-symbols-outlined text-lg">download</span>
                                                </a>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Service Details */}
                    {isView && renderServiceDetails()}

                    <div className="pt-6 mt-6 border-t border-glass-border flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/5 border border-glass-border text-white rounded-xl font-medium hover:bg-white/10 transition-all ml-auto"
                        >
                            {isView ? t('close') || 'إغلاق' : t('cancel')}
                        </button>
                        {!isView && (
                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-glow transition-all shadow-glow"
                            >
                                {t('save')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;
