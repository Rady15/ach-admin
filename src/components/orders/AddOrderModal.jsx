import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

const AddOrderModal = ({ onClose }) => {
    const { t } = useLanguage();
    const { services, addOrder } = useData();

    const [formData, setFormData] = useState({
        customer: '',
        service: '',
        amount: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.customer || !formData.service) return;

        addOrder({
            customer: formData.customer,
            service: formData.service,
            amount: Number(formData.amount),
        });
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-[#1e293b] rounded-2xl border border-glass-border shadow-2xl overflow-hidden transform transition-all">
                <div className="p-6 border-b border-glass-border flex justify-between items-center bg-white/5">
                    <h3 className="text-xl font-bold text-white">{t('addOrder')}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-slate-300 text-sm mb-2">{t('customerName')}</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all"
                            placeholder="Ex: Ahmed Alali"
                            value={formData.customer}
                            onChange={e => setFormData({ ...formData, customer: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm mb-2">{t('service')}</label>
                        <select
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all [&>option]:bg-[#1e293b]"
                            value={formData.service}
                            onChange={handleServiceChange}
                        >
                            <option value="">{t('selectService')}</option>
                            {services.map(service => (
                                <option key={service.id} value={service.name}>{t(service.name)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm mb-2">{t('price')}</label>
                        <div className="relative">
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all font-numbers"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                            <span className="absolute left-4 top-3 text-slate-400 text-sm">SAR</span>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white/5 border border-glass-border text-white rounded-xl font-medium hover:bg-white/10 transition-all"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-glow transition-all shadow-glow"
                        >
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOrderModal;
