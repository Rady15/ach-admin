import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { authAPI, servicesAPI, paymentsAPI, reportsAPI, pricingAPI, settingsAPI } from '../services/api';

const DataContext = createContext();

export function DataProvider({ children }) {
    const { user } = useAuth();
    const { t } = useLanguage();

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'processing': return 'info';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'slate-400';
        }
    };

    // State Initialization
    const [orders, setOrders] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [services, setServices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [payments, setPayments] = useState([]); // Mock or empty until endpoint provided
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        activeOrders: 0,
        totalCustomers: 0
    });
    const [loading, setLoading] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const userRole = String(user.role).toLowerCase();
            const isEmployee = userRole === 'staff' || userRole === 'employee';
            const isAdmin = !isEmployee;

            const fetchPromises = [
                isAdmin ? authAPI.getAllUsers() : Promise.resolve({ data: [] }),
                isEmployee ? servicesAPI.getMyRequests() : servicesAPI.getAllRequests(),
                paymentsAPI.getAllPayments(),
                pricingAPI.getAllServices()
            ];

            const [usersRes, requestRes, paymentsRes, servicesRes] = await Promise.allSettled(fetchPromises);

            if (usersRes.status === 'fulfilled') {
                // Handle different response structures (array or wrapped in data property)
                const responseData = usersRes.value.data;
                const allUsers = Array.isArray(responseData) ? responseData : (responseData.data || responseData.users || responseData.staff || []);
                
                console.log('AllStaff API Response:', responseData);
                console.log('Processed users array:', allUsers);

                // Define what constitutes an employee/staff role
                const employeeRoles = ['staff', 'employee', 'manager', 'admin', 'Staff', 'Employee', 'Manager', 'Admin'];

                // TEMP: Show all users as employees to debug
                const emps = allUsers.map(u => ({
                    ...u,
                    id: u.userName || u.id,
                    userName: u.userName,
                    name: u.fullName || u.userName || '---',
                    email: u.email,
                    phone: u.phoneNumber || '---',
                    activeTasks: u.activeTasks || 0,
                    completedTasks: u.completedTasks || 0,
                    status: (u.activeTasks > 0) ? 'busy' : 'available',
                    role: (u.role || u.userRole || (u.roles && u.roles[0]) || 'employee').toLowerCase()
                }));

                console.log('Filtered employees:', emps.length, emps);
                
                setEmployees(emps);
            } else {
                console.error("Failed to fetch users:", usersRes.reason);
            }

            // Fetch customers separately (admin only)
            if (isAdmin) {
                try {
                    const customersRes = await authAPI.getAllCustomers();
                    const customersData = customersRes.data;
                    const allCustomers = Array.isArray(customersData) ? customersData : (customersData.data || customersData.customers || customersData.users || []);
                    
                    console.log('Account/all API Response:', customersData);
                    console.log('Processed customers array:', allCustomers);

                    const custs = allCustomers.map(c => ({
                        ...c,
                        id: c.userName || c.id || c.email,
                        userName: c.userName || c.name || '---',
                        name: c.fullName || c.userName || c.name || '---',
                        email: c.email || '---',
                        phone: c.phoneNumber || c.phone || '---',
                        status: c.isActive !== false ? 'active' : 'inactive',
                        totalSpent: c.totalSpent || c.totalOrdersAmount || 0,
                        ordersCount: c.ordersCount || c.totalOrders || 0,
                        createdAt: c.createdAt || c.registrationDate || new Date().toISOString()
                    }));

                    console.log('Processed customers:', custs.length, custs);
                    setCustomers(custs);
                } catch (error) {
                    console.error("Failed to fetch customers:", error);
                    setCustomers([]);
                }
            }

            if (requestRes.status === 'fulfilled') {
                const mappedOrders = requestRes.value.data.map(order => ({
                    id: order.requestId,
                    customer: order.userId,
                    service: order.serviceType,
                    amount: order.price || 0,
                    price: order.price !== null ? order.price : (t ? t('notSet') : 'قيد التقدير'),
                    status: String(order.status).toLowerCase().trim(),
                    date: new Date(order.createdAt).toLocaleDateString('en-GB'),
                    attachments: order.fileUrls ? order.fileUrls.map(url => ({
                        name: url.split('/').pop(),
                        url: `https://ach.runasp.net${url}`,
                        size: '---'
                    })) : [],
                    serviceDetails: order.serviceDetails || {},
                    assignedTo: order.employeeId || null,
                    statusColor: getStatusColor(String(order.status).toLowerCase())
                }));
                setOrders(mappedOrders);
            } else {
                console.error("Failed to fetch requests:", requestRes.reason);
            }

            if (paymentsRes.status === 'fulfilled') {
                setPayments(paymentsRes.value.data);
            } else {
                console.error("Failed to fetch payments:", paymentsRes.reason);
            }

            if (servicesRes.status === 'fulfilled') {
                setServices(servicesRes.value.data);
            } else {
                console.error("Failed to fetch services:", servicesRes.reason);
            }

        } catch (error) {
            console.error("Error in fetchData:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    // Update stats whenever data changes
    useEffect(() => {
        const totalOrders = orders.length;
        const activeOrders = orders.filter(o =>
            ['pending', 'processing'].includes(o.status?.toLowerCase())
        ).length;
        const totalCustomers = customers.length;
        const totalRevenue = orders
            .filter(o => o.status?.toLowerCase() === 'completed')
            .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        setStats({
            totalOrders,
            activeOrders,
            totalCustomers,
            totalRevenue
        });
    }, [orders, customers]);

    // --- Actions ---

    const addEmployee = async (employeeData) => {
        try {
            const res = await authAPI.createEmployee(employeeData);
            // Optimistically update or refetch
            // Using refetch to be safe or append if backend returns full object
            setEmployees(prev => [...prev, res.data]);
            return res.data;
        } catch (error) {
            console.error("Error adding employee:", error);
            throw error;
        }
    };

    const addOrder = (order) => {
        // TODO: Implement API call
        const newOrder = {
            id: `#ORD-${String(orders.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            paymentStatus: 'unpaid',
            assignedTo: '',
            description: '',
            ...order
        };
        setOrders([newOrder, ...orders]);
    };

    const updateOrder = async (updatedOrder) => {
        try {
            const oldOrder = orders.find(o => o.id === updatedOrder.id);
            if (!oldOrder) return;

            // Handle Price Change
            if (updatedOrder.amount !== oldOrder.amount) {
                // Ensure price is formatted as expected by API (string or double?) 
                // User JSON showed "price": "200.00"
                await servicesAPI.setPrice(updatedOrder.id, updatedOrder.amount);
            }

            // Handle Status Change
            if (updatedOrder.status !== oldOrder.status) {
                await servicesAPI.updateRequestStatus(updatedOrder.id, updatedOrder.status);
            }

            // Refetch to ensure we are in sync
            await fetchData();

        } catch (error) {
            console.error("Failed to update order:", error);
            // Optionally revert local state or show error
            throw error;
        }
    };

    const updateOrderStatus = async (id, status) => {
        // TODO: Implement API call when endpoint available.
        // For now, update local state or do nothing? 
        // Better to not break UI:
        setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
    };

    const assignTask = async (orderId, employeeId) => {
        try {
            await servicesAPI.assignRequestToEmployee(orderId, employeeId);
            // Refresh data after assignment
            await fetchData();
        } catch (error) {
            console.error("Failed to assign task:", error);
            throw error;
        }
    };

    // Service Actions
    const addService = async (service) => {
        try {
            const res = await pricingAPI.createService(service);
            setServices(prev => [...prev, res.data]);
            return res.data;
        } catch (error) {
            console.error("Error adding service:", error);
            throw error;
        }
    };

    const updateService = async (updatedService) => {
        try {
            await pricingAPI.updateService(updatedService.id, updatedService);
            setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
        } catch (error) {
            console.error("Error updating service:", error);
            throw error;
        }
    };

    const deleteService = async (id) => {
        try {
            await pricingAPI.deleteService(id);
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting service:", error);
            throw error;
        }
    };

    const deleteCustomer = async (id) => {
        try {
            await authAPI.deleteCustomer(id);
            setCustomers(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting customer:", error);
            throw error;
        }
    };

    return (
        <DataContext.Provider value={{
            orders,
            employees,
            services,
            customers,
            payments,
            stats,
            addOrder,
            updateOrder,
            updateOrderStatus,
            assignTask,
            addEmployee,
            deleteCustomer,
            loading, // Expose loading state
            fetchData // Expose refetch capability
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
