import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { 
  User,
  CreditCard,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Star
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Force a reload of the app to ensure all states are cleared
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  const menuItems = [
    {
      icon: <User size={20} color={colors.primary} />,
      title: 'Personal Information',
      onPress: () => router.push('/profile/personal-info')
    },
    {
      icon: <CreditCard size={20} color={colors.primary} />,
      title: 'Payment Methods',
      onPress: () => router.push('/profile/payment-methods')
    },
    {
      icon: <Star size={20} color={colors.primary} />,
      title: 'My Reviews',
      onPress: () => router.push('/profile/reviews')
    },
    {
      icon: <Settings size={20} color={colors.primary} />,
      title: 'Settings',
      onPress: () => router.push('/profile/settings')
    },
    {
      icon: <HelpCircle size={20} color={colors.primary} />,
      title: 'Help & Support',
      onPress: () => router.push('/profile/support')
    },
    {
      icon: <Shield size={20} color={colors.primary} />,
      title: 'Privacy & Terms',
      onPress: () => router.push('/profile/privacy')
    },
  ];
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Image
            source={user?.profileImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250'}
            style={styles.profileImage}
            contentFit="cover"
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            <Text style={styles.profilePhone}>{user?.phone || '+91 XXXXXXXXXX'}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: colors.gray,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.light,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  menuSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.danger,
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 12,
    color: colors.gray,
  },
});