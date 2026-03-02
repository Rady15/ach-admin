import axios from 'axios';

// Change this to change the API base URL
const BASE_URL = import.meta.env.PROD ? 'https://ach.runasp.net/api' : '/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        let errorMessage = 'An error occurred';
        
        if (status === 400) errorMessage = 'error400';
        else if (status === 401) errorMessage = 'error401';
        else if (status === 403) errorMessage = 'error403';
        else if (status === 404) errorMessage = 'error404';
        else if (status === 500) errorMessage = 'error500';
        else if (status === 502) errorMessage = 'error502';
        else if (!error.response) errorMessage = 'errorNetwork';
        
        error.errorKey = errorMessage;
        return Promise.reject(error);
    }
);

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            const { token } = JSON.parse(user);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email, password) => api.post('/Account/login', { email, password }),
    getAllUsers: () => api.get('/Account/AllStaff'),
    getAllCustomers: () => api.get('/Account/all'),
    deleteCustomer: (id) => api.delete(`/Account/${id}`),
    suspendUser: (id) => api.put(`/Account/suspend/${id}`),
    unsuspendUser: (id) => api.put(`/Account/unsuspend/${id}`),
    getStats: () => api.get('/Account/stats'),
    createEmployee: (employeeData) => api.post('/Account/create-employee', {
        email: employeeData.email,
        userName: employeeData.userName || employeeData.UserName,
        password: employeeData.password,
        role: employeeData.role === 'manager' ? 'Admin' : 'Staff',
        phoneNumber: employeeData.phoneNumber
    }),
};

export const servicesAPI = {
    getAllRequests: () => api.get('/UserServices/all'),
    getMyRequests: () => api.get('/UserServices/my-requests'),
    getMyAllServices: () => {
        console.warn('UserServices API not yet implemented on backend');
        return Promise.resolve({ data: [] });
    },
    getAllZakat: () => {
        console.warn('UserServices API not yet implemented on backend');
        return Promise.resolve({ data: [] });
    },
    setPrice: (requestId, price) => api.put('/UserServices/set-price', { requestId, price }),
    getAllRequestsBasic: () => {
        console.warn('UserServices API not yet implemented on backend');
        return Promise.resolve({ data: [] });
    },
    getStatusCounts: () => {
        console.warn('UserServices API not yet implemented on backend');
        return Promise.resolve({ data: { pending: 0, inProgress: 0, completed: 0 } });
    },
    assignRequestToEmployee: (requestId, employeeUserId) => api.post('/UserServices/assign-request', { requestId, employeeUserId }),
    updateRequestStatus: (requestId, status) => api.put('/UserServices/update-status', { requestId, status }),
    deleteRequest: (requestId) => {
        console.warn('UserServices API not yet implemented on backend');
        return Promise.resolve({ data: null });
    },
};

// Payments API
export const paymentsAPI = {
    getAllPayments: () => api.get('/Payment/all').catch(() => ({ data: [] })),
    getPaymentById: (id) => api.get(`/Payment/${id}`),
    createPayment: (paymentData) => api.post('/Payment', paymentData),
    updatePayment: (id, paymentData) => api.put(`/Payment/${id}`, paymentData),
    deletePayment: (id) => api.delete(`/Payment/${id}`),
    getPaymentsStats: () => api.get('/Payment/statistics').catch(() => ({ 
        data: { totalPaidAmount: 0, totalPendingAmount: 0, successfulPayments: 0, pendingPayments: 0, failedPayments: 0, refundedPayments: 0 } 
    })),
};

// Reports API - Placeholder for future implementation
export const reportsAPI = {
    getOrdersReport: (params) => {
        console.warn('Reports API not yet implemented on backend');
        return Promise.resolve({ data: [] });
    },
    getPaymentsReport: (params) => {
        console.warn('Reports API not yet implemented on backend');
        return Promise.resolve({ data: [] });
    },
    getCustomersReport: (params) => {
        console.warn('Reports API not yet implemented on backend');
        return Promise.resolve({ data: [] });
    },
    getPerformanceReport: (params) => {
        console.warn('Reports API not yet implemented on backend');
        return Promise.resolve({ data: [] });
    },
};

// Pricing API
export const pricingAPI = {
    getAllServices: () => {
        console.warn('Pricing API (Services/all) not yet implemented on backend, using mock data');
        return Promise.resolve({
            data: [
                { id: 1, name: 'zakat_calculation', price: 100 },
                { id: 2, name: 'vat_filing', price: 200 },
                { id: 3, name: 'company_formation', price: 500 }
            ]
        });
    },
    getServiceById: (id) => {
        console.warn('Pricing API not yet implemented on backend');
        return Promise.resolve({ data: null });
    },
    createService: (serviceData) => {
        console.warn('Pricing API not yet implemented on backend');
        return Promise.resolve({ data: { ...serviceData, id: Date.now() } });
    },
    updateService: (id, serviceData) => {
        console.warn('Pricing API not yet implemented on backend');
        return Promise.resolve({ data: serviceData });
    },
    deleteService: (id) => {
        console.warn('Pricing API not yet implemented on backend');
        return Promise.resolve({ data: null });
    },
    updateServicePrice: (id, price) => {
        console.warn('Pricing API not yet implemented on backend');
        return Promise.resolve({ data: null });
    },
};

// Settings API - Placeholder for future implementation
export const settingsAPI = {
    updateProfile: (profileData) => {
        console.warn('Settings API not yet implemented on backend');
        return Promise.resolve({ data: profileData });
    },
    changePassword: (passwordData) => {
        console.warn('Settings API not yet implemented on backend');
        return Promise.resolve({ data: null });
    },
    updateNotificationSettings: (settings) => {
        console.warn('Settings API not yet implemented on backend');
        return Promise.resolve({ data: settings });
    },
    updateSecuritySettings: (settings) => {
        console.warn('Settings API not yet implemented on backend');
        return Promise.resolve({ data: settings });
    },
};

export const notificationsAPI = {
    getNotifications: () => api.get('/Notifications/all'),
    getUnreadCount: () => api.get('/Notifications/unread-count'),
    markAsRead: (notificationId) => api.put(`/Notifications/mark-read/${notificationId}`),
    markAllAsRead: () => api.put('/Notifications/mark-all-read'),
    deleteNotification: (notificationId) => api.delete(`/Notifications/${notificationId}`),
};

export default api;
