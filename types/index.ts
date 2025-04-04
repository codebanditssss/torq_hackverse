export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  address?: string;
};

export type Vehicle = {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'cng';
  isDefault?: boolean;
};

export type ServiceType = 
  // Emergency services
  'fuel' | 'battery' | 'tire' | 'tow' | 'lockout' | 
  // Fitment services
  'dashcam' | 'multimedia' | 'fitment' |
  // General repair services
  'repair' | 'inspection' | 'bike_service' |
  // Other
  'other';

export type ServiceCategory = 'emergency' | 'fitment' | 'other';

export type ServiceInfo = {
  type: ServiceType;
  title: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  icon: string;
};

export type ServiceProvider = {
  id: string;
  name: string;
  rating: number;
  totalRatings: number;
  services: ServiceType[];
  profileImage?: string;
  distance?: number; // in km
  estimatedTime?: number; // in minutes
};

export type ServiceRequest = {
  id: string;
  userId: string;
  vehicleId: string;
  serviceType: ServiceType;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  providerId?: string;
  createdAt: string;
  estimatedArrival?: string;
  notes?: string;
  price?: number;
  scheduledFor?: string; // For scheduled services
};

export type FuelRequest = ServiceRequest & {
  serviceType: 'fuel';
  fuelType: 'petrol' | 'diesel' | 'cng';
  quantity: number; // in liters
};

export type FitmentRequest = ServiceRequest & {
  serviceType: 'dashcam' | 'multimedia' | 'fitment';
  productDetails?: string;
  installationType?: string;
};

export type RepairRequest = ServiceRequest & {
  serviceType: 'repair' | 'inspection' | 'bike_service';
  vehicleIssues?: string[];
  preferredTime?: string;
};

export type Review = {
  id: string;
  userId: string;
  providerId: string;
  requestId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  name: string;
  isDefault: boolean;
  last4?: string;
  expiryDate?: string;
  upiId?: string;
};

export type NotificationType = 'service_update' | 'review_request' | 'payment_update' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  data?: Record<string, any>;
}