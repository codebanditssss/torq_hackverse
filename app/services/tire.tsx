import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { VehicleCard } from '@/components/VehicleCard';
import { ProviderCard } from '@/components/ProviderCard';
import { ProgressTracker } from '@/components/ProgressTracker';
import { useVehicleStore } from '@/store/vehicle-store';
import { useServiceStore } from '@/store/service-store';
import { useAuthStore } from '@/store/auth-store';
import { 
  Truck, 
  MapPin, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react-native';

export default function TireServiceScreen() {
  const router = useRouter();
  const { vehicles, getDefaultVehicle } = useVehicleStore();
  const { providers, getProviders, createServiceRequest, isLoading } = useServiceStore();
  const { user } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(getDefaultVehicle());
  const [serviceOption, setServiceOption] = useState<'repair' | 'change'>('repair');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    address: user?.address || 'Connaught Place, Delhi'
  });
  
  useEffect(() => {
    if (step === 3) {
      loadProviders();
    }
  }, [step]);
  
  const loadProviders = async () => {
    try {
      await getProviders('tire', location.latitude, location.longitude);
    } catch (error) {
      Alert.alert('Error', 'Failed to load service providers');
    }
  };
  
  const steps = [
    { label: 'Vehicle', completed: step > 1, current: step === 1 },
    { label: 'Service Type', completed: step > 2, current: step === 2 },
    { label: 'Provider', completed: step > 3, current: step === 3 },
    { label: 'Confirm', completed: step > 4, current: step === 4 }
  ];
  
  const handleNext = () => {
    if (step === 1 && !selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }
    
    if (step === 3 && !selectedProvider) {
      Alert.alert('Error', 'Please select a service provider');
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleRequestService();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };
  
  const handleRequestService = async () => {
    if (!selectedVehicle || !selectedProvider) {
      Alert.alert('Error', 'Please select a vehicle and provider');
      return;
    }
    
    try {
      const provider = providers.find(p => p.id === selectedProvider);
      
      await createServiceRequest({
        userId: '1',
        vehicleId: selectedVehicle.id,
        serviceType: 'tire',
        location,
        providerId: selectedProvider,
        notes: `Need ${serviceOption === 'repair' ? 'tire repair' : 'tire change'} service`
      });
      
      router.replace('/services/tracking');
    } catch (error) {
      Alert.alert('Error', 'Failed to create service request');
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Vehicle</Text>
            
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                selected={selectedVehicle?.id === vehicle.id}
                onSelect={() => setSelectedVehicle(vehicle)}
              />
            ))}
            
            <TouchableOpacity 
              style={styles.addVehicleButton}
              onPress={() => router.push('/vehicles/add')}
            >
              <Text style={styles.addVehicleText}>+ Add New Vehicle</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Service Type</Text>
            
            <Card style={styles.serviceCard}>
              <Text style={styles.cardLabel}>What do you need help with?</Text>
              
              <TouchableOpacity
                style={[
                  styles.serviceOption,
                  serviceOption === 'repair' && styles.serviceOptionSelected
                ]}
                onPress={() => setServiceOption('repair')}
              >
                <View style={styles.serviceOptionContent}>
                  <View style={styles.serviceIconContainer}>
                    <Truck size={24} color={colors.secondary} />
                  </View>
                  <View style={styles.serviceTextContainer}>
                    <Text style={styles.serviceTitle}>Tire Repair</Text>
                    <Text style={styles.serviceDescription}>
                      Fix punctures or minor damage to your tire
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  serviceOption === 'repair' && styles.radioButtonSelected
                ]}>
                  {serviceOption === 'repair' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.serviceOption,
                  serviceOption === 'change' && styles.serviceOptionSelected
                ]}
                onPress={() => setServiceOption('change')}
              >
                <View style={styles.serviceOptionContent}>
                  <View style={styles.serviceIconContainer}>
                    <Truck size={24} color={colors.secondary} />
                  </View>
                  <View style={styles.serviceTextContainer}>
                    <Text style={styles.serviceTitle}>Tire Change</Text>
                    <Text style={styles.serviceDescription}>
                      Replace with your spare tire or a new tire
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  serviceOption === 'change' && styles.radioButtonSelected
                ]}>
                  {serviceOption === 'change' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
              
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Estimated Price:</Text>
                <Text style={styles.priceValue}>
                  ₹{serviceOption === 'repair' ? '399' : '599'}
                </Text>
              </View>
            </Card>
            
            <Card style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Text style={styles.cardLabel}>Service Location</Text>
                <TouchableOpacity>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.locationContent}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.locationText}>{location.address}</Text>
              </View>
            </Card>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Provider</Text>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Finding providers near you...</Text>
              </View>
            ) : providers.length > 0 ? (
              providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onSelect={() => setSelectedProvider(provider.id)}
                />
              ))
            ) : (
              <View style={styles.noProvidersContainer}>
                <AlertTriangle size={32} color={colors.warning} />
                <Text style={styles.noProvidersText}>
                  No providers available in your area at the moment
                </Text>
              </View>
            )}
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirm Request</Text>
            
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Service Summary</Text>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Service Type</Text>
                <View style={styles.summaryValueContainer}>
                  <Truck size={16} color={colors.secondary} />
                  <Text style={styles.summaryValue}>
                    Tire {serviceOption === 'repair' ? 'Repair' : 'Change'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Vehicle</Text>
                <Text style={styles.summaryValue}>
                  {selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.licensePlate})
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>{location.address}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Provider</Text>
                <Text style={styles.summaryValue}>
                  {providers.find(p => p.id === selectedProvider)?.name}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.priceBreakdown}>
                <Text style={styles.priceBreakdownTitle}>Price Breakdown</Text>
                
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Service Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₹{serviceOption === 'repair' ? '399' : '599'}
                  </Text>
                </View>
                
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Travel Charge</Text>
                  <Text style={styles.priceItemValue}>₹49</Text>
                </View>
                
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Platform Fee</Text>
                  <Text style={styles.priceItemValue}>₹29</Text>
                </View>
                
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ₹{serviceOption === 'repair' ? '477' : '677'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.paymentMethod}>
                <Text style={styles.paymentMethodLabel}>Payment Method</Text>
                <TouchableOpacity style={styles.paymentMethodSelector}>
                  <Text style={styles.paymentMethodText}>Cash on Delivery</Text>
                  <ChevronRight size={16} color={colors.gray} />
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Flat Tire Assistance" />
      
      <View style={styles.progressContainer}>
        <ProgressTracker steps={steps} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderStepContent()}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Back"
          variant="outline"
          onPress={handleBack}
          style={styles.footerButton}
        />
        <Button
          title={step === 4 ? "Confirm Request" : "Next"}
          onPress={handleNext}
          loading={isLoading && step === 4}
          style={styles.footerButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  addVehicleButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addVehicleText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  serviceCard: {
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 16,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  serviceOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  serviceOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.gray,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.dark,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  locationCard: {
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  changeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray,
  },
  noProvidersContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  noProvidersText: {
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
    marginTop: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  summaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  priceBreakdown: {
    marginBottom: 16,
  },
  priceBreakdownTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 12,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceItemLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  priceItemValue: {
    fontSize: 14,
    color: colors.dark,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  paymentMethod: {
    marginTop: 16,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 8,
  },
  paymentMethodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.light,
    borderRadius: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    color: colors.dark,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  footerButton: {
    flex: 1,
  },
});