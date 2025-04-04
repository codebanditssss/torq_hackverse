import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/Card';
import { TouchableCard } from '@/components/TouchableCard';
import { ProgressTracker } from '@/components/ProgressTracker';
import { useVehicleStore } from '@/store/vehicle-store';
import { useServiceStore } from '@/store/service-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { 
  Music,
  MapPin, 
  Car 
} from 'lucide-react-native';
import type { ServiceProvider, FitmentRequest } from '@/types';

const multimediaOptions = [
  {
    id: 'infotainment',
    title: 'Infotainment System',
    description: 'Android/Apple CarPlay compatible system with touchscreen',
    price: 29999
  },
  {
    id: 'speakers',
    title: 'Speaker System',
    description: 'Premium speaker setup with subwoofer',
    price: 19999
  },
  {
    id: 'display',
    title: 'Rear Display',
    description: 'Rear seat entertainment system',
    price: 24999
  }
];

export default function MultimediaScreen() {
  const router = useRouter();
  const { vehicles, getDefaultVehicle } = useVehicleStore();
  const { providers, getProviders, createFitmentRequest, isLoading } = useServiceStore();
  const { user } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(getDefaultVehicle());
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>();
  const [location, setLocation] = useState({
    latitude: 28.6139,  // Default to Delhi coordinates
    longitude: 77.2090,
    address: user?.address || 'Connaught Place, Delhi'
  });

  useEffect(() => {
    if (step === 3) {
      getProviders('multimedia', location.latitude, location.longitude);
    }
  }, [step]);

  const handleNext = async () => {
    if (step === 3 && selectedVehicle && selectedOption) {
      const selectedProduct = multimediaOptions.find(opt => opt.id === selectedOption);
      const request: Omit<FitmentRequest, 'id' | 'status' | 'createdAt'> = {
        serviceType: 'multimedia',
        userId: user?.id || '',
        vehicleId: selectedVehicle.id,
        location,
        providerId: selectedProvider,
        productDetails: selectedProduct?.title,
        price: selectedProduct?.price,
        installationType: 'standard'
      };
      await createFitmentRequest(request);
      router.push('/(tabs)');
    } else {
      setStep(step + 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedVehicle;
      case 2:
        return !!selectedOption;
      case 3:
        return !!selectedProvider;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.scrollView}>
        <ProgressTracker 
          steps={[
            { label: 'Select Vehicle', completed: step > 1, current: step === 1 },
            { label: 'Choose System', completed: step > 2, current: step === 2 },
            { label: 'Confirm Details', completed: false, current: step === 3 }
          ]} 
        />

        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Vehicle</Text>
            {vehicles.map((vehicle) => (
              <TouchableCard
                key={vehicle.id}
                onPress={() => setSelectedVehicle(vehicle)}
                style={selectedVehicle?.id === vehicle.id ? styles.selectedCard : styles.card}
              >
                <View style={styles.cardContent}>
                  <Car size={24} color={colors.secondary} />
                  <Text style={styles.vehicleText}>
                    {vehicle.make} {vehicle.model} - {vehicle.year}
                  </Text>
                </View>
              </TouchableCard>
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Multimedia System</Text>
            {multimediaOptions.map((option) => (
              <TouchableCard
                key={option.id}
                onPress={() => setSelectedOption(option.id)}
                style={selectedOption === option.id ? styles.selectedCard : styles.card}
              >
                <View style={styles.cardContent}>
                  <Music size={24} color={colors.secondary} />
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                    <Text style={styles.price}>₹{option.price.toLocaleString()}</Text>
                  </View>
                </View>
              </TouchableCard>
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confirm Installation Details</Text>
            <Card style={styles.locationCard}>
              <View style={styles.cardContent}>
                <MapPin size={24} color={colors.secondary} />
                <Text style={styles.locationText}>{location.address}</Text>
              </View>
            </Card>
            
            <Text style={styles.subsectionTitle}>Select Service Provider</Text>
            {providers.map((provider: ServiceProvider) => (
              <TouchableCard
                key={provider.id}
                onPress={() => setSelectedProvider(provider.id)}
                style={selectedProvider === provider.id ? styles.selectedCard : styles.card}
              >
                <View style={styles.cardContent}>
                  <View style={styles.providerContent}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerDetails}>
                      Distance: {provider.distance}km | Rating: {provider.rating}⭐
                    </Text>
                  </View>
                </View>
              </TouchableCard>
            ))}
          </View>
        )}

        <Button
          onPress={handleNext}
          disabled={!canProceed()}
          loading={isLoading}
          style={styles.button}
        >
          {step === 3 ? 'Confirm Installation' : 'Next'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
  },
  selectedCard: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleText: {
    fontSize: 16,
    color: colors.text,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  locationCard: {
    marginBottom: 24,
  },
  locationText: {
    fontSize: 16,
    color: colors.text,
  },
  providerContent: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  providerDetails: {
    fontSize: 14,
    color: colors.secondary,
  },
  button: {
    marginVertical: 24,
  },
});
