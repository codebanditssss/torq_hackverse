import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useVehicleStore } from '@/store/vehicle-store';
import { useAuthStore } from '@/store/auth-store';

export default function AddVehicleScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addVehicle } = useVehicleStore();
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'cng'>('petrol');
  const [isLoading, setIsLoading] = useState(false);
  
  const [makeError, setMakeError] = useState('');
  const [modelError, setModelError] = useState('');
  const [yearError, setYearError] = useState('');
  const [colorError, setColorError] = useState('');
  const [licensePlateError, setLicensePlateError] = useState('');
  
  const validateMake = (make: string) => {
    if (!make) {
      setMakeError('Make is required');
      return false;
    }
    setMakeError('');
    return true;
  };
  
  const validateModel = (model: string) => {
    if (!model) {
      setModelError('Model is required');
      return false;
    }
    setModelError('');
    return true;
  };
  
  const validateYear = (year: string) => {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    
    if (!year) {
      setYearError('Year is required');
      return false;
    } else if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
      setYearError(`Year must be between 1900 and ${currentYear + 1}`);
      return false;
    }
    setYearError('');
    return true;
  };
  
  const validateColor = (color: string) => {
    if (!color) {
      setColorError('Color is required');
      return false;
    }
    setColorError('');
    return true;
  };
  
  const validateLicensePlate = (licensePlate: string) => {
    if (!licensePlate) {
      setLicensePlateError('License plate is required');
      return false;
    }
    setLicensePlateError('');
    return true;
  };
  
  const handleAddVehicle = () => {
    const isMakeValid = validateMake(make);
    const isModelValid = validateModel(model);
    const isYearValid = validateYear(year);
    const isColorValid = validateColor(color);
    const isLicensePlateValid = validateLicensePlate(licensePlate);
    
    if (isMakeValid && isModelValid && isYearValid && isColorValid && isLicensePlateValid) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        addVehicle({
          userId: user?.id || '1',
          make,
          model,
          year,
          color,
          licensePlate,
          fuelType
        });
        
        setIsLoading(false);
        Alert.alert(
          'Vehicle Added',
          'Your vehicle has been added successfully.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }, 1000);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Vehicle" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Input
              label="Make"
              placeholder="e.g. Honda, Toyota, etc."
              value={make}
              onChangeText={setMake}
              error={makeError}
            />
            
            <Input
              label="Model"
              placeholder="e.g. Civic, Corolla, etc."
              value={model}
              onChangeText={setModel}
              error={modelError}
            />
            
            <Input
              label="Year"
              placeholder="e.g. 2020"
              keyboardType="number-pad"
              value={year}
              onChangeText={setYear}
              error={yearError}
            />
            
            <Input
              label="Color"
              placeholder="e.g. Red, Blue, etc."
              value={color}
              onChangeText={setColor}
              error={colorError}
            />
            
            <Input
              label="License Plate"
              placeholder="e.g. MH 01 AB 1234"
              value={licensePlate}
              onChangeText={setLicensePlate}
              error={licensePlateError}
            />
            
            <Text style={styles.label}>Fuel Type</Text>
            <View style={styles.fuelTypeContainer}>
              {(['petrol', 'diesel', 'electric', 'cng'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.fuelTypeButton,
                    fuelType === type && styles.fuelTypeButtonActive
                  ]}
                  onPress={() => setFuelType(type)}
                >
                  <Text 
                    style={[
                      styles.fuelTypeText,
                      fuelType === type && styles.fuelTypeTextActive
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Button
              title="Add Vehicle"
              onPress={handleAddVehicle}
              loading={isLoading}
              style={styles.addButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.dark,
    fontWeight: '500',
  },
  fuelTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  fuelTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  fuelTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  fuelTypeText: {
    fontSize: 14,
    color: colors.dark,
  },
  fuelTypeTextActive: {
    color: colors.white,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 8,
  },
});