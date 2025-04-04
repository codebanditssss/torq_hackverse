import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle } from '@/types';

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  setDefaultVehicle: (id: string) => void;
  getDefaultVehicle: () => Vehicle | undefined;
  clearError: () => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [
        {
          id: '1',
          userId: '1',
          make: 'Honda',
          model: 'City',
          year: '2020',
          color: 'Silver',
          licensePlate: 'MH 01 AB 1234',
          fuelType: 'petrol',
          isDefault: true
        },
        {
          id: '2',
          userId: '1',
          make: 'Hyundai',
          model: 'Creta',
          year: '2021',
          color: 'White',
          licensePlate: 'MH 01 CD 5678',
          fuelType: 'diesel',
          isDefault: false
        }
      ],
      isLoading: false,
      error: null,
      
      addVehicle: (vehicleData) => {
        const newVehicle: Vehicle = {
          ...vehicleData,
          id: Date.now().toString(),
          isDefault: get().vehicles.length === 0 ? true : false
        };
        
        set((state) => ({
          vehicles: [...state.vehicles, newVehicle],
          error: null
        }));
      },
      
      updateVehicle: (id, vehicleData) => {
        set((state) => ({
          vehicles: state.vehicles.map(vehicle => 
            vehicle.id === id ? { ...vehicle, ...vehicleData } : vehicle
          ),
          error: null
        }));
      },
      
      deleteVehicle: (id) => {
        const isDefault = get().vehicles.find(v => v.id === id)?.isDefault;
        
        set((state) => ({
          vehicles: state.vehicles.filter(vehicle => vehicle.id !== id),
          error: null
        }));
        
        // If we deleted the default vehicle, set a new default
        if (isDefault && get().vehicles.length > 0) {
          get().setDefaultVehicle(get().vehicles[0].id);
        }
      },
      
      setDefaultVehicle: (id) => {
        set((state) => ({
          vehicles: state.vehicles.map(vehicle => ({
            ...vehicle,
            isDefault: vehicle.id === id
          })),
          error: null
        }));
      },
      
      getDefaultVehicle: () => {
        return get().vehicles.find(vehicle => vehicle.isDefault);
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'saarthi-vehicle-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);