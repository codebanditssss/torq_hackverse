import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useServiceStore } from '@/store/service-store';
import { 
  Droplet, 
  Battery, 
  Truck, 
  Key, 
  Wrench,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Music,
  Settings,
  Gauge
} from 'lucide-react-native';
import type { ServiceRequest } from '@/types';

export default function HistoryScreen() {
  const router = useRouter();
  const { pastRequests } = useServiceStore();
  
  const getServiceIcon = (type: string) => {
    switch (type) {
      // Emergency services
      case 'fuel':
        return <Droplet size={20} color={colors.secondary} />;
      case 'battery':
        return <Battery size={20} color={colors.secondary} />;
      case 'tire':
        return <Truck size={20} color={colors.secondary} />;
      case 'tow':
        return <Truck size={20} color={colors.secondary} />;
      case 'lockout':
        return <Key size={20} color={colors.secondary} />;
      // Repair services  
      case 'repair':
        return <Wrench size={20} color={colors.secondary} />;
      case 'inspection':
        return <Gauge size={20} color={colors.secondary} />;
      // Fitment services
      case 'multimedia':
        return <Music size={20} color={colors.secondary} />;
      case 'fitment':
        return <Settings size={20} color={colors.secondary} />;
      default:
        return <AlertCircle size={20} color={colors.secondary} />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={colors.success} />;
      case 'cancelled':
        return <XCircle size={20} color={colors.danger} />;
      case 'in_progress':
        return <Clock size={20} color={colors.primary} />;
      default:
        return <Clock size={20} color={colors.gray} />;
    }
  };
  
  const getServiceTitle = (type: string) => {
    switch (type) {
      // Emergency services
      case 'fuel': return 'Fuel Delivery';
      case 'battery': return 'Battery Jump Start';
      case 'tire': return 'Flat Tire Assistance';
      case 'tow': return 'Towing Service';
      case 'lockout': return 'Lockout Assistance';
      // Repair services
      case 'repair': return 'Vehicle Repair';
      case 'inspection': return 'Vehicle Inspection';
      case 'bike_service': return 'Bike Service';
      // Fitment services
      case 'multimedia': return 'Multimedia System';
      case 'fitment': return 'Vehicle Upgrade';
      case 'dashcam': return 'Dashcam Installation';
      default: return 'Service Request';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleRequestPress = (request: ServiceRequest) => {
    if (request.status === 'in_progress') {
      router.push('/services/tracking');
    } else {
      router.push({
        pathname: '/services/[type]',
        params: { type: request.serviceType }
      });
    }
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <AlertCircle size={64} color={colors.gray} />
      <Text style={styles.emptyTitle}>No history yet</Text>
      <Text style={styles.emptyDescription}>
        Your service request history will appear here
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service History</Text>
      </View>
      
      <FlatList
        data={pastRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.requestCard}
            onPress={() => handleRequestPress(item)}
          >
            <View style={styles.requestHeader}>
              <View style={styles.serviceInfo}>
                {getServiceIcon(item.serviceType)}
                <Text style={styles.serviceTitle}>
                  {getServiceTitle(item.serviceType)}
                </Text>
              </View>
              {getStatusIcon(item.status)}
            </View>
            
            <View style={styles.requestDetails}>
              <Text style={styles.requestDate}>
                {formatDate(item.createdAt)}
              </Text>
              <Text style={styles.requestId}>
                ID: {item.id.slice(0, 8)}
              </Text>
              {item.price && (
                <Text style={styles.price}>
                  ₹{item.price.toLocaleString()}
                </Text>
              )}
            </View>
            
            <View style={styles.requestFooter}>
              <Text 
                style={[
                  styles.requestStatus,
                  item.status === 'completed' && styles.completedStatus,
                  item.status === 'cancelled' && styles.cancelledStatus,
                  item.status === 'in_progress' && styles.inProgressStatus
                ]}
              >
                {item.status.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              
              {item.status === 'completed' && (
                <TouchableOpacity 
                  style={styles.reviewButton}
                  onPress={() => router.push('/profile/reviews')}
                >
                  <Text style={styles.reviewButtonText}>Leave Review</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  requestCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: 8,
  },
  requestDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  requestDate: {
    fontSize: 14,
    color: colors.gray,
  },
  requestId: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 12,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  requestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    textTransform: 'capitalize',
  },
  completedStatus: {
    color: colors.success,
  },
  cancelledStatus: {
    color: colors.danger,
  },
  inProgressStatus: {
    color: colors.primary,
  },
  reviewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reviewButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
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
  },
});