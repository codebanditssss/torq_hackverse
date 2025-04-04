import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Mail } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const handleResetPassword = () => {
    if (validateEmail(email)) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Reset Link Sent',
          `A password reset link has been sent to ${email}. Please check your email.`,
          [
            { 
              text: 'OK', 
              onPress: () => router.back() 
            }
          ]
        );
      }, 1500);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Forgot Password" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.description}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
          
          <View style={styles.formContainer}>
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
            
            <Button
              title="Send Reset Link"
              onPress={handleResetPassword}
              loading={isLoading}
              style={styles.resetButton}
            />
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  resetButton: {
    marginTop: 16,
  },
});