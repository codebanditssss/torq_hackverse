import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { ChevronLeft, Bell } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showNotifications = false,
  onBackPress,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={24} color={colors.dark} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {showNotifications && (
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotificationsPress}
        >
          <Bell size={24} color={colors.dark} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
});