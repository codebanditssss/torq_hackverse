import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
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
import { 
  Video, 
  MapPin, 
  AlertTriangle,
  ChevronRight,
  Calendar,
  Clock
} from 'lucide-react-native';

export default function DashcamServiceScreen() {
  const router = useRouter();
  const { vehicles, getDefaultVehicle } = useVehicleStore();
  const { providers, getProviders, createFitmentRequest, isLoading } = useServiceStore();
  
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(getDefaultVehicle());
  const [dashcamType, setDashcamType] = useState<'front' | 'dual' | 'threeChannel'>('dual');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    address: 'Sector-54, Gurugram'
  });
  
  useEffect(() => {
    if (step === 3) {
      loadProviders();
    }
  }, [step]);
  
  const loadProviders = async () => {
    try {
      await getProviders('dashcam', location.latitude, location.longitude);
    } catch (error) {
      Alert.alert('Error', 'Failed to load service providers');
    }
  };
  
  const steps = [
    { label: 'Vehicle', completed: step > 1, current: step === 1 },
    { label: 'Dashcam Type', completed: step > 2, current: step === 2 },
    { label: 'Provider', completed: step > 3, current: step === 3 },
    { label: 'Schedule', completed: step > 4, current: step === 4 },
    { label: 'Confirm', completed: step > 5, current: step === 5 }
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
    
    if (step < 5) {
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
      
      const scheduledDateTime = isScheduled ? 
        new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString() : undefined;
      
      const dashcamPrice = 
        dashcamType === 'front' ? 1499 :
        dashcamType === 'dual' ? 2499 : 3999;
      
      await createFitmentRequest({
        userId: '1',
        vehicleId: selectedVehicle.id,
        serviceType: 'dashcam',
        location,
        providerId: selectedProvider,
        productDetails: `${dashcamType === 'front' ? 'Front' : dashcamType === 'dual' ? 'Dual' : '3-Channel'} Dashcam`,
        installationType: 'Professional Installation',
        scheduledFor: scheduledDateTime,
        price: dashcamPrice,
        notes: 'Please bring all necessary tools and cables'
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
            <Text style={styles.stepTitle}>Select Dashcam Type</Text>
            
            <Card style={styles.dashcamCard}>
              <TouchableOpacity
                style={[
                  styles.dashcamOption,
                  dashcamType === 'front' && styles.dashcamOptionSelected
                ]}
                onPress={() => setDashcamType('front')}
              >
                <View style={styles.dashcamImageContainer}>
                  <View style={styles.dashcamImagePlaceholder}>
                    <Video size={32} color={colors.secondary} />
                  </View>
                </View>
                <View style={styles.dashcamInfo}>
                  <Text style={styles.dashcamTitle}>Front Dashcam</Text>
                  <Text style={styles.dashcamDescription}>
                    Single camera recording the front view of your vehicle
                  </Text>
                  <Text style={styles.dashcamPrice}>₹1,499</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  dashcamType === 'front' && styles.radioButtonSelected
                ]}>
                  {dashcamType === 'front' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.dashcamOption,
                  dashcamType === 'dual' && styles.dashcamOptionSelected
                ]}
                onPress={() => setDashcamType('dual')}
              >
                <View style={styles.dashcamImageContainer}>
                  <View style={styles.dashcamImagePlaceholder}>
                    <Video size={32} color={colors.secondary} />
                  </View>
                </View>
                <View style={styles.dashcamInfo}>
                  <Text style={styles.dashcamTitle}>Dual Dashcam</Text>
                  <Text style={styles.dashcamDescription}>
                    Front and rear cameras for complete coverage
                  </Text>
                  <Text style={styles.dashcamPrice}>₹2,499</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  dashcamType === 'dual' && styles.radioButtonSelected
                ]}>
                  {dashcamType === 'dual' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.dashcamOption,
                  dashcamType === 'threeChannel' && styles.dashcamOptionSelected
                ]}
                onPress={() => setDashcamType('threeChannel')}
              >
                <View style={styles.dashcamImageContainer}>
                  <View style={styles.dashcamImagePlaceholder}>
                    <Video size={32} color={colors.secondary} />
                  </View>
                </View>
                <View style={styles.dashcamInfo}>
                  <Text style={styles.dashcamTitle}>3-Channel Dashcam</Text>
                  <Text style={styles.dashcamDescription}>
                    Front, rear, and interior cameras for maximum security
                  </Text>
                  <Text style={styles.dashcamPrice}>₹3,999</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  dashcamType === 'threeChannel' && styles.radioButtonSelected
                ]}>
                  {dashcamType === 'threeChannel' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            </Card>
            
            <Card style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Text style={styles.cardLabel}>Installation Location</Text>
                <TouchableOpacity>
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
            <Text style={styles.stepTitle}>Schedule Installation</Text>
            
            <Card style={styles.scheduleCard}>
              <View style={styles.scheduleOptions}>
                <TouchableOpacity
                  style={[
                    styles.scheduleOption,
                    !isScheduled && styles.scheduleOptionSelected
                  ]}
                  onPress={() => setIsScheduled(false)}
                >
                  <View style={[
                    styles.radioButton,
                    !isScheduled && styles.radioButtonSelected
                  ]}>
                    {!isScheduled && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.scheduleOptionText}>As soon as possible</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.scheduleOption,
                    isScheduled && styles.scheduleOptionSelected
                  ]}
                  onPress={() => setIsScheduled(true)}
                >
                  <View style={[
                    styles.radioButton,
                    isScheduled && styles.radioButtonSelected
                  ]}>
                    {isScheduled && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.scheduleOptionText}>Schedule for later</Text>
                </TouchableOpacity>
              </View>
              
              {isScheduled && (
                <View style={styles.dateTimeContainer}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateTimeLabel}>Date</Text>
                    <View style={styles.dateInputContainer}>
                      <Calendar size={20} color={colors.primary} />
                      <TouchableOpacity 
                        style={styles.dateInput}
                        onPress={() => {
                          // In a real app, show a date picker here
                          Alert.alert('Select Date', 'Date picker would appear here');
                        }}
                      >
                        <Text style={styles.dateInputText}>{scheduledDate}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.timeContainer}>
                    <Text style={styles.dateTimeLabel}>Time</Text>
                    <View style={styles.timeInputContainer}>
                      <Clock size={20} color={colors.primary} />
                      <TouchableOpacity 
                        style={styles.timeInput}
                        onPress={() => {
                          // In a real app, show a time picker here
                          Alert.alert('Select Time', 'Time picker would appear here');
                        }}
                      >
                        <Text style={styles.timeInputText}>{scheduledTime}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              
              <View style={styles.scheduleNote}>
                <AlertTriangle size={16} color={colors.warning} />
                <Text style={styles.scheduleNoteText}>
                  {isScheduled 
                    ? 'Please ensure someone is present at the location during the scheduled time.'
                    : 'We will dispatch a technician as soon as one becomes available.'}
                </Text>
              </View>
            </Card>
          </View>
        );
      
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirm Request</Text>
            
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Service Summary</Text>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Service Type</Text>
                <View style={styles.summaryValueContainer}>
                  <Video size={16} color={colors.secondary} />
                  <Text style={styles.summaryValue}>Dashcam Installation</Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Dashcam Type</Text>
                <Text style={styles.summaryValue}>
                  {dashcamType === 'front' ? 'Front Dashcam' : 
                   dashcamType === 'dual' ? 'Dual Dashcam' : 
                   '3-Channel Dashcam'}
                </Text>
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
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Schedule</Text>
                <Text style={styles.summaryValue}>
                  {isScheduled 
                    ? `${scheduledDate} at ${scheduledTime}`
                    : 'As soon as possible'}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.priceBreakdown}>
                <Text style={styles.priceBreakdownTitle}>Price Breakdown</Text>
                
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Dashcam</Text>
                  <Text style={styles.priceItemValue}>
                    ₹{dashcamType === 'front' ? '1,499' : 
                       dashcamType === 'dual' ? '2,499' : '3,999'}
                  </Text>
                </View>
                
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Installation Fee</Text>
                  <Text style={styles.priceItemValue}>₹499</Text>
                </View>
                
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Travel Charge</Text>
                  <Text style={styles.priceItemValue}>₹99</Text>
                </View>
                
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ₹{dashcamType === 'front' ? '2,097' : 
                       dashcamType === 'dual' ? '3,097' : '4,597'}
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
      <Header title="Dashcam Installation" />
      
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
          title={step === 5 ? "Confirm Request" : "Next"}
          onPress={handleNext}
          loading={isLoading && step === 5}
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
  dashcamCard: {
    marginBottom: 16,
  },
  dashcamOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  dashcamOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  dashcamImageContainer: {
    marginRight: 12,
  },
  dashcamImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashcamInfo: {
    flex: 1,
  },
  dashcamTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  dashcamDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  dashcamPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
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
  locationCard: {
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
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
  scheduleCard: {
    marginBottom: 16,
  },
  scheduleOptions: {
    marginBottom: 16,
  },
  scheduleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleOptionSelected: {
    backgroundColor: colors.light,
  },
  scheduleOptionText: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 12,
  },
  dateTimeContainer: {
    marginBottom: 16,
  },
  dateContainer: {
    marginBottom: 16,
  },
  timeContainer: {},
  dateTimeLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateInput: {
    flex: 1,
    marginLeft: 8,
  },
  dateInputText: {
    fontSize: 16,
    color: colors.dark,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeInput: {
    flex: 1,
    marginLeft: 8,
  },
  timeInputText: {
    fontSize: 16,
    color: colors.dark,
  },
  scheduleNote: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '10',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  scheduleNoteText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
    flex: 1,
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