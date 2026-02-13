import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AddEmployeeModal = ({ onClose, onAdd }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'معقب', // Default role
        status: 'available'
    });

    const roles = ['معقب', 'محاسب', 'خدمة عملاء', 'مدير مشاريع', 'مطور'];

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-[#1e293b] rounded-2xl border border-glass-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-glass-border flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold text-white">{t('addEmployee')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">الاسم الكامل</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                            placeholder="اسم الموظف"
                        />
                    </div>

                    {/* Email & Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">البريد الإلكتروني (اسم المستخدم)</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm dir-ltr"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">كلمة المرور</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm dir-ltr"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Phone & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">رقم الهاتف</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-numbers dir-ltr text-right"
                                placeholder="05xxxxxxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">الدور الوظيفي</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm appearance-none"
                            >
                                {roles.map(role => (
                                    <option key={role} value={role} className="bg-slate-900 text-white">{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-all"
                        >
                            {t('cancel') || 'إلغاء'}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-glow shadow-glow transition-all"
                        >
                            {t('save') || 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
