import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useServiceStore } from '@/store/service-store';
import { 
  Droplet, 
  Battery, 
  Truck, 
  Key, 
  Wrench,
  AlertCircle,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle,
  Video,
  Music,
  Settings,
  ClipboardCheck,
  Tool
} from 'lucide-react-native';

export default function TrackingScreen() {
  const router = useRouter();
  const { activeRequest, updateServiceRequest, cancelServiceRequest, completeServiceRequest } = useServiceStore();
  
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  
  useEffect(() => {
    if (!activeRequest) {
      router.replace('/');
      return;
    }
    
    // Calculate time remaining if we have an estimated arrival
    if (activeRequest.estimatedArrival) {
      const arrivalTime = new Date(activeRequest.estimatedArrival).getTime();
      const currentTime = new Date().getTime();
      const initialTimeRemaining = Math.max(0, Math.floor((arrivalTime - currentTime) / 60000));
      
      setTimeRemaining(initialTimeRemaining);
      
      // Update progress based on time remaining
      const totalTime = 15; // Assuming 15 minutes total time
      setProgress(Math.min(1, 1 - (initialTimeRemaining / totalTime)));
      
      // Update time remaining every minute
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newValue = Math.max(0, prev - 1);
          setProgress(Math.min(1, 1 - (newValue / totalTime)));
          return newValue;
        });
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [activeRequest]);
  
  // Simulate status updates
  useEffect(() => {
    if (activeRequest?.status === 'accepted') {
      const timeout = setTimeout(() => {
        updateServiceRequest(activeRequest.id, { status: 'in_progress' });
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [activeRequest]);
  
  if (!activeRequest) {
    return null;
  }
  
  const getServiceIcon = (type: string) => {
    switch (type) {
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
      case 'dashcam':
        return <Video size={24} color={colors.secondary} />;
      case 'multimedia':
        return <Music size={24} color={colors.secondary} />;
      case 'fitment':
        return <Settings size={24} color={colors.secondary} />;
      case 'inspection':
        return <ClipboardCheck size={24} color={colors.secondary} />;
      case 'bike_service':
        return <Tool size={24} color={colors.secondary} />;
      case 'other':
        return <Wrench size={24} color={colors.secondary} />;
      default:
        return <AlertCircle size={24} color={colors.secondary} />;
    }
  };
  
  const getServiceTitle = (type: string) => {
    switch (type) {
      case 'fuel': return 'Fuel Delivery';
      case 'battery': return 'Battery Jump Start';
      case 'tire': return 'Flat Tire Assistance';
      case 'tow': return 'Towing Service';
      case 'lockout': return 'Lockout Assistance';
      case 'dashcam': return 'Dashcam Installation';
      case 'multimedia': return 'Multimedia System';
      case 'fitment': return 'Vehicle Upgrade';
      case 'inspection': return 'Car Inspection';
      case 'bike_service': return 'Bike Express Service';
      case 'other': return 'Other Service';
      default: return 'Service Request';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Finding service provider...';
      case 'accepted': return 'Provider is on the way';
      case 'in_progress': return 'Service in progress';
      case 'completed': return 'Service completed';
      case 'cancelled': return 'Service cancelled';
      default: return 'Unknown status';
    }
  };
  
  const handleCancel = () => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this service request?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            cancelServiceRequest(activeRequest.id);
            router.replace('/');
          }
        }
      ]
    );
  };
  
  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
  };
  
  const handleMessage = () => {
    Alert.alert('Message', 'Messaging functionality will be implemented soon');
  };
  
  const handleComplete = () => {
    Alert.alert(
      'Complete Request',
      'Confirm that the service has been completed?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Complete', 
          onPress: () => {
            completeServiceRequest(activeRequest.id);
            router.replace('/');
          }
        }
      ]
    );
  };
  
  const isScheduledService = !!activeRequest.scheduledFor;
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Service Tracking" showBackButton={false} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.statusContainer}>
          <View style={styles.statusHeader}>
            {getServiceIcon(activeRequest.serviceType)}
            <View style={styles.statusInfo}>
              <Text style={styles.serviceTitle}>
                {getServiceTitle(activeRequest.serviceType)}
              </Text>
              <Text style={styles.statusText}>
                {isScheduledService ? 'Scheduled Service' : getStatusText(activeRequest.status)}
              </Text>
            </View>
          </View>
          
          {isScheduledService ? (
            <View style={styles.scheduledContainer}>
              <Clock size={16} color={colors.primary} />
              <Text style={styles.scheduledText}>
                Scheduled for {new Date(activeRequest.scheduledFor!).toLocaleString()}
              </Text>
            </View>
          ) : (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${progress * 100}%` }
                  ]} 
                />
              </View>
              
              {activeRequest.status === 'accepted' && (
                <View style={styles.timeContainer}>
                  <Clock size={16} color={colors.primary} />
                  <Text style={styles.timeText}>
                    {timeRemaining > 0 ? `${timeRemaining} min remaining` : 'Arriving soon'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        {activeRequest.status === 'in_progress' && (
          <Card style={styles.serviceInProgressCard}>
            <View style={styles.serviceInProgressHeader}>
              <CheckCircle size={24} color={colors.success} />
              <Text style={styles.serviceInProgressTitle}>Service in Progress</Text>
            </View>
            <Text style={styles.serviceInProgressText}>
              Your service provider has arrived and is working on your request.
            </Text>
            <Button
              title="Mark as Completed"
              variant="success"
              onPress={handleComplete}
              style={styles.completeButton}
            />
          </Card>
        )}
        
        <Card style={styles.locationCard}>
          <Text style={styles.cardTitle}>Service Location</Text>
          <View style={styles.locationContent}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.locationText}>{activeRequest.location.address || 'Current Location'}</Text>
          </View>
          
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayText}>Map View</Text>
            </View>
          </View>
        </Card>
        
        {activeRequest.status !== 'pending' && !isScheduledService && (
          <Card style={styles.providerCard}>
            <Text style={styles.cardTitle}>Service Provider</Text>
            <View style={styles.providerContent}>
              <View style={styles.providerImagePlaceholder}>
                <Text style={styles.providerInitials}>
                  {activeRequest.serviceType === 'fuel' || activeRequest.serviceType === 'battery' ? 'QF' :
                   activeRequest.serviceType === 'dashcam' || activeRequest.serviceType === 'multimedia' || activeRequest.serviceType === 'fitment' ? 'AF' :
                   activeRequest.serviceType === 'inspection' || activeRequest.serviceType === 'bike_service' ? 'MM' : 'RA'}
                </Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>
                  {activeRequest.serviceType === 'fuel' || activeRequest.serviceType === 'battery' ? 'Quick Fuel Services' :
                   activeRequest.serviceType === 'dashcam' || activeRequest.serviceType === 'multimedia' || activeRequest.serviceType === 'fitment' ? 'Auto Fitment Experts' :
                   activeRequest.serviceType === 'inspection' || activeRequest.serviceType === 'bike_service' ? 'Mobile Mechanics' : 'Roadside Assistance Pro'}
                </Text>
                <Text style={styles.providerSubtext}>
                  {activeRequest.serviceType === 'fuel' ? 'Professional Fuel Delivery' :
                   activeRequest.serviceType === 'battery' ? 'Battery Specialists' :
                   activeRequest.serviceType === 'dashcam' || activeRequest.serviceType === 'multimedia' ? 'Professional Installation' :
                   activeRequest.serviceType === 'fitment' ? 'Vehicle Upgrade Experts' :
                   activeRequest.serviceType === 'inspection' ? 'Certified Inspectors' :
                   activeRequest.serviceType === 'bike_service' ? 'Bike Service Specialists' :
                   'Professional Assistance'}
                </Text>
                <View style={styles.providerRating}>
                  <Text style={styles.ratingText}>
                    {activeRequest.serviceType === 'fuel' || activeRequest.serviceType === 'battery' ? '4.8' :
                     activeRequest.serviceType === 'dashcam' || activeRequest.serviceType === 'multimedia' || activeRequest.serviceType === 'fitment' ? '4.7' :
                     activeRequest.serviceType === 'inspection' || activeRequest.serviceType === 'bike_service' ? '4.9' : '4.6'}
                  </Text>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <View 
                        key={star}
                        style={[
                          styles.star,
                          star <= 4 ? styles.starFilled : styles.starEmpty
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={handleCall}
              >
                <Phone size={20} color={colors.primary} />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={handleMessage}
              >
                <MessageSquare size={20} color={colors.primary} />
                <Text style={styles.contactButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        
        <Card style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Request Details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Request ID</Text>
            <Text style={styles.detailValue}>{activeRequest.id.slice(0, 8)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Service Type</Text>
            <Text style={styles.detailValue}>{getServiceTitle(activeRequest.serviceType)}</Text>
          </View>
          
          {activeRequest.serviceType === 'fuel' && (
            <>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Fuel Type</Text>
                <Text style={styles.detailValue}>
                  {(activeRequest as any).fuelType?.charAt(0).toUpperCase() + (activeRequest as any).fuelType?.slice(1)}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>{(activeRequest as any).quantity}L</Text>
              </View>
            </>
          )}
          
          {(activeRequest.serviceType === 'dashcam' || activeRequest.serviceType === 'multimedia' || activeRequest.serviceType === 'fitment') && (
            <>
              {(activeRequest as any).productDetails && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Product Details</Text>
                  <Text style={styles.detailValue}>{(activeRequest as any).productDetails}</Text>
                </View>
              )}
              
              {(activeRequest as any).installationType && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Installation Type</Text>
                  <Text style={styles.detailValue}>{(activeRequest as any).installationType}</Text>
                </View>
              )}
            </>
          )}
          
          {(activeRequest.serviceType === 'inspection' || activeRequest.serviceType === 'bike_service') && (
            <>
              {(activeRequest as any).vehicleIssues && (activeRequest as any).vehicleIssues.length > 0 && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Reported Issues</Text>
                  <Text style={styles.detailValue}>
                    {(activeRequest as any).vehicleIssues.join(', ')}
                  </Text>
                </View>
              )}
              
              {(activeRequest as any).preferredTime && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Preferred Time</Text>
                  <Text style={styles.detailValue}>{(activeRequest as any).preferredTime}</Text>
                </View>
              )}
            </>
          )}
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Requested At</Text>
            <Text style={styles.detailValue}>
              {new Date(activeRequest.createdAt).toLocaleString()}
            </Text>
          </View>
          
          {activeRequest.scheduledFor && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Scheduled For</Text>
              <Text style={styles.detailValue}>
                {new Date(activeRequest.scheduledFor).toLocaleString()}
              </Text>
            </View>
          )}
          
          {activeRequest.price && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Total Price</Text>
              <Text style={styles.detailValue}>₹{activeRequest.price}</Text>
            </View>
          )}
        </Card>
        
        {(activeRequest.status === 'pending' || activeRequest.status === 'accepted') && !isScheduledService && (
          <Button
            title="Cancel Request"
            variant="danger"
            onPress={handleCancel}
            style={styles.cancelButton}
          />
        )}
        
        {isScheduledService && (
          <Button
            title="Reschedule Service"
            variant="outline"
            onPress={() => Alert.alert('Reschedule', 'Rescheduling functionality will be implemented soon')}
            style={styles.rescheduleButton}
          />
        )}
        
        {isScheduledService && (
          <Button
            title="Cancel Service"
            variant="danger"
            onPress={handleCancel}
            style={styles.cancelButton}
          />
        )}
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
    padding: 16,
  },
  statusContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    marginLeft: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  timeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  scheduledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 8,
  },
  scheduledText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  serviceInProgressCard: {
    marginBottom: 16,
    backgroundColor: colors.success + '10',
  },
  serviceInProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceInProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 8,
  },
  serviceInProgressText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 16,
  },
  completeButton: {
    marginTop: 8,
  },
  locationCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
  },
  mapPlaceholder: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.lightGray,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: '600',
  },
  providerCard: {
    marginBottom: 16,
  },
  providerContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  providerImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerInitials: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
  },
  providerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  providerSubtext: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginRight: 4,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  star: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 2,
  },
  starFilled: {
    backgroundColor: colors.secondary,
  },
  starEmpty: {
    backgroundColor: colors.lightGray,
  },
  contactButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  detailsCard: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  cancelButton: {
    marginBottom: 32,
  },
  rescheduleButton: {
    marginBottom: 16,
  },
});