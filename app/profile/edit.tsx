import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/auth-store';
import { User, Mail, Phone, Camera } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
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
  
  const handleUpdateProfile = () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    
    if (isNameValid && isEmailValid && isPhoneValid) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        updateUser({
          name,
          email,
          phone
        });
        
        setIsLoading(false);
        Alert.alert(
          'Profile Updated',
          'Your profile has been updated successfully.',
          [
            { 
              text: 'OK', 
              onPress: () => router.back() 
            }
          ]
        );
      }, 1000);
    }
  };
  
  const handleChangeProfilePicture = () => {
    Alert.alert('Change Profile Picture', 'This feature will be implemented soon');
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
      <Header title="Edit Profile" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.changePhotoButton}
              onPress={handleChangeProfilePicture}
            >
              <Camera size={16} color={colors.primary} />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
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
            
            <Button
              title="Save Changes"
              onPress={handleUpdateProfile}
              loading={isLoading}
              style={styles.saveButton}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: '600',
    color: colors.primary,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  saveButton: {
    marginTop: 16,
  },
});