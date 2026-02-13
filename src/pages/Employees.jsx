import React, { useState } from 'react';
import GlassPanel from '../components/common/GlassPanel';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';
import { useData } from '../contexts/DataContext';

const Employees = () => {
    const { t } = useLanguage();
    const { isDark } = useTheme();
    // assignTask is not yet implemented fully in context to call API, but let's use it.
    // need to expose assignTask from context
    const { employees, orders, addEmployee, assignTask, fetchData } = useData();

    // Derive unassigned tasks from orders
    const unassignedTasks = orders.filter(o => o.status === 'pending' && !o.assignedTo);

    // Modal states
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    // Selected employee for operations
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editEmployee, setEditEmployee] = useState({ id: '', UserName: '', email: '', phoneNumber: '', role: '', password: '', status: 'available' });
    const [newEmployee, setNewEmployee] = useState({ UserName: '', email: '', phoneNumber: '', role: 'employee', password: '', status: 'available' });
    const [selectedTaskId, setSelectedTaskId] = useState('');

    // Stats
    const totalEmployees = employees.length;
    const availableEmployees = employees.filter(e => e.status === 'available').length;
    const busyEmployees = employees.filter(e => e.status === 'busy').length;
    const totalActiveTasks = employees.reduce((sum, e) => (e.activeTasks || 0), 0); // Ensure activeTasks exists

    // View employee
    const handleView = (employee) => {
        setSelectedEmployee(employee);
        setIsViewModalOpen(true);
    };

    // Open edit modal
    const handleEdit = (employee) => {
        setEditEmployee({ ...employee });
        setIsEditModalOpen(true);
    };

    // Save edit
    const handleSaveEdit = async () => {
        if (!editEmployee.UserName || !editEmployee.email) return;
        // API for updating employee not listed.
        alert("Update functionality not connected to backend.");
        // If we had an endpoint: await updateEmployee(editEmployee);

        setIsEditModalOpen(false);
        setEditEmployee({ id: '', UserName: '', email: '', phoneNumber: '', role: '', password: '', status: 'available' });
    };

    // Delete employee
    const handleDelete = async (employeeId) => {
        if (window.confirm(t('confirmDeleteEmployee'))) {
            // API for delete employee not listed explicitly, maybe use suspend? 
            // Or maybe create-employee implies only creation?
            alert("Delete functionality not connected to backend.");
        }
    };

    // Add new employee
    const handleAddEmployee = async () => {
        if (!newEmployee.UserName || !newEmployee.email || !newEmployee.password || !newEmployee.phoneNumber) {
            alert("Please fill all required fields: UserName, Email, Password, and Phone Number.");
            return;
        }

        try {
            await addEmployee(newEmployee);
            alert(t('employeeAdded'));
            setIsAddModalOpen(false);
            setNewEmployee({ UserName: '', email: '', phoneNumber: '', role: 'employee', password: '', status: 'available' });
            await fetchData(); // Refresh list
        } catch (error) {
            console.error(error);
            const errorData = error.response?.data;
            let msg = "Failed to add employee";
            if (errorData?.errors) {
                msg += ": " + Object.values(errorData.errors).flat().join(", ");
            } else if (errorData?.message) {
                msg += ": " + errorData.message;
            }
            alert(msg);
        }
    };

    // Open assign task modal
    const handleOpenAssignModal = (employee) => {
        setSelectedEmployee(employee);
        setSelectedTaskId('');
        setIsAssignModalOpen(true);
    };

    // Assign task to employee
    const handleAssignTask = async () => {
        if (!selectedTaskId || !selectedEmployee) return;

        try {
            // Use context action
            await assignTask(selectedTaskId, selectedEmployee.id);

            // Refetch to update UI
            await fetchData();

            setIsAssignModalOpen(false);
            setSelectedEmployee(null);
            setSelectedTaskId('');
            alert(t('taskAssigned'));
        } catch (e) {
            console.error(e);
            alert("Failed to assign task");
        }
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedEmployee(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditEmployee({ id: '', name: '', email: '', phone: '', role: '', password: '', status: 'available' });
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewEmployee({ UserName: '', email: '', phoneNumber: '', role: 'employee', password: '', status: 'available' });
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedEmployee(null);
        setSelectedTaskId('');
    };

    const getStatusLabel = (status) => {
        return status === 'available' ? t('available') : t('busy');
    };

    const getStatusStyles = (status) => {
        return status === 'available'
            ? 'bg-success/10 border-success/20 text-success'
            : 'bg-warning/10 border-warning/20 text-warning';
    };

    const getRoleLabel = (role) => {
        if (role === 'manager') return t('admin');
        return t('employee');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('employees')}</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow"
                >
                    {t('addEmployee')}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined">badge</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('totalEmployees')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-primary-glow transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{totalEmployees}</h3>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-success/20 text-success">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('available')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-success transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{availableEmployees}</h3>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-warning/20 text-warning">
                            <span className="material-symbols-outlined">pending</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('busy')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-warning transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{busyEmployees}</h3>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 flex flex-col gap-4 group" hoverEffect>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-info/20 text-info">
                            <span className="material-symbols-outlined">task</span>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('activeTasks')}</p>
                        <h3 className={`text-2xl font-bold font-numbers tracking-tight group-hover:text-info transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{totalActiveTasks}</h3>
                    </div>
                </GlassPanel>
            </div>

            {/* Unassigned Tasks Alert */}
            {unassignedTasks.length > 0 && (
                <GlassPanel className="p-4 bg-warning/10 border-warning/30">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-warning">warning</span>
                        <p className="text-warning text-sm">
                            {t('unassignedTasks')}: <strong className="font-numbers">{unassignedTasks.length}</strong>
                        </p>
                    </div>
                </GlassPanel>
            )}

            {/* Employees Table */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('employeeList')}</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`text-right text-sm border-b ${isDark ? 'text-slate-400 border-glass-border' : 'text-slate-500 border-slate-200'}`}>
                                <th className="pb-3 px-4 font-medium">{t('employeeName')}</th>
                                <th className="pb-3 px-4 font-medium">{t('role')}</th>
                                <th className="pb-3 px-4 font-medium">{t('email')}</th>
                                <th className="pb-3 px-4 font-medium">{t('activeTasks')}</th>
                                <th className="pb-3 px-4 font-medium">{t('completedTasks')}</th>
                                <th className="pb-3 px-4 font-medium">{t('status')}</th>
                                <th className="pb-3 px-4 font-medium">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {employees.map((employee) => (
                                <tr key={employee.id} className={`border-b transition-colors last:border-0 ${isDark ? 'border-glass-border hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <td className="py-3 px-4 font-bold">{employee.userName || employee.UserName}</td>
                                    <td className="py-3 px-4">{getRoleLabel(employee.role)}</td>
                                    <td className={`py-3 px-4 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{employee.email}</td>
                                    <td className="py-3 px-4 font-numbers text-center text-primary">{employee.activeTasks}</td>
                                    <td className="py-3 px-4 font-numbers text-center text-success">{employee.completedTasks}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full ${getStatusStyles(employee.status)} text-xs font-medium`}>
                                            {getStatusLabel(employee.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(employee)}
                                                className="text-primary hover:text-primary-glow text-sm font-medium transition-colors"
                                            >
                                                {t('view')}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(employee)}
                                                className="text-info hover:text-info-glow text-sm font-medium transition-colors"
                                            >
                                                {t('edit')}
                                            </button>
                                            <button
                                                onClick={() => handleOpenAssignModal(employee)}
                                                className="text-warning hover:text-warning-glow text-sm font-medium transition-colors"
                                            >
                                                {t('assignTask')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
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

                {employees.length === 0 && (
                    <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t('noData')}
                    </div>
                )}
            </GlassPanel>

            {/* View Employee Modal */}
            {isViewModalOpen && selectedEmployee && (
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

                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('employeeDetails')}</h3>

                        <div className="space-y-4">
                            <div className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl font-bold text-primary uppercase">
                                    {(selectedEmployee.userName || selectedEmployee.UserName || '?').charAt(0)}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedEmployee.userName || selectedEmployee.UserName}</h4>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{getRoleLabel(selectedEmployee.role)}</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('email')}</p>
                                <p className={`font-mono text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedEmployee.email}</p>
                            </div>

                            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('phone')}</p>
                                <p className={`font-numbers ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedEmployee.phoneNumber || selectedEmployee.phone}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('activeTasks')}</p>
                                    <p className="text-info font-bold font-numbers text-xl">{selectedEmployee.activeTasks}</p>
                                </div>
                                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('completedTasks')}</p>
                                    <p className="text-success font-bold font-numbers text-xl">{selectedEmployee.completedTasks}</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('status')}</p>
                                <span className={`px-3 py-1 rounded-full ${getStatusStyles(selectedEmployee.status)} text-xs font-medium`}>
                                    {getStatusLabel(selectedEmployee.status)}
                                </span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        closeViewModal();
                                        handleOpenAssignModal(selectedEmployee);
                                    }}
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow"
                                >
                                    {t('assignTask')}
                                </button>
                                <button
                                    onClick={closeViewModal}
                                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                                >
                                    {t('close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Employee Modal */}
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

                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('edit')} {t('employee')}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('employeeName')}</label>
                                <input
                                    type="text"
                                    value={editEmployee.UserName}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, UserName: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('email')}</label>
                                <input
                                    type="email"
                                    value={editEmployee.email}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('phone')}</label>
                                <input
                                    type="tel"
                                    value={editEmployee.phoneNumber}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, phoneNumber: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('role')}</label>
                                <select
                                    value={editEmployee.role}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                >
                                    <option value="manager">{t('admin')}</option>
                                    <option value="employee">{t('employee')}</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('newPassword')}</label>
                                <input
                                    type="password"
                                    value={editEmployee.password}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, password: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('status')}</label>
                                <select
                                    value={editEmployee.status}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, status: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                >
                                    <option value="available">{t('available')}</option>
                                    <option value="busy">{t('busy')}</option>
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

            {/* Add Employee Modal */}
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

                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('addEmployee')}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('employeeName')}</label>
                                <input
                                    type="text"
                                    value={newEmployee.UserName}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, UserName: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('email')}</label>
                                <input
                                    type="email"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('phone')}</label>
                                <input
                                    type="tel"
                                    value={newEmployee.phoneNumber}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('role')}</label>
                                <select
                                    value={newEmployee.role}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                >
                                    <option value="manager">{t('admin')}</option>
                                    <option value="employee">{t('employee')}</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('password')}</label>
                                <input
                                    type="password"
                                    value={newEmployee.password}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleAddEmployee}
                                    className="flex-1 px-4 py-3 bg-success text-white rounded-xl text-sm font-medium hover:bg-success-dark transition-all shadow-glow"
                                >
                                    {t('add')} {t('employee')}
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

            {/* Assign Task Modal */}
            {isAssignModalOpen && selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeAssignModal}
                    ></div>

                    <div className={`relative border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-[#1e293b] border-glass-border' : 'bg-white border-slate-200'}`}>
                        <button
                            onClick={closeAssignModal}
                            className={`absolute top-4 left-4 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('assignTask')}</h3>
                        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('assignedTo')}: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedEmployee.name}</span>
                        </p>

                        <div className="space-y-4">
                            {unassignedTasks.length > 0 ? (
                                <>
                                    <div>
                                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('unassignedTasks')}</label>
                                        <select
                                            value={selectedTaskId}
                                            onChange={(e) => setSelectedTaskId(e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${isDark ? 'bg-background-dark border-glass-border text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                                        >
                                            <option value="">{t('selectService')}</option>
                                            {unassignedTasks.map(task => (
                                                <option key={task.id} value={task.id}>
                                                    {task.title} - {task.customer}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedTaskId && (
                                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-glass-border' : 'bg-slate-50 border-slate-200'}`}>
                                            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('orderDetails')}</p>
                                            {unassignedTasks.filter(t => t.id === Number(selectedTaskId)).map(task => (
                                                <div key={task.id}>
                                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{task.title}</p>
                                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('customer')}: {task.customer}</p>
                                                    <p className={`text-sm font-numbers ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('date')}: {task.date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={handleAssignTask}
                                            disabled={!selectedTaskId}
                                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('assignTask')}
                                        </button>
                                        <button
                                            onClick={closeAssignModal}
                                            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                                        >
                                            {t('cancel')}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-4xl text-success mb-4">check_circle</span>
                                    <p className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('noUnassignedTasks')}</p>
                                    <button
                                        onClick={closeAssignModal}
                                        className={`mt-6 px-6 py-3 rounded-xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-glass-border' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
                                    >
                                        {t('close')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
