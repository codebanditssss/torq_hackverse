import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/auth-store';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const { loginWithPhone, isLoading } = useAuthStore();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(true);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  useEffect(() => {
    startTimer();
    
    // Auto-generate OTP for demo
    setIsGeneratingOtp(true);
    setTimeout(() => {
      const demoOtp = ['1', '2', '3', '4'];
      demoOtp.forEach((digit, index) => {
        setOtp(prev => {
          const newOtp = [...prev];
          newOtp[index] = digit;
          return newOtp;
        });
        
        if (inputRefs.current[index]) {
          inputRefs.current[index]?.setNativeProps({ text: digit });
        }
        
        if (index < 3 && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus();
        }
      });
      setIsGeneratingOtp(false);
    }, 1500);
    
    return () => {
      // Clear any timers
    };
  }, []);
  
  const startTimer = () => {
    setIsResendActive(false);
    setTimer(30);
    
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsResendActive(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };
  
  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Move to next input if current input is filled
    if (text !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input if backspace is pressed and current input is empty
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleResendOtp = () => {
    if (isResendActive) {
      Alert.alert('OTP Sent', `A new OTP has been sent to ${phone}`);
      startTimer();
      
      // Auto-generate new OTP for demo
      setIsGeneratingOtp(true);
      setTimeout(() => {
        const demoOtp = ['1', '2', '3', '4'];
        demoOtp.forEach((digit, index) => {
          setOtp(prev => {
            const newOtp = [...prev];
            newOtp[index] = digit;
            return newOtp;
          });
          
          if (inputRefs.current[index]) {
            inputRefs.current[index]?.setNativeProps({ text: digit });
          }
        });
        setIsGeneratingOtp(false);
      }, 1500);
    }
  };
  
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
      return;
    }
    
    try {
      // For demo, we'll check if OTP is 1234
      await loginWithPhone(phone as string, enteredOtp);
      router.replace('/');
    } catch (error) {
      Alert.alert('Verification Failed', 'Failed to verify OTP. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Verify OTP" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.description}>
            We have sent a verification code to {phone}
          </Text>
          
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                editable={!isGeneratingOtp}
              />
            ))}
          </View>
          
          {isGeneratingOtp && (
            <View style={styles.generatingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.generatingText}>Generating OTP...</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.resendContainer}
            onPress={handleResendOtp}
            disabled={!isResendActive || isGeneratingOtp}
          >
            <Text 
              style={[
                styles.resendText,
                (!isResendActive || isGeneratingOtp) && styles.resendTextDisabled
              ]}
            >
              {isResendActive 
                ? 'Resend OTP' 
                : `Resend OTP in ${timer}s`
              }
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Verify"
            onPress={handleVerifyOtp}
            loading={isLoading}
            disabled={isGeneratingOtp || otp.some(digit => digit === '')}
            style={styles.verifyButton}
          />
          
          <TouchableOpacity 
            style={styles.changeNumberContainer}
            onPress={() => router.back()}
          >
            <Text style={styles.changeNumberText}>Change Phone Number</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 40,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 8,
    backgroundColor: colors.white,
  },
  generatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  generatingText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  resendContainer: {
    marginBottom: 40,
  },
  resendText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: colors.gray,
  },
  verifyButton: {
    width: '100%',
    marginBottom: 24,
  },
  changeNumberContainer: {
    marginBottom: 24,
  },
  changeNumberText: {
    fontSize: 14,
    color: colors.gray,
    textDecorationLine: 'underline',
  },
});