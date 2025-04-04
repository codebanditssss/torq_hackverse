import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { Mail, Lock, Car, Phone } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('demo@saarthi.com');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Clear any auth errors when component mounts
  useEffect(() => {
    clearError();
  }, []);
  
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
  
  const handleLogin = async () => {
    let isValid = false;
    
    if (loginMethod === 'email') {
      isValid = validateEmail(email) && validatePassword(password);
      if (isValid) {
        try {
          await login(email, password);
          router.replace('/');
        } catch (error) {
          Alert.alert('Login Failed', 'Invalid email or password');
        }
      }
    } else {
      isValid = validatePhone(phone) && validatePassword(password);
      if (isValid) {
        try {
          // For demo, we'll use the email login
          await login('demo@saarthi.com', password);
          router.replace('/');
        } catch (error) {
          Alert.alert('Login Failed', 'Invalid phone or password');
        }
      }
    }
  };
  
  const handleRegister = () => {
    router.push('/auth/register');
  };
  
  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };
  
  const handlePhoneOTP = () => {
    if (validatePhone(phone)) {
      router.push({
        pathname: '/auth/verify-otp',
        params: { phone }
      });
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    Alert.alert('Social Login', `${provider} login will be implemented soon`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Car size={60} color={colors.primary} />
            </View>
            <Text style={styles.appName}>Saarthi</Text>
            <Text style={styles.tagline}>Emergency vehicle care, anytime, anywhere</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.loginMethodToggle}>
              <TouchableOpacity 
                style={[
                  styles.loginMethodButton,
                  loginMethod === 'email' && styles.loginMethodButtonActive
                ]}
                onPress={() => setLoginMethod('email')}
              >
                <Mail size={16} color={loginMethod === 'email' ? colors.white : colors.gray} />
                <Text 
                  style={[
                    styles.loginMethodText,
                    loginMethod === 'email' && styles.loginMethodTextActive
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.loginMethodButton,
                  loginMethod === 'phone' && styles.loginMethodButtonActive
                ]}
                onPress={() => setLoginMethod('phone')}
              >
                <Phone size={16} color={loginMethod === 'phone' ? colors.white : colors.gray} />
                <Text 
                  style={[
                    styles.loginMethodText,
                    loginMethod === 'phone' && styles.loginMethodTextActive
                  ]}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>
            
            {loginMethod === 'email' ? (
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
            ) : (
              <View>
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  error={phoneError}
                  leftIcon={<Phone size={20} color={colors.gray} />}
                />
                
                <TouchableOpacity 
                  style={styles.otpButton}
                  onPress={handlePhoneOTP}
                >
                  <Text style={styles.otpButtonText}>Login with OTP</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              leftIcon={<Lock size={20} color={colors.gray} />}
            />
            
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <Button
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />
            
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
            
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
              >
                <View style={styles.socialIconContainer}>
                  <Text style={styles.socialIcon}>G</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <View style={styles.socialIconContainer}>
                  <Text style={styles.socialIcon}>f</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
              >
                <View style={styles.socialIconContainer}>
                  <Text style={styles.socialIcon}>🍎</Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 24,
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
  loginMethodToggle: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  loginMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    flex: 1,
    backgroundColor: colors.white,
  },
  loginMethodButtonActive: {
    backgroundColor: colors.primary,
  },
  loginMethodText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    marginLeft: 8,
  },
  loginMethodTextActive: {
    color: colors.white,
  },
  otpButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  otpButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 24,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    color: colors.gray,
    fontSize: 14,
    marginHorizontal: 16,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  registerText: {
    color: colors.gray,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});