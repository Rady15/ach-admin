import React, { useState } from 'react';
import GlassPanel from '../components/common/GlassPanel';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { settingsAPI } from '../services/api';

const Settings = () => {
    const { t, language, toggleLanguage } = useLanguage();
    const { theme, toggleTheme, isDark } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('account');

    // Account form state
    const [accountForm, setAccountForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || '',
        description: ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Notification settings
    const [notifications, setNotifications] = useState({
        system: true,
        newOrders: true,
        messages: false,
        weeklyReports: true
    });

    // Security settings
    const [securitySettings, setSecuritySettings] = useState({
        twoFactor: true,
        loginLogs: true,
        securityAlerts: true
    });

    // Tabs Configuration
    const tabs = [
        { id: 'account', label: t('account'), icon: 'person' },
        { id: 'security', label: t('security'), icon: 'security' },
        { id: 'notifications', label: t('notifications'), icon: 'notifications' },
        { id: 'privacy', label: t('privacy'), icon: 'privacy_tip' },
    ];

    // Handle account form save
    const handleSaveAccount = async () => {
        try {
            await settingsAPI.updateProfile(accountForm);
            alert(t('success'));
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile: " + (error.response?.data?.message || error.message));
        }
    };

    // Handle password change
    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!passwordForm.currentPassword) {
            setPasswordError(t('required'));
            return;
        }
        if (!passwordForm.newPassword) {
            setPasswordError(t('required'));
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError(t('passwordTooShort'));
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError(t('passwordMismatch'));
            return;
        }

        try {
            await settingsAPI.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordSuccess(t('passwordChanged'));
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Failed to change password:", error);
            setPasswordError("Failed to change password: " + (error.response?.data?.message || error.message));
        }
    };

    // Handle notification toggle
    const handleNotificationToggle = async (key) => {
        const newNotifications = { ...notifications, [key]: !notifications[key] };
        setNotifications(newNotifications);
        try {
            await settingsAPI.updateNotificationSettings(newNotifications);
        } catch (error) {
            console.error("Failed to update notification settings:", error);
            alert("Failed to update notification settings: " + (error.response?.data?.message || error.message));
        }
    };

    // Handle security toggle
    const handleSecurityToggle = async (key) => {
        const newSecuritySettings = { ...securitySettings, [key]: !securitySettings[key] };
        setSecuritySettings(newSecuritySettings);
        try {
            await settingsAPI.updateSecuritySettings(newSecuritySettings);
        } catch (error) {
            console.error("Failed to update security settings:", error);
            alert("Failed to update security settings: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('settings')}</h2>

            {/* Tabs Navigation */}
            <GlassPanel className="p-1">
                <div className="flex overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl whitespace-nowrap transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                ? 'text-primary bg-primary/10'
                                : isDark ? 'text-slate-500 hover:text-primary hover:bg-white/5' : 'text-slate-500 hover:text-primary hover:bg-slate-100'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </GlassPanel>

            {/* Tab Content */}
            <div className="min-h-[400px]">

                {/* ACCOUNT TAB */}
                {activeTab === 'account' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Settings */}
                        <GlassPanel className="p-6 lg:col-span-2">
                            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('accountSettings')}</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-white/10">
                                        <span className="material-symbols-outlined text-primary text-3xl">person</span>
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{accountForm.name}</h4>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{accountForm.role}</p>
                                        <button className="mt-2 text-primary hover:text-primary-glow text-sm font-medium transition-colors">{t('changePhoto')}</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('fullName')}</label>
                                        <input
                                            type="text"
                                            value={accountForm.name}
                                            onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('email')}</label>
                                        <input
                                            type="email"
                                            value={accountForm.email}
                                            onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none dir-ltr ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('phone')}</label>
                                        <input
                                            type="tel"
                                            value={accountForm.phone}
                                            onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-numbers dir-ltr text-right ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('job')}</label>
                                        <input
                                            type="text"
                                            value={accountForm.role}
                                            onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('description')}</label>
                                    <textarea
                                        value={accountForm.description}
                                        onChange={(e) => setAccountForm({ ...accountForm, description: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleSaveAccount}
                                        className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-glow shadow-glow transition-all"
                                    >
                                        {t('saveChanges')}
                                    </button>
                                    <button className={`px-6 py-3 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/5 text-white hover:bg-white/10 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}>
                                        {t('cancel')}
                                    </button>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Quick Actions */}
                        <GlassPanel className="p-6 h-fit">
                            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('quickActions')}</h3>
                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                    <h4 className={`font-medium mb-2 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('language')}</h4>
                                    <button
                                        onClick={toggleLanguage}
                                        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm hover:border-primary transition-colors ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                    >
                                        <span>{language === 'ar' ? 'العربية' : 'English'}</span>
                                        <span className="material-symbols-outlined text-xs">sync_alt</span>
                                    </button>
                                </div>

                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                    <h4 className={`font-medium mb-2 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('theme')}</h4>
                                    <button
                                        onClick={toggleTheme}
                                        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm hover:border-primary transition-colors ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                    >
                                        <span>{theme === 'dark' ? t('dark') : t('light')}</span>
                                        <span className="material-symbols-outlined text-xs">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
                                    </button>
                                </div>

                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                    <h4 className={`font-medium mb-2 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('systemManagement')}</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => alert(t('loading'))}
                                            className={`w-full text-right text-xs py-1.5 transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-800'}`}
                                        >
                                            {t('systemUpdate')}
                                        </button>
                                        <button
                                            onClick={() => alert(t('success'))}
                                            className={`w-full text-right text-xs py-1.5 transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-800'}`}
                                        >
                                            {t('backup')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(t('confirmDelete'))) {
                                                    alert(t('success'));
                                                }
                                            }}
                                            className="w-full text-right text-red-400/80 hover:text-red-400 text-xs py-1.5 transition-colors"
                                        >
                                            {t('resetSystem')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                    <GlassPanel className="p-6">
                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('securitySettings')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password Change */}
                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('changePassword')}</h4>

                                {passwordError && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                        {passwordError}
                                    </div>
                                )}

                                {passwordSuccess && (
                                    <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-xl text-success text-sm">
                                        {passwordSuccess}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('currentPassword')}</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-primary transition-all ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('newPassword')}</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-primary transition-all ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('confirmPassword')}</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-primary transition-all ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        />
                                    </div>
                                    <button
                                        onClick={handleChangePassword}
                                        className="w-full px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-glow shadow-glow transition-all"
                                    >
                                        {t('changePassword')}
                                    </button>
                                </div>
                            </div>

                            {/* Security Options */}
                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('security')}</h4>
                                <div className="space-y-4">
                                    {[
                                        { key: 'twoFactor', label: t('twoFactorAuth') },
                                        { key: 'loginLogs', label: t('loginLogs') },
                                        { key: 'securityAlerts', label: t('securityAlerts') },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between">
                                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={securitySettings[item.key]}
                                                    onChange={() => handleSecurityToggle(item.key)}
                                                />
                                                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success"></div>
                                            </label>
                                        </div>
                                    ))}

                                    <div className={`pt-4 border-t ${isDark ? 'border-glass-border' : 'border-slate-200'}`}>
                                        <h5 className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('activeDevices')}</h5>
                                        <div className="space-y-3">
                                            <div className={`flex items-center justify-between text-sm p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-slate-400 text-base">laptop_mac</span>
                                                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Chrome - Riyadh</span>
                                                </div>
                                                <span className="text-success text-xs font-bold px-2 py-1 bg-success/10 rounded">{t('active')}</span>
                                            </div>
                                            <div className={`flex items-center justify-between text-sm p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-slate-400 text-base">phone_iphone</span>
                                                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Safari - Jeddah</span>
                                                </div>
                                                <button
                                                    onClick={() => alert(t('success'))}
                                                    className="text-red-400 text-xs font-bold px-2 py-1 bg-red-500/10 rounded hover:bg-red-500/20 transition-colors"
                                                >
                                                    {t('endSession')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                    <GlassPanel className="p-6">
                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('notificationSettings')}</h3>
                        <div className="space-y-4 max-w-2xl">
                            {[
                                { key: 'system', title: t('systemNotifications'), desc: 'Receive updates about system status and maintenance' },
                                { key: 'newOrders', title: t('newOrderNotifications'), desc: 'Get notified when new orders are received' },
                                { key: 'messages', title: t('messages'), desc: 'Receive notifications for incoming customer messages' },
                                { key: 'weeklyReports', title: t('weeklyReports'), desc: 'Receive weekly performance summary via email' },
                            ].map((item) => (
                                <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                    <div>
                                        <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.title}</h4>
                                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notifications[item.key]}
                                            onChange={() => handleNotificationToggle(item.key)}
                                        />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            ))}

                            <div className="pt-4">
                                <button
                                    onClick={() => alert(t('success'))}
                                    className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-glow shadow-glow transition-all"
                                >
                                    {t('savePreferences')}
                                </button>
                            </div>
                        </div>
                    </GlassPanel>
                )}

                {/* PRIVACY TAB */}
                {activeTab === 'privacy' && (
                    <GlassPanel className="p-6">
                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('privacy')}</h3>
                        <div className={`space-y-6 max-w-3xl text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <p>
                                We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and share your information when you use our system.
                            </p>
                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('dataCollection')}</h4>
                                <p>We collect information you provide directly, such as when creating an account, updating your profile, or using our support services.</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('dataSharing')}</h4>
                                <p>We do not sell your personal data to third parties. We may share your information only when required by law or to protect our rights.</p>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => alert(t('loading'))}
                                    className={`px-4 py-2 rounded-lg border transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-glass-border' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}
                                >
                                    {t('downloadMyData')}
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm(t('confirmDelete'))) {
                                            alert(t('success'));
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all"
                                >
                                    {t('deleteAccount')}
                                </button>
                            </div>
                        </div>
                    </GlassPanel>
                )}

            </div>
        </div>
    );
};

export default Settings;
