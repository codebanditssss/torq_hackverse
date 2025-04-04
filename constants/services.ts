import { ServiceInfo } from '@/types';

export const SERVICES: ServiceInfo[] = [
  // Emergency services
  {
    type: 'fuel',
    title: 'Fuel Delivery',
    description: 'Get petrol or diesel delivered to your location',
    category: 'emergency',
    basePrice: 499,
    icon: 'droplet'
  },
  {
    type: 'battery',
    title: 'Battery Jump Start',
    description: "Get your vehicle's battery jump-started",
    category: 'emergency',
    basePrice: 499,
    icon: 'battery'
  },
  {
    type: 'tire',
    title: 'Flat Tire Assistance',
    description: 'Get help with tire change or repair',
    category: 'emergency',
    basePrice: 477,
    icon: 'truck'
  },
  {
    type: 'tow',
    title: 'Towing Service',
    description: 'Get your vehicle towed to a nearby garage',
    category: 'emergency',
    basePrice: 1249,
    icon: 'truck'
  },
  {
    type: 'lockout',
    title: 'Lockout Assistance',
    description: "Get help if you're locked out of your vehicle",
    category: 'emergency',
    basePrice: 399,
    icon: 'key'
  },
  
  // Fitment services
  {
    type: 'dashcam',
    title: 'Dashcam Installation',
    description: 'Professional installation of dashcams',
    category: 'fitment',
    basePrice: 1499,
    icon: 'video'
  },
  {
    type: 'multimedia',
    title: 'Multimedia System',
    description: 'Infotainment system setup and installation',
    category: 'fitment',
    basePrice: 2999,
    icon: 'music'
  },
  {
    type: 'fitment',
    title: 'Vehicle Upgrade',
    description: 'Custom vehicle upgrade assistance',
    category: 'fitment',
    basePrice: 1999,
    icon: 'settings'
  },
  
  // General repair services
  {
    type: 'inspection',
    title: 'Car Inspection',
    description: 'Comprehensive car inspection at your location',
    category: 'repair',
    basePrice: 799,
    icon: 'clipboard-check'
  },
  {
    type: 'bike_service',
    title: 'Bike Express Service',
    description: 'On-demand full bike service at your doorstep',
    category: 'repair',
    basePrice: 599,
    icon: 'tool'
  },
  
  // Other
  {
    type: 'other',
    title: 'Other Services',
    description: 'Request a custom service not listed above',
    category: 'other',
    basePrice: 499,
    icon: 'wrench'
  }
];