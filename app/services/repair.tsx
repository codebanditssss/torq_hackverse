import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/Card';
import { TouchableCard } from '@/components/TouchableCard';
import { ProgressTracker } from '@/components/ProgressTracker';
import { Header } from '@/components/Header';
import { useVehicleStore } from '@/store/vehicle-store';
import { useServiceStore } from '@/store/service-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { 
  Wrench, 
  MapPin, 
  Car,
  AlertCircle,
  Settings,
  Gauge,
  Zap,
  Wind
} from 'lucide-react-native';
import type { ServiceProvider, RepairRequest } from '@/types';

const issues = [
  {
    id: 'engine',
    title: 'Engine Issues',
    description: 'Engine problems, misfiring, or unusual noises',
    icon: Gauge
  },
  {
    id: 'brakes',
    title: 'Brake Problems',
    description: 'Brake squeaking, reduced response, or vibration',
    icon: Wrench
  },
  {
    id: 'transmission',
    title: 'Transmission Problems',
    description: 'Gear shifting issues or transmission fluid leaks',
    icon: Settings
  },
  {
    id: 'electrical',
    title: 'Electrical Issues',
    description: 'Battery, starter, or electrical system problems',
    icon: Zap
  },
  {
    id: 'ac',
    title: 'AC/Heating Issues',
    description: 'Climate control not working properly',
    icon: Wind
  },
  {
    id: 'other',
    title: 'Other Issues',
    description: 'Other mechanical or maintenance problems',
    icon: AlertCircle
  }
] as const;

export default function RepairScreen() {
  const router = useRouter();
  const { vehicles, getDefaultVehicle } = useVehicleStore();
  const { providers, getProviders, createRepairRequest, isLoading } = useServiceStore();
  const { user } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(getDefaultVehicle());
  const [selectedIssue, setSelectedIssue] = useState<string | undefined>();
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>();
  const [location, setLocation] = useState({
    latitude: 28.6139,  // Default to Delhi coordinates
    longitude: 77.2090,
    address: user?.address || 'Connaught Place, Delhi'
  });

  useEffect(() => {
    if (step === 3) {
      getProviders('repair', location.latitude, location.longitude);
    }
  }, [step]);

  const handleNext = async () => {
    if (step === 3 && selectedVehicle && selectedIssue) {
      const request: Omit<RepairRequest, 'id' | 'status' | 'createdAt'> = {
        serviceType: 'repair',
        userId: user?.id || '',
        vehicleId: selectedVehicle.id,
        location,
        providerId: selectedProvider,
        vehicleIssues: [selectedIssue]
      };
      await createRepairRequest(request);
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
        return !!selectedIssue;
      case 3:
        return !!selectedProvider;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header 
        title="Vehicle Repair" 
        showBackButton={true}
      />
      <ScrollView style={styles.scrollView}>
        <ProgressTracker 
          steps={[
            { label: 'Select Vehicle', completed: step > 1, current: step === 1 },
            { label: 'Describe Issue', completed: step > 2, current: step === 2 },
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
            <Text style={styles.sectionTitle}>What's the issue?</Text>
            {issues.map((issue) => (
              <TouchableCard
                key={issue.id}
                onPress={() => setSelectedIssue(issue.id)}
                style={selectedIssue === issue.id ? styles.selectedCard : styles.card}
              >
                <View style={styles.cardContent}>
                  <issue.icon size={24} color={colors.secondary} />
                  <View style={styles.issueContent}>
                    <Text style={styles.issueTitle}>{issue.title}</Text>
                    <Text style={styles.issueDescription}>{issue.description}</Text>
                  </View>
                </View>
              </TouchableCard>
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confirm Service Details</Text>
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
          {step === 3 ? 'Confirm Repair Request' : 'Next'}
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.dark,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
    color: colors.dark,
  },
  card: {
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  selectedCard: {
    marginBottom: 12,
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.dark,
  },
  issueContent: {
    marginLeft: 12,
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  issueDescription: {
    fontSize: 14,
    color: colors.gray,
  },
  locationCard: {
    padding: 12,
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  providerContent: {
    marginLeft: 12,
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  providerDetails: {
    fontSize: 14,
    color: colors.gray,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});
