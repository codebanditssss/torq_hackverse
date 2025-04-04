import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, TextInput, HelperText, RadioButton, Checkbox } from 'react-native-paper';
import { router } from 'expo-router';
import { useServiceStore, ServiceType } from '../store/service-store';
import { serviceConfig } from '../config/services';
import { useLocationStore } from '../store/location-store';
import { useVehicleStore } from '../store/vehicle-store';
import { VehicleSelector } from './VehicleSelector';
import { LocationPicker } from './LocationPicker';

interface ServiceRequestFormProps {
  serviceType: ServiceType;
}

export function ServiceRequestForm({ serviceType }: ServiceRequestFormProps) {
  const createServiceRequest = useServiceStore((state) => state.createServiceRequest);
  const { selectedLocation } = useLocationStore();
  const { selectedVehicle } = useVehicleStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const config = serviceConfig[serviceType];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleLocationSelect = (location: { latitude: number; longitude: number; address: string }) => {
    handleInputChange('location', location);
  };

  const handleVehicleSelect = (vehicle: any) => {
    handleInputChange('vehicle', vehicle);
  };

  const renderServiceSpecificFields = () => {
    switch (serviceType) {
      case 'fuel':
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Fuel Details</Text>
            <RadioButton.Group
              onValueChange={value => handleInputChange('fuelType', value)}
              value={formData.fuelType || ''}
            >
              {config.types.map(type => (
                <RadioButton.Item
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  value={type}
                />
              ))}
            </RadioButton.Group>
            <TextInput
              label="Fuel Amount (gallons)"
              keyboardType="numeric"
              value={formData.fuelAmount?.toString() || ''}
              onChangeText={value => handleInputChange('fuelAmount', Number(value))}
              error={Number(formData.fuelAmount) > config.maxAmount[formData.fuelType || 'gasoline']}
              style={styles.input}
            />
            {Number(formData.fuelAmount) > config.maxAmount[formData.fuelType || 'gasoline'] && (
              <HelperText type="error">
                Maximum amount allowed is {config.maxAmount[formData.fuelType || 'gasoline']} gallons
              </HelperText>
            )}
          </View>
        );

      case 'battery':
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Battery Service Details</Text>
            <RadioButton.Group
              onValueChange={value => handleInputChange('batteryIssue', value)}
              value={formData.batteryIssue || ''}
            >
              {config.issues.map(issue => (
                <RadioButton.Item
                  key={issue.value}
                  label={issue.label}
                  value={issue.value}
                />
              ))}
            </RadioButton.Group>
            <RadioButton.Group
              onValueChange={value => handleInputChange('batteryType', value)}
              value={formData.batteryType || ''}
            >
              {config.commonBatteryTypes.map(type => (
                <RadioButton.Item
                  key={type}
                  label={type}
                  value={type}
                />
              ))}
            </RadioButton.Group>
          </View>
        );

      case 'tire':
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Tire Service Details</Text>
            <RadioButton.Group
              onValueChange={value => handleInputChange('tireIssue', value)}
              value={formData.tireIssue || ''}
            >
              {config.issues.map(issue => (
                <RadioButton.Item
                  key={issue.value}
                  label={issue.label}
                  value={issue.value}
                />
              ))}
            </RadioButton.Group>
            <RadioButton.Group
              onValueChange={value => handleInputChange('tireLocation', value)}
              value={formData.tireLocation || ''}
            >
              {config.locations.map(location => (
                <RadioButton.Item
                  key={location.value}
                  label={location.label}
                  value={location.value}
                />
              ))}
            </RadioButton.Group>
            <Checkbox.Item
              label="I have a spare tire"
              status={formData.hasSpareTire ? 'checked' : 'unchecked'}
              onPress={() => handleInputChange('hasSpareTire', !formData.hasSpareTire)}
            />
          </View>
        );

      case 'tow':
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Towing Details</Text>
            <RadioButton.Group
              onValueChange={value => handleInputChange('towReason', value)}
              value={formData.towReason || ''}
            >
              {config.reasons.map(reason => (
                <RadioButton.Item
                  key={reason.value}
                  label={reason.label}
                  value={reason.value}
                />
              ))}
            </RadioButton.Group>
            <RadioButton.Group
              onValueChange={value => handleInputChange('destinationType', value)}
              value={formData.destinationType || ''}
            >
              {config.destinationTypes.map(type => (
                <RadioButton.Item
                  key={type.value}
                  label={type.label}
                  value={type.value}
                />
              ))}
            </RadioButton.Group>
            <TextInput
              label="Destination Address"
              value={formData.destinationAddress || ''}
              onChangeText={value => handleInputChange('destinationAddress', value)}
              style={styles.input}
            />
          </View>
        );

      case 'lockout':
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Lockout Service Details</Text>
            <RadioButton.Group
              onValueChange={value => handleInputChange('lockoutType', value)}
              value={formData.lockoutType || ''}
            >
              {config.types.map(type => (
                <RadioButton.Item
                  key={type.value}
                  label={type.label}
                  value={type.value}
                />
              ))}
            </RadioButton.Group>
            <Checkbox.Item
              label="I have a spare key"
              status={formData.hasSpareKey ? 'checked' : 'unchecked'}
              onPress={() => handleInputChange('hasSpareKey', !formData.hasSpareKey)}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const validateForm = () => {
    if (!selectedVehicle) {
      setError('Please select a vehicle');
      return false;
    }

    if (!selectedLocation) {
      setError('Please select a location');
      return false;
    }

    // Service-specific validation
    switch (serviceType) {
      case 'fuel':
        if (!formData.fuelType) {
          setError('Please select a fuel type');
          return false;
        }
        if (!formData.fuelAmount || formData.fuelAmount <= 0) {
          setError('Please enter a valid fuel amount');
          return false;
        }
        if (formData.fuelAmount > config.maxAmount[formData.fuelType]) {
          setError(`Maximum amount allowed is ${config.maxAmount[formData.fuelType]} gallons`);
          return false;
        }
        break;

      case 'battery':
        if (!formData.batteryIssue) {
          setError('Please select a battery issue');
          return false;
        }
        if (!formData.batteryType) {
          setError('Please select a battery type');
          return false;
        }
        break;

      case 'tire':
        if (!formData.tireIssue) {
          setError('Please select a tire issue');
          return false;
        }
        if (!formData.tireLocation) {
          setError('Please select the tire location');
          return false;
        }
        break;

      case 'tow':
        if (!formData.towReason) {
          setError('Please select a towing reason');
          return false;
        }
        if (!formData.destinationType) {
          setError('Please select a destination type');
          return false;
        }
        if (!formData.destinationAddress) {
          setError('Please enter a destination address');
          return false;
        }
        break;

      case 'lockout':
        if (!formData.lockoutType) {
          setError('Please select a lockout type');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const serviceRequest = {
        serviceType,
        vehicleId: selectedVehicle.id,
        location: selectedLocation,
        ...formData,
      };

      await createServiceRequest(serviceRequest);
      router.push('/services/tracking');
    } catch (err: any) {
      setError(err.message || 'Failed to create service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <VehicleSelector onSelect={handleVehicleSelect} />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Service Location</Text>
        <LocationPicker onLocationSelect={handleLocationSelect} />
      </View>

      {renderServiceSpecificFields()}

      <TextInput
        label="Additional Notes"
        multiline
        numberOfLines={4}
        value={formData.description || ''}
        onChangeText={value => handleInputChange('description', value)}
        style={styles.input}
      />

      {error && (
        <HelperText type="error" style={styles.error}>
          {error}
        </HelperText>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        Request Service
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  input: {
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  error: {
    marginBottom: 16,
  },
  submitButton: {
    marginVertical: 16,
  },
});
