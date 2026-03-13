import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { notificationBus } from '../services/notificationBus';

const NotificationContext = createContext();

let notificationIdCounter = 0;

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const addNotification = useCallback((notification) => {
        const id = ++notificationIdCounter;
        const newNotification = {
            id,
            type: notification.type || 'info',
            title: notification.title || 'Notification',
            message: notification.message || '',
            createdAt: new Date().toISOString(),
            isRead: false,
            autoDismiss: notification.autoDismiss !== false,
            duration: notification.duration || 5000,
            ...notification
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 50));
        setUnreadCount(prev => prev + 1);

        if (newNotification.autoDismiss) {
            setTimeout(() => {
                dismissNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, []);

    const dismissNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const success = useCallback((title, message, options = {}) => {
        return addNotification({ type: 'success', title, message, ...options });
    }, [addNotification]);

    const error = useCallback((title, message, options = {}) => {
        return addNotification({ type: 'error', title, message, ...options });
    }, [addNotification]);

    const warning = useCallback((title, message, options = {}) => {
        return addNotification({ type: 'warning', title, message, ...options });
    }, [addNotification]);

    const info = useCallback((title, message, options = {}) => {
        return addNotification({ type: 'info', title, message, ...options });
    }, [addNotification]);

    // Subscribe to notification bus for API-triggered notifications
    useEffect(() => {
        const unsubscribe = notificationBus.subscribe((notification) => {
            addNotification(notification);
        });
        return unsubscribe;
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            dismissNotification,
            markAsRead,
            markAllAsRead,
            clearAll,
            success,
            error,
            warning,
            info
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

export default NotificationContext;
