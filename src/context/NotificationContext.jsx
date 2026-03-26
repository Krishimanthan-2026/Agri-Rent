import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('agrirent_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agrirent_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (userId, type, message, data = {}) => {
    const newNotif = {
      id: Date.now().toString(),
      userId,
      type,
      message,
      data,
      isRead: false,
      date: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllAsRead = () => {
    if (!user) return;
    setNotifications(notifications.map(n => 
      n.userId === user.id ? { ...n, isRead: true } : n
    ));
  };

  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications: userNotifications,
      unreadCount,
      addNotification,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
