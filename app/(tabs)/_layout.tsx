import { Tabs } from 'expo-router';
import { Home, Clock, Car, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        headerShown: false,
        tabBarStyle: styles.tabBar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Home size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <Clock size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ color }) => (
            <Car size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <User size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 4,
    height: 60,
  }
});