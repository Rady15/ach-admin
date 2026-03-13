import axios from 'axios';
import { notificationBus } from './notificationBus';

// Change this to change the API base URL
const BASE_URL = import.meta.env.PROD ? 'https://ach.runasp.net/api' : '/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for notifications and error handling
api.interceptors.response.use(
    (response) => {
        // Show success notification for state-changing operations
        const method = response.config?.method?.toLowerCase();
        const url = response.config?.url || '';

        if (['post', 'put', 'patch', 'delete'].includes(method)) {
            // Determine notification type based on endpoint
            let type = 'success';
            let title = 'Operation Successful';
            let message = '';

            if (url.includes('status')) {
                type = 'order';
                title = 'Status Updated';
                message = 'Request status has been updated successfully';
            } else if (url.includes('assign')) {
                type = 'user';
                title = 'Request Assigned';
                message = 'Request has been assigned successfully';
            } else if (url.includes('payment')) {
                type = 'payment';
                title = 'Payment Processed';
                message = 'Payment operation completed successfully';
            } else if (url.includes('suspend') || url.includes('unsuspend')) {
                type = 'user';
                title = url.includes('suspend') ? 'User Suspended' : 'User Unsuspended';
                message = 'User status has been updated';
            } else if (method === 'delete') {
                title = 'Deleted';
                message = 'Item has been deleted successfully';
            } else if (method === 'post' && url.includes('create')) {
                title = 'Created';
                message = 'New item has been created successfully';
            } else {
                title = 'Updated';
                message = 'Changes have been saved successfully';
            }

            notificationBus.emit({
                type,
                title,
                message,
                metadata: {
                    url,
                    method,
                    status: response.status,
                    data: response.data
                }
            });
        }

        return response;
    },
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';
        let errorMessage = 'An error occurred';
        let title = 'Error';

        if (status === 400) {
            errorMessage = 'Invalid request data';
            title = 'Bad Request';
        } else if (status === 401) {
            errorMessage = 'Session expired. Please login again';
            title = 'Unauthorized';
        } else if (status === 403) {
            errorMessage = 'You do not have permission to perform this action';
            title = 'Access Denied';
        } else if (status === 404) {
            errorMessage = 'The requested resource was not found';
            title = 'Not Found';
        } else if (status === 500) {
            errorMessage = 'Server error. Please try again later';
            title = 'Server Error';
        } else if (status === 502) {
            errorMessage = 'Service temporarily unavailable';
            title = 'Service Error';
        } else if (!error.response) {
            errorMessage = 'Network error. Please check your connection';
            title = 'Connection Error';
        }

        // Show error notification
        notificationBus.error(title, errorMessage, {
            duration: 8000,
            metadata: {
                url,
                status,
                error: error.message
            }
        });

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
    addDescription: (requestId, description) => api.post('/UserServices/add-description', { requestId, description }),
    deleteRequest: (requestId) => {
        console.warn('UserServices API not yet implemented on backend');
        return Promise.resolve({ data: null });
    },
};

// Payments API
export const paymentsAPI = {
    getPaymentById: (id) => api.get(`/Payment/${id}`),
    createPayment: (paymentData) => api.post('/Payment', paymentData),
    updatePayment: (id, paymentData) => api.put(`/Payment/${id}`, paymentData),
    deletePayment: (id) => api.delete(`/Payment/${id}`),
    getPaymentsStats: () => api.get('/Payment/statistics'),
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

export default api;
