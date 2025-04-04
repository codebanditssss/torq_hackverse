import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { User, Mail, Phone, MapPin } from 'lucide-react-native';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setInitialLoading(false);
    } else {
      setInitialLoading(false);
    }
  }, [user]);
  
  const validateName = (name: string) => {
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePhone = (phone: string) => {
    // Allow for international format with spaces, dashes, or parentheses
    const phoneRegex = /^(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };
  
  const validateAddress = (address: string) => {
    if (!address) {
      setAddressError('Address is required');
      return false;
    }
    setAddressError('');
    return true;
  };
  
  const handleSave = () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isAddressValid = validateAddress(address);
    
    if (isNameValid && isEmailValid && isPhoneValid && isAddressValid) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        updateUser({
          name,
          email,
          phone,
          address
        });
        
        setIsLoading(false);
        Alert.alert(
          'Success',
          'Your personal information has been updated successfully.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }, 1000);
    }
  };
  
  if (initialLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Personal Information" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              validateName(text);
            }}
            error={nameError}
            leftIcon={<User size={20} color={colors.gray} />}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            error={emailError}
            leftIcon={<Mail size={20} color={colors.gray} />}
          />
          
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              validatePhone(text);
            }}
            error={phoneError}
            leftIcon={<Phone size={20} color={colors.gray} />}
          />
          
          <Text style={styles.sectionTitle}>Address</Text>
          
          <Input
            label="Home Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              validateAddress(text);
            }}
            error={addressError}
            leftIcon={<MapPin size={20} color={colors.gray} />}
            multiline
            numberOfLines={3}
            style={styles.addressInput}
          />
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Your personal information is used to provide you with better service and is kept secure.
            </Text>
          </View>
          
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 16,
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  infoContainer: {
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray,
  },
  saveButton: {
    marginBottom: 24,
  },
});