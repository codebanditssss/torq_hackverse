import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { NotificationItem } from '@/components/NotificationItem';
import { useNotificationStore } from '@/store/notification-store';
import { Bell, CheckCheck, Trash2 } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    markAllAsRead, 
    markAsRead, 
    clearAllNotifications,
    isLoading
  } = useNotificationStore();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.read);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const handleNotificationPress = (id: string) => {
    markAsRead(id);
    
    // Find the notification
    const notification = notifications.find(n => n.id === id);
    
    if (notification) {
      // Navigate based on notification type
      switch (notification.type) {
        case 'service_update':
          router.push('/services/tracking');
          break;
        case 'payment':
          router.push('/profile/payment-methods');
          break;
        case 'promotion':
          // Handle promotion notification
          Alert.alert('Promotion', notification.message);
          break;
        default:
          // Just mark as read for other types
          break;
      }
    }
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearAllNotifications
        }
      ]
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Bell size={64} color={colors.lightGray} />
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptyDescription}>
        {filter === 'all' 
          ? "You don't have any notifications yet" 
          : "You don't have any unread notifications"}
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" showBackButton={true} />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('all')}
        >
          <Text 
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filter === 'unread' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text 
            style={[
              styles.filterText,
              filter === 'unread' && styles.filterTextActive
            ]}
          >
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {notifications.length > 0 && (
        <View style={styles.actionsContainer}>
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleMarkAllAsRead}
            >
              <CheckCheck size={16} color={colors.primary} />
              <Text style={styles.actionText}>Mark all as read</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleClearAll}
          >
            <Trash2 size={16} color={colors.danger} />
            <Text style={[styles.actionText, styles.clearText]}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary + '20',
  },
  filterText: {
    fontSize: 14,
    color: colors.gray,
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  clearText: {
    color: colors.danger,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    maxWidth: '80%',
  },
});