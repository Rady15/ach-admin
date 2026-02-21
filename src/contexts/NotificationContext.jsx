import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notificationsAPI } from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        
        setLoading(true);
        try {
            const [notifRes, countRes] = await Promise.allSettled([
                notificationsAPI.getNotifications(),
                notificationsAPI.getUnreadCount()
            ]);

            if (notifRes.status === 'fulfilled') {
                const data = notifRes.value.data;
                const notifs = Array.isArray(data) ? data : (data.notifications || data.data || []);
                setNotifications(notifs);
            }

            if (countRes.status === 'fulfilled') {
                setUnreadCount(countRes.value.data?.count || countRes.value.data || 0);
            } else if (notifRes.status === 'fulfilled') {
                const notifs = Array.isArray(notifRes.value.data) ? notifRes.value.data : [];
                setUnreadCount(notifs.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const markAsRead = async (notificationId) => {
        try {
            await notificationsAPI.markAsRead(notificationId);
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await notificationsAPI.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            const notif = notifications.find(n => n.id === notificationId);
            if (notif && !notif.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}
