import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
  selectedLocation: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getCurrentLocation: () => Promise<void>;
  setSelectedLocation: (location: LocationState['selectedLocation']) => void;
  searchLocations: (query: string) => Promise<Array<{
    latitude: number;
    longitude: number;
    address: string;
  }>>;
  clearError: () => void;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  selectedLocation: null,
  isLoading: false,
  error: null,
  
  getCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (!address) {
        throw new Error('Could not get address for location');
      }

      const formattedAddress = [
        address.street,
        address.city,
        address.region,
        address.country,
      ]
        .filter(Boolean)
        .join(', ');

      const selectedLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: formattedAddress,
      };

      set({
        selectedLocation,
        isLoading: false,
      });

      return selectedLocation;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to get current location',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedLocation: (location) => {
    set({ selectedLocation: location });
  },

  searchLocations: async (query) => {
    if (!query.trim()) {
      return [];
    }

    set({ isLoading: true, error: null });
    try {
      const results = await Location.geocodeAsync(query);
      
      const locations = await Promise.all(
        results.map(async (result) => {
          const [address] = await Location.reverseGeocodeAsync({
            latitude: result.latitude,
            longitude: result.longitude,
          });

          const formattedAddress = [
            address?.street,
            address?.city,
            address?.region,
            address?.country,
          ]
            .filter(Boolean)
            .join(', ');

          return {
            latitude: result.latitude,
            longitude: result.longitude,
            address: formattedAddress,
          };
        })
      );

      set({ isLoading: false });
      return locations;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to search locations',
        isLoading: false,
      });
      return [];
    }
  },

  clearError: () => set({ error: null }),
}));
