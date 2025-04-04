import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Tag, 
  Clock,
  Truck,
  Droplet,
  Battery,
  Key
} from 'lucide-react-native';
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'service_update':
        switch (notification.serviceType) {
          case 'fuel':
            return <Droplet size={24} color={colors.secondary} />;
          case 'battery':
            return <Battery size={24} color={colors.secondary} />;
          case 'tire':
            return <Truck size={24} color={colors.secondary} />;
          case 'tow':
            return <Truck size={24} color={colors.secondary} />;
          case 'lockout':
            return <Key size={24} color={colors.secondary} />;
          default:
            return <Truck size={24} color={colors.secondary} />;
        }
      case 'alert':
        return <AlertTriangle size={24} color={colors.danger} />;
      case 'promotion':
        return <Tag size={24} color={colors.success} />;
      case 'system':
        return <Info size={24} color={colors.info} />;
      case 'payment':
        return <CheckCircle size={24} color={colors.success} />;
      case 'reminder':
        return <Clock size={24} color={colors.warning} />;
      default:
        return <Bell size={24} color={colors.primary} />;
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMilliseconds = now.getTime() - notificationTime.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day ago`;
    } else {
      return notificationTime.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.read && styles.unreadContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{formatTime(notification.timestamp)}</Text>
      </View>
      
      {!notification.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadContainer: {
    backgroundColor: colors.light,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: colors.gray,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});