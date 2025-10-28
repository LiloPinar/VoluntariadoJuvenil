import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from './AuthContext';

export type NotificationType = 
  | 'new_project' 
  | 'project_updated' 
  | 'enrollment_approved' 
  | 'enrollment_rejected'
  | 'goal_completed'
  | 'reminder'
  | 'general';

export interface Notification {
  id: string;
  userId: string; // ID del usuario al que pertenece la notificación
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number; // Unix timestamp
  read: boolean;
  data?: any; // Datos adicionales (ej: projectId, enrollmentId, etc.)
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'userId' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Cargar notificaciones del usuario actual desde localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const userNotifications = allNotifications.filter((n: Notification) => n.userId === user.id);
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [user, isAuthenticated]);

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    if (isAuthenticated && user) {
      const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      // Filtrar notificaciones de otros usuarios y agregar las actuales
      const otherUsersNotifications = allNotifications.filter((n: Notification) => n.userId !== user.id);
      const updatedNotifications = [...otherUsersNotifications, ...notifications];
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    }
  }, [notifications, user, isAuthenticated]);

  const addNotification = (notification: Omit<Notification, 'id' | 'userId' | 'timestamp' | 'read'>) => {
    if (!isAuthenticated || !user) return;

    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      timestamp: Date.now(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Función helper para formatear el tiempo relativo
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Hace un momento';
  if (minutes < 60) return `Hace ${minutes} min${minutes !== 1 ? '' : ''}`;
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  if (days < 7) return `Hace ${days} día${days !== 1 ? 's' : ''}`;
  
  return new Date(timestamp).toLocaleDateString();
};
