import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { 
  Bell, 
  Globe, 
  Moon, 
  Lock, 
  Fingerprint,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  const handleToggleNotification = () => {
    setNotificationEnabled(!notificationEnabled);
  };
  
  const handleToggleLocation = () => {
    setLocationEnabled(!locationEnabled);
  };
  
  const handleToggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
    Alert.alert('Dark Mode', 'Dark mode will be implemented in a future update.');
  };
  
  const handleToggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
    Alert.alert('Biometric Authentication', 'Biometric authentication will be implemented in a future update.');
  };
  
  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be implemented soon');
  };
  
  const handleLanguageSettings = () => {
    Alert.alert('Language Settings', 'This feature will be implemented soon');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={handleToggleNotification}
              trackColor={{ false: colors.lightGray, true: colors.primary + '50' }}
              thumbColor={notificationEnabled ? colors.primary : colors.gray}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Globe size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={handleToggleLocation}
              trackColor={{ false: colors.lightGray, true: colors.primary + '50' }}
              thumbColor={locationEnabled ? colors.primary : colors.gray}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Moon size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: colors.lightGray, true: colors.primary + '50' }}
              thumbColor={darkModeEnabled ? colors.primary : colors.gray}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleLanguageSettings}
          >
            <View style={styles.settingInfo}>
              <Globe size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <View style={styles.settingAction}>
              <Text style={styles.settingValue}>English</Text>
              <ChevronRight size={16} color={colors.gray} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <View style={styles.settingInfo}>
              <Lock size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <ChevronRight size={16} color={colors.gray} />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Fingerprint size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: colors.lightGray, true: colors.primary + '50' }}
              thumbColor={biometricEnabled ? colors.primary : colors.gray}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 12,
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: colors.gray,
    marginRight: 8,
  },
});