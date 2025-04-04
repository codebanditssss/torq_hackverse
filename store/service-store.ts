import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceRequest, ServiceType, ServiceProvider, FuelRequest, FitmentRequest, RepairRequest } from '@/types';
import { useNotificationStore } from './notification-store';
import { SERVICES } from '@/constants/services';

interface ServiceState {
  activeRequest: ServiceRequest | null;
  pastRequests: ServiceRequest[];
  providers: ServiceProvider[];
  isLoading: boolean;
  error: string | null;
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>) => Promise<ServiceRequest>;
  createFuelRequest: (request: Omit<FuelRequest, 'id' | 'status' | 'createdAt'>) => Promise<FuelRequest>;
  createFitmentRequest: (request: Omit<FitmentRequest, 'id' | 'status' | 'createdAt'>) => Promise<FitmentRequest>;
  createRepairRequest: (request: Omit<RepairRequest, 'id' | 'status' | 'createdAt'>) => Promise<RepairRequest>;
  updateServiceRequest: (id: string, data: Partial<ServiceRequest>) => void;
  cancelServiceRequest: (id: string) => void;
  completeServiceRequest: (id: string) => void;
  getProviders: (serviceType: ServiceType, latitude: number, longitude: number) => Promise<ServiceProvider[]>;
  getServiceInfo: (serviceType: ServiceType) => { title: string; basePrice: number } | undefined;
}

export const useServiceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      activeRequest: null,
      pastRequests: [],
      providers: [],
      isLoading: false,
      error: null,
      
      getServiceInfo: (serviceType) => {
        const service = SERVICES.find(s => s.type === serviceType);
        if (service) {
          return { title: service.title, basePrice: service.basePrice };
        }
        return undefined;
      },
      
      createServiceRequest: async (requestData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const serviceInfo = get().getServiceInfo(requestData.serviceType);
          
          const newRequest: ServiceRequest = {
            ...requestData,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            price: requestData.price || serviceInfo?.basePrice || 499
          };
          
          set((state) => ({ 
            activeRequest: newRequest,
            isLoading: false 
          }));
          
          // Add notification
          const notificationStore = useNotificationStore.getState();
          const serviceTitle = serviceInfo?.title || getServiceTitle(newRequest.serviceType);
          
          notificationStore.addNotification({
            userId: newRequest.userId,
            type: 'service_update',
            title: `${serviceTitle} Request Created`,
            message: `Your ${serviceTitle.toLowerCase()} request has been created and we're finding a provider.`,
            serviceType: newRequest.serviceType,
            requestId: newRequest.id
          });
          
          // For scheduled services, don't simulate immediate acceptance
          if (!newRequest.scheduledFor) {
            // Simulate provider accepting request after 3 seconds
            setTimeout(() => {
              get().updateServiceRequest(newRequest.id, { 
                status: 'accepted',
                providerId: '101',
                estimatedArrival: new Date(Date.now() + 15 * 60000).toISOString() // 15 minutes from now
              });
              
              // Add notification for acceptance
              notificationStore.addNotification({
                userId: newRequest.userId,
                type: 'service_update',
                title: `${serviceTitle} Request Accepted`,
                message: `Your ${serviceTitle.toLowerCase()} request has been accepted. Provider is on the way.`,
                serviceType: newRequest.serviceType,
                requestId: newRequest.id
              });
            }, 3000);
          } else {
            // For scheduled services, add a different notification
            notificationStore.addNotification({
              userId: newRequest.userId,
              type: 'service_update',
              title: `${serviceTitle} Scheduled`,
              message: `Your ${serviceTitle.toLowerCase()} has been scheduled for ${new Date(newRequest.scheduledFor).toLocaleString()}.`,
              serviceType: newRequest.serviceType,
              requestId: newRequest.id
            });
          }
          
          return newRequest;
        } catch (error) {
          set({ 
            error: 'Failed to create service request', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      createFuelRequest: async (requestData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newRequest: FuelRequest = {
            ...requestData,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          
          set((state) => ({ 
            activeRequest: newRequest,
            isLoading: false 
          }));
          
          // Add notification
          const notificationStore = useNotificationStore.getState();
          notificationStore.addNotification({
            userId: newRequest.userId,
            type: 'service_update',
            title: 'Fuel Delivery Request Created',
            message: `Your fuel delivery request for ${newRequest.quantity}L of ${newRequest.fuelType} has been created.`,
            serviceType: 'fuel',
            requestId: newRequest.id
          });
          
          // Simulate provider accepting request after 3 seconds
          setTimeout(() => {
            get().updateServiceRequest(newRequest.id, { 
              status: 'accepted',
              providerId: '101',
              estimatedArrival: new Date(Date.now() + 15 * 60000).toISOString() // 15 minutes from now
            });
            
            // Add notification for acceptance
            notificationStore.addNotification({
              userId: newRequest.userId,
              type: 'service_update',
              title: 'Fuel Delivery Request Accepted',
              message: 'Your fuel delivery request has been accepted. Provider is on the way.',
              serviceType: 'fuel',
              requestId: newRequest.id
            });
          }, 3000);
          
          return newRequest;
        } catch (error) {
          set({ 
            error: 'Failed to create fuel request', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      createFitmentRequest: async (requestData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const serviceInfo = get().getServiceInfo(requestData.serviceType);
          
          const newRequest: FitmentRequest = {
            ...requestData,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            price: requestData.price || serviceInfo?.basePrice || 1499
          };
          
          set((state) => ({ 
            activeRequest: newRequest,
            isLoading: false 
          }));
          
          // Add notification
          const notificationStore = useNotificationStore.getState();
          const serviceTitle = serviceInfo?.title || getServiceTitle(newRequest.serviceType);
          
          notificationStore.addNotification({
            userId: newRequest.userId,
            type: 'service_update',
            title: `${serviceTitle} Request Created`,
            message: `Your ${serviceTitle.toLowerCase()} request has been created.`,
            serviceType: newRequest.serviceType,
            requestId: newRequest.id
          });
          
          // If it's a scheduled service, don't simulate immediate acceptance
          if (!newRequest.scheduledFor) {
            // Simulate provider accepting request after 3 seconds
            setTimeout(() => {
              get().updateServiceRequest(newRequest.id, { 
                status: 'accepted',
                providerId: '102',
                estimatedArrival: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutes from now
              });
              
              // Add notification for acceptance
              notificationStore.addNotification({
                userId: newRequest.userId,
                type: 'service_update',
                title: `${serviceTitle} Request Accepted`,
                message: `Your ${serviceTitle.toLowerCase()} request has been accepted. Provider is on the way.`,
                serviceType: newRequest.serviceType,
                requestId: newRequest.id
              });
            }, 3000);
          } else {
            // For scheduled services, add a different notification
            notificationStore.addNotification({
              userId: newRequest.userId,
              type: 'service_update',
              title: `${serviceTitle} Scheduled`,
              message: `Your ${serviceTitle.toLowerCase()} has been scheduled for ${new Date(newRequest.scheduledFor).toLocaleString()}.`,
              serviceType: newRequest.serviceType,
              requestId: newRequest.id
            });
          }
          
          return newRequest;
        } catch (error) {
          set({ 
            error: 'Failed to create fitment request', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      createRepairRequest: async (requestData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const serviceInfo = get().getServiceInfo(requestData.serviceType);
          
          const newRequest: RepairRequest = {
            ...requestData,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            price: requestData.price || serviceInfo?.basePrice || 799
          };
          
          set((state) => ({ 
            activeRequest: newRequest,
            isLoading: false 
          }));
          
          // Add notification
          const notificationStore = useNotificationStore.getState();
          const serviceTitle = serviceInfo?.title || getServiceTitle(newRequest.serviceType);
          
          notificationStore.addNotification({
            userId: newRequest.userId,
            type: 'service_update',
            title: `${serviceTitle} Request Created`,
            message: `Your ${serviceTitle.toLowerCase()} request has been created.`,
            serviceType: newRequest.serviceType,
            requestId: newRequest.id
          });
          
          // If it's a scheduled service, don't simulate immediate acceptance
          if (!newRequest.scheduledFor) {
            // Simulate provider accepting request after 3 seconds
            setTimeout(() => {
              get().updateServiceRequest(newRequest.id, { 
                status: 'accepted',
                providerId: '103',
                estimatedArrival: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
              });
              
              // Add notification for acceptance
              notificationStore.addNotification({
                userId: newRequest.userId,
                type: 'service_update',
                title: `${serviceTitle} Request Accepted`,
                message: `Your ${serviceTitle.toLowerCase()} request has been accepted. Provider is on the way.`,
                serviceType: newRequest.serviceType,
                requestId: newRequest.id
              });
            }, 3000);
          } else {
            // For scheduled services, add a different notification
            notificationStore.addNotification({
              userId: newRequest.userId,
              type: 'service_update',
              title: `${serviceTitle} Scheduled`,
              message: `Your ${serviceTitle.toLowerCase()} has been scheduled for ${new Date(newRequest.scheduledFor).toLocaleString()}.`,
              serviceType: newRequest.serviceType,
              requestId: newRequest.id
            });
          }
          
          return newRequest;
        } catch (error) {
          set({ 
            error: 'Failed to create repair request', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateServiceRequest: (id, data) => {
        set((state) => {
          if (state.activeRequest && state.activeRequest.id === id) {
            const updatedRequest = { ...state.activeRequest, ...data };
            
            // Add notification for status change if status is updated
            if (data.status && data.status !== state.activeRequest.status) {
              const notificationStore = useNotificationStore.getState();
              
              let title = '';
              let message = '';
              
              const serviceInfo = get().getServiceInfo(updatedRequest.serviceType);
              const serviceTitle = serviceInfo?.title || getServiceTitle(updatedRequest.serviceType);
              
              switch (data.status) {
                case 'accepted':
                  title = `${serviceTitle} Request Accepted`;
                  message = `Your ${serviceTitle.toLowerCase()} request has been accepted. Provider is on the way.`;
                  break;
                case 'in_progress':
                  title = `${serviceTitle} In Progress`;
                  message = `Your ${serviceTitle.toLowerCase()} service is now in progress.`;
                  break;
                case 'completed':
                  title = `${serviceTitle} Completed`;
                  message = `Your ${serviceTitle.toLowerCase()} service has been completed.`;
                  break;
                case 'cancelled':
                  title = `${serviceTitle} Cancelled`;
                  message = `Your ${serviceTitle.toLowerCase()} request has been cancelled.`;
                  break;
              }
              
              if (title && message) {
                notificationStore.addNotification({
                  userId: updatedRequest.userId,
                  type: 'service_update',
                  title,
                  message,
                  serviceType: updatedRequest.serviceType as ServiceType,
                  requestId: updatedRequest.id
                });
              }
            }
            
            return {
              activeRequest: updatedRequest
            };
          }
          return state;
        });
      },
      
      cancelServiceRequest: (id) => {
        set((state) => {
          if (state.activeRequest && state.activeRequest.id === id) {
            const cancelledRequest = { ...state.activeRequest, status: 'cancelled' };
            
            // Add notification for cancellation
            const notificationStore = useNotificationStore.getState();
            const serviceInfo = get().getServiceInfo(cancelledRequest.serviceType);
            const serviceTitle = serviceInfo?.title || getServiceTitle(cancelledRequest.serviceType);
            
            notificationStore.addNotification({
              userId: cancelledRequest.userId,
              type: 'service_update',
              title: `${serviceTitle} Cancelled`,
              message: `Your ${serviceTitle.toLowerCase()} request has been cancelled.`,
              serviceType: cancelledRequest.serviceType as ServiceType,
              requestId: cancelledRequest.id
            });
            
            return {
              activeRequest: null,
              pastRequests: [cancelledRequest, ...state.pastRequests]
            };
          }
          return state;
        });
      },
      
      completeServiceRequest: (id) => {
        set((state) => {
          if (state.activeRequest && state.activeRequest.id === id) {
            const completedRequest = { ...state.activeRequest, status: 'completed' };
            
            // Add notification for completion
            const notificationStore = useNotificationStore.getState();
            const serviceInfo = get().getServiceInfo(completedRequest.serviceType);
            const serviceTitle = serviceInfo?.title || getServiceTitle(completedRequest.serviceType);
            
            notificationStore.addNotification({
              userId: completedRequest.userId,
              type: 'service_update',
              title: `${serviceTitle} Completed`,
              message: `Your ${serviceTitle.toLowerCase()} service has been completed.`,
              serviceType: completedRequest.serviceType as ServiceType,
              requestId: completedRequest.id
            });
            
            // Add payment notification
            const price = completedRequest.price || serviceInfo?.basePrice || 499;
            
            notificationStore.addNotification({
              userId: completedRequest.userId,
              type: 'payment',
              title: 'Payment Successful',
              message: `Your payment of ₹${price} for ${serviceTitle.toLowerCase()} service has been processed successfully.`,
              requestId: completedRequest.id
            });
            
            return {
              activeRequest: null,
              pastRequests: [completedRequest, ...state.pastRequests]
            };
          }
          return state;
        });
      },
      
      getProviders: async (serviceType, latitude, longitude) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Generate mock providers based on service type
          const mockProviders: ServiceProvider[] = [
            {
              id: '101',
              name: 'Quick Fuel Services',
              rating: 4.8,
              totalRatings: 245,
              services: ['fuel', 'battery'],
              distance: 2.3,
              estimatedTime: 15
            },
            {
              id: '102',
              name: 'Auto Fitment Experts',
              rating: 4.7,
              totalRatings: 189,
              services: ['dashcam', 'multimedia', 'fitment'],
              distance: 3.5,
              estimatedTime: 25
            },
            {
              id: '103',
              name: 'Mobile Mechanics',
              rating: 4.9,
              totalRatings: 312,
              services: ['inspection', 'bike_service', 'battery', 'tire'],
              distance: 4.1,
              estimatedTime: 30
            },
            {
              id: '104',
              name: 'Roadside Assistance Pro',
              rating: 4.6,
              totalRatings: 178,
              services: ['tow', 'lockout', 'tire', 'battery', 'fuel'],
              distance: 5.2,
              estimatedTime: 35
            }
          ];
          
          // Filter providers that offer the requested service
          const filteredProviders = mockProviders.filter(provider => 
            provider.services.includes(serviceType as any)
          );
          
          set({ 
            providers: filteredProviders,
            isLoading: false 
          });
          
          return filteredProviders;
        } catch (error) {
          set({ 
            error: 'Failed to fetch service providers', 
            isLoading: false 
          });
          throw error;
        }
      }
    }),
    {
      name: 'service-store',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

// Helper function to get service title
function getServiceTitle(type: string): string {
  switch (type) {
    case 'fuel': return 'Fuel Delivery';
    case 'battery': return 'Battery Jump Start';
    case 'tire': return 'Flat Tire Assistance';
    case 'tow': return 'Towing Service';
    case 'lockout': return 'Lockout Assistance';
    case 'dashcam': return 'Dashcam Installation';
    case 'multimedia': return 'Multimedia System';
    case 'fitment': return 'Vehicle Upgrade';
    case 'inspection': return 'Car Inspection';
    case 'bike_service': return 'Bike Express Service';
    case 'other': return 'Other Service';
    default: return 'Service Request';
  }
}