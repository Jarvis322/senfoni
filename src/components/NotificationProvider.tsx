'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Notification, { NotificationType } from './Notification';

interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Bildirim gösterme fonksiyonu
  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
  }, []);
  
  // Bildirim kapatma fonksiyonu
  const closeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Bildirimler */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => closeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
}

// Custom hook
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 