import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  deleteNotification: (id: string) => void;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'service_update',
    title: 'Fuel Delivery Accepted',
    message: 'Your fuel delivery request has been accepted. Provider is on the way.',
    read: false,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    serviceType: 'fuel',
    requestId: 'req1'
  },
  {
    id: '2',
    userId: '1',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of ₹577 for fuel delivery service has been processed successfully.',
    read: true,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    requestId: 'req1'
  },
  {
    id: '3',
    userId: '1',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 10% off on your next service request. Use code SAARTHI10.',
    read: false,
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
  },
  {
    id: '4',
    userId: '1',
    type: 'system',
    title: 'App Update Available',
    message: 'A new version of Saarthi is available. Update now for new features and improvements.',
    read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), // 3 days ago
  },
  {
    id: '5',
    userId: '1',
    type: 'reminder',
    title: 'Vehicle Service Due',
    message: 'Your Honda City is due for regular maintenance. Schedule a service soon.',
    read: false,
    timestamp: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), // 5 days ago
  }
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      isLoading: false,
      error: null,
      
      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        }));
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notification => ({ ...notification, read: true }))
        }));
      },
      
      clearAllNotifications: () => {
        set({ notifications: [] });
      },
      
      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(notification => notification.id !== id)
        }));
      }
    }),
    {
      name: 'saarthi-notification-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);