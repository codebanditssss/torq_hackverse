import axios from 'axios';
import { ServiceRequest } from '@/store/service-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  // Get token from secure storage
  // const token = await SecureStore.getItemAsync('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return { error: message };
  }
);

export const services = {
  create: async (data: Partial<ServiceRequest>) => {
    return api.post('/services', data);
  },

  updateStatus: async (id: string, status: ServiceRequest['status']) => {
    return api.patch(`/services/${id}/status`, { status });
  },

  getServiceDetails: async (id: string) => {
    return api.get(`/services/${id}`);
  },

  getAll: async () => {
    return api.get('/services');
  },

  getNearby: async (params: { longitude: number; latitude: number; maxDistance?: number; type?: string }) => {
    return api.get('/services/nearby', { params });
  },
};

export { api };
