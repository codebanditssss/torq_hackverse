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
import { 
  ClipboardCheck, 
  MapPin, 
  AlertTriangle,
  ChevronRight,
  Calendar,
  Clock,
  Check
} from 'lucide-react-native';

export default function InspectionServiceScreen() {
  const router = useRouter();
  const { vehicles, getDefaultVehicle } = useVehicleStore();
  const { providers, getProviders, createRepairRequest, isLoading } = useServiceStore();
  
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(getDefaultVehicle());
  const [inspectionType, setInspectionType] = useState<'basic' | 'comprehensive' | 'premium'>('comprehensive');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(true);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    address: 'Sector-54, Gurugram'
  });
  
  const possibleIssues = [
    'Engine noise',
    'Brake issues',
    'Suspension problems',
    'Electrical issues',
    'Transmission concerns',
    'Fluid leaks',
    'Overheating',
    'Starting problems',
    'Unusual vibrations',
    'Warning lights on'
  ];
  
  useEffect(() => {
    if (step === 3) {
      loadProviders();
    }
  }, [step]);
  
  const loadProviders = async () => {
    try {
      await getProviders('inspection', location.latitude, location.longitude);
    } catch (error) {
      Alert.alert('Error', 'Failed to load service providers');
    }
  };
  
  const steps = [
    { label: 'Vehicle', completed: step > 1, current: step === 1 },
    { label: 'Inspection Type', completed: step > 2, current: step === 2 },
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
  
  const toggleIssue = (issue: string) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter(i => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
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
      
      const inspectionPrice = 
        inspectionType === 'basic' ? 799 :
        inspectionType === 'comprehensive' ? 1299 : 1999;
      
      await createRepairRequest({
        userId: '1',
        vehicleId: selectedVehicle.id,
        serviceType: 'inspection',
        location,
        providerId: selectedProvider,
        vehicleIssues: selectedIssues,
        preferredTime: isScheduled ? `${scheduledDate} at ${scheduledTime}` : 'As soon as possible',
        scheduledFor: scheduledDateTime,
        price: inspectionPrice,
        notes: `${inspectionType.charAt(0).toUpperCase() + inspectionType.slice(1)} inspection requested`
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
            <Text style={styles.stepTitle}>Select Inspection Type</Text>
            
            <Card style={styles.inspectionCard}>
              <TouchableOpacity
                style={[
                  styles.inspectionOption,
                  inspectionType === 'basic' && styles.inspectionOptionSelected
                ]}
                onPress={() => setInspectionType('basic')}
              >
                <View style={styles.inspectionInfo}>
                  <Text style={styles.inspectionTitle}>Basic Inspection</Text>
                  <Text style={styles.inspectionDescription}>
                    Visual inspection of key components and basic diagnostics
                  </Text>
                  <View style={styles.inspectionFeatures}>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Engine check</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Brake inspection</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Fluid levels</Text>
                    </View>
                  </View>
                  <Text style={styles.inspectionPrice}>₹799</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  inspectionType === 'basic' && styles.radioButtonSelected
                ]}>
                  {inspectionType === 'basic' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.inspectionOption,
                  inspectionType === 'comprehensive' && styles.inspectionOptionSelected
                ]}
                onPress={() => setInspectionType('comprehensive')}
              >
                <View style={styles.inspectionInfo}>
                  <Text style={styles.inspectionTitle}>Comprehensive Inspection</Text>
                  <Text style={styles.inspectionDescription}>
                    Detailed inspection with computer diagnostics
                  </Text>
                  <View style={styles.inspectionFeatures}>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>All basic features</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Computer diagnostics</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Suspension check</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Electrical systems</Text>
                    </View>
                  </View>
                  <Text style={styles.inspectionPrice}>₹1,299</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  inspectionType === 'comprehensive' && styles.radioButtonSelected
                ]}>
                  {inspectionType === 'comprehensive' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.inspectionOption,
                  inspectionType === 'premium' && styles.inspectionOptionSelected
                ]}
                onPress={() => setInspectionType('premium')}
              >
                <View style={styles.inspectionInfo}>
                  <Text style={styles.inspectionTitle}>Premium Inspection</Text>
                  <Text style={styles.inspectionDescription}>
                    Complete vehicle health check with detailed report
                  </Text>
                  <View style={styles.inspectionFeatures}>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>All comprehensive features</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Emission testing</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Road test</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={14} color={colors.success} />
                      <Text style={styles.featureText}>Detailed digital report</Text>
                    </View>
                  </View>
                  <Text style={styles.inspectionPrice}>₹1,999</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  inspectionType === 'premium' && styles.radioButtonSelected
                ]}>
                  {inspectionType === 'premium' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            </Card>
            
            <Card style={styles.issuesCard}>
              <Text style={styles.cardLabel}>Select Issues (Optional)</Text>
              <Text style={styles.issuesDescription}>
                Help us understand your concerns better
              </Text>
              
              <View style={styles.issuesGrid}>
                {possibleIssues.map((issue) => (
                  <TouchableOpacity
                    key={issue}
                    style={[
                      styles.issueTag,
                      selectedIssues.includes(issue) && styles.issueTagSelected
                    ]}
                    onPress={() => toggleIssue(issue)}
                  >
                    <Text 
                      style={[
                        styles.issueTagText,
                        selectedIssues.includes(issue) && styles.issueTagTextSelected
                      ]}
                    >
                      {issue}
                    </Text>
                  </TouchableOpacity>
                ))}
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
            <Text style={styles.stepTitle}>Schedule Inspection</Text>
            
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
              
              <Card style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <Text style={styles.cardLabel}>Inspection Location</Text>
                  <TouchableOpacity>
                    <Text style={styles.changeText}>Change</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.locationContent}>
                  <MapPin size={20} color={colors.primary} />
                  <Text style={styles.locationText}>{location.address}</Text>
                </View>
              </Card>
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
                  <ClipboardCheck size={16} color={colors.secondary} />
                  <Text style={styles.summaryValue}>Car Inspection</Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Inspection Type</Text>
                <Text style={styles.summaryValue}>
                  {inspectionType.charAt(0).toUpperCase() + inspectionType.slice(1)} Inspection
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Vehicle</Text>
                <Text style={styles.summaryValue}>
                  {selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.licensePlate})
                </Text>
              </View>
              
              {selectedIssues.length > 0 && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Reported Issues</Text>
                  <Text style={styles.summaryValue}>
                    {selectedIssues.length} issues selected
                  </Text>
                </View>
              )}
              
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
                  <Text style={styles.priceItemLabel}>Inspection Fee</Text>
                  <Text style={styles.priceItemValue}>
                    ₹{inspectionType === 'basic' ? '799' : 
                       inspectionType === 'comprehensive' ? '1,299' : '1,999'}
                  </Text>
                </View>
                
                <View style={styles.priceItem}>
                  <Text style={styles.priceItemLabel}>Travel Charge</Text>
                  <Text style={styles.priceItemValue}>₹99</Text>
                </View>
                
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ₹{inspectionType === 'basic' ? '898' : 
                       inspectionType === 'comprehensive' ? '1,398' : '2,098'}
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
      <Header title="Car Inspection" />
      
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
  inspectionCard: {
    marginBottom: 16,
  },
  inspectionOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  inspectionOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  inspectionInfo: {
    flex: 1,
  },
  inspectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  inspectionDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  inspectionFeatures: {
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 6,
  },
  inspectionPrice: {
    fontSize: 16,
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
    marginLeft: 8,
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
  issuesCard: {
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  issuesDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
  issuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  issueTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.light,
    marginBottom: 8,
  },
  issueTagSelected: {
    backgroundColor: colors.primary,
  },
  issueTagText: {
    fontSize: 14,
    color: colors.dark,
  },
  issueTagTextSelected: {
    color: colors.white,
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
  timeContainer: {
    marginBottom: 16,
  },
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
  locationCard: {
    marginTop: 8,
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