import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const delhiLocations = [
  'Sector-54, Gurugram'
];

const defaultLocation = 'Sector-54, Gurugram';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasCompletedOnboarding: false,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          if (email === "demo@saarthi.com" && password === "password") {
            const user: User = {
              id: '1',
              name: 'Demo User',
              email: 'demo@saarthi.com',
              phone: '+91 9876543210',
              profileImage: undefined,
              address: defaultLocation
            };
            set({ 
              user, 
              token: 'mock-jwt-token', 
              isAuthenticated: true, 
              isLoading: false 
            });
            return Promise.resolve();
          } else {
            set({ 
              error: 'Invalid email or password', 
              isLoading: false 
            });
            return Promise.reject('Invalid email or password');
          }
        } catch (error) {
          set({ 
            error: 'Failed to login. Please try again.', 
            isLoading: false 
          });
          return Promise.reject('Failed to login. Please try again.');
        }
      },
      
      loginWithPhone: async (phone, otp) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          if (otp === '1234') {
            const user: User = {
              id: '1',
              name: 'Demo User',
              email: 'demo@saarthi.com',
              phone,
              profileImage: undefined,
              address: defaultLocation
            };
            
            set({ 
              user, 
              token: 'mock-jwt-token', 
              isAuthenticated: true, 
              isLoading: false 
            });
            return Promise.resolve();
          } else {
            set({ 
              error: 'Invalid OTP', 
              isLoading: false 
            });
            return Promise.reject('Invalid OTP');
          }
        } catch (error) {
          set({ 
            error: 'Failed to login. Please try again.', 
            isLoading: false 
          });
          return Promise.reject('Failed to login. Please try again.');
        }
      },
      
      register: async (name, email, phone, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulating API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful registration
          const user: User = {
            id: '1',
            name,
            email,
            phone,
            profileImage: undefined,
            address: defaultLocation
          };
          
          set({ 
            user, 
            token: 'mock-jwt-token', 
            isAuthenticated: true, 
            isLoading: false 
          });
          return Promise.resolve();
        } catch (error) {
          set({ 
            error: 'Failed to register. Please try again.', 
            isLoading: false 
          });
          return Promise.reject('Failed to register. Please try again.');
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          // Clear all auth-related data from AsyncStorage
          await AsyncStorage.removeItem('saarthi-auth-storage');
          
          // Reset the state
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            isLoading: false
          });
          
          return Promise.resolve();
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
          return Promise.reject('Failed to logout. Please try again.');
        }
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      
      setHasCompletedOnboarding: (value) => {
        set({ hasCompletedOnboarding: value });
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'saarthi-auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);