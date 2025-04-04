import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/auth-store';
import { User, Mail, Phone, Lock, Check } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Clear any auth errors when component mounts
  React.useEffect(() => {
    clearError();
  }, []);
  
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
    const phoneRegex = /^\+?[0-9]{10,14}$/;
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
  
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      const isNameValid = validateName(name);
      const isEmailValid = validateEmail(email);
      const isPhoneValid = validatePhone(phone);
      
      if (isNameValid && isEmailValid && isPhoneValid) {
        setStep(2);
      }
    }
  };
  
  const handleRegister = async () => {
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isPasswordValid && isConfirmPasswordValid) {
      if (!acceptTerms) {
        Alert.alert('Terms & Conditions', 'Please accept the terms and conditions to continue.');
        return;
      }
      
      try {
        await register(name, email, phone, password);
        router.replace('/');
      } catch (error) {
        Alert.alert('Registration Failed', 'Failed to create account. Please try again.');
      }
    }
  };
  
  const renderStep1 = () => {
    return (
      <>
        <Text style={styles.stepTitle}>Step 1 of 2: Personal Information</Text>
        
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          error={nameError}
          leftIcon={<User size={20} color={colors.gray} />}
        />
        
        <Input
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          leftIcon={<Mail size={20} color={colors.gray} />}
        />
        
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          error={phoneError}
          leftIcon={<Phone size={20} color={colors.gray} />}
        />
        
        <Button
          title="Next"
          onPress={handleNextStep}
          style={styles.actionButton}
        />
      </>
    );
  };
  
  const renderStep2 = () => {
    return (
      <>
        <Text style={styles.stepTitle}>Step 2 of 2: Create Password</Text>
        
        <Input
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          leftIcon={<Lock size={20} color={colors.gray} />}
        />
        
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={confirmPasswordError}
          leftIcon={<Lock size={20} color={colors.gray} />}
        />
        
        <TouchableOpacity 
          style={styles.termsContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
        >
          <View style={[
            styles.checkbox,
            acceptTerms && styles.checkboxChecked
          ]}>
            {acceptTerms && <Check size={16} color={colors.white} />}
          </View>
          <Text style={styles.termsText}>
            I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            variant="outline"
            onPress={() => setStep(1)}
            style={styles.backButton}
          />
          
          <Button
            title="Register"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />
        </View>
      </>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create Account" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: step === 1 ? '50%' : '100%' }
                  ]} 
                />
              </View>
            </View>
            
            {step === 1 ? renderStep1() : renderStep2()}
            
            {step === 1 && (
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
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
  errorContainer: {
    backgroundColor: colors.danger + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  termsText: {
    fontSize: 14,
    color: colors.gray,
    flex: 1,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  backButton: {
    flex: 1,
  },
  registerButton: {
    flex: 2,
  },
  actionButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  loginText: {
    color: colors.gray,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});