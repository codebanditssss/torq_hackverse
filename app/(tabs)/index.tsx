import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { ServiceCard } from '@/components/ServiceCard';
import { VehicleCard } from '@/components/VehicleCard';
import { Button } from '@/components/Button';
import { ChatBot } from '@/components/ChatBot';
import { useAuthStore } from '@/store/auth-store';
import { useVehicleStore } from '@/store/vehicle-store';
import { useServiceStore } from '@/store/service-store';
import { SERVICES } from '@/constants/services';
import { 
  Bell, 
  MapPin,
  AlertTriangle,
  MessageSquare,
  ChevronRight
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { vehicles, getDefaultVehicle } = useVehicleStore();
  const { activeRequest } = useServiceStore();
  
  const [location, setLocation] = useState('Detecting location...');
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeCategory, setActiveCategory] = useState('emergency');
  
  // Delhi locations
  const delhiLocations = [
    'Sector-54, Gurugram'
  ];
  
  useEffect(() => {
    // Simulate location detection with random Delhi location
    setTimeout(() => {
      const randomLocation = delhiLocations[Math.floor(Math.random() * delhiLocations.length)];
      setLocation(randomLocation);
    }, 1500);
  }, []);
  
  const defaultVehicle = getDefaultVehicle();
  
  const handleServicePress = (serviceType) => {
    if (!defaultVehicle) {
      Alert.alert(
        'No Vehicle Found',
        'Please add a vehicle before requesting service.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Vehicle', onPress: () => router.push('/vehicles/add') }
        ]
      );
      return;
    }
    
    router.push(`/services/${serviceType}`);
  };
  
  const handleActiveRequestPress = () => {
    router.push('/services/tracking');
  };
  
  const handleSOSPress = () => {
    Alert.alert(
      'Emergency SOS',
      'This will contact emergency services. Do you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Emergency', 
          style: 'destructive',
          onPress: () => console.log('Emergency call initiated') 
        }
      ]
    );
  };
  
  const handleNotificationsPress = () => {
    // Fixed navigation to notifications tab
    router.push('/(tabs)/notifications');
  };
  
  const handleChatPress = () => {
    setShowChatbot(true);
  };

  const handleViewAllPress = () => {
    router.push(`/services/category/${activeCategory}`);
  };
  
  const filteredServices = SERVICES.filter(service => service.category === activeCategory);
  
  const renderCategoryTabs = () => (
    <View style={styles.categoryTabs}>
      <TouchableOpacity 
        style={[
          styles.categoryTab, 
          activeCategory === 'emergency' && styles.categoryTabActive
        ]}
        onPress={() => setActiveCategory('emergency')}
      >
        <Text style={[
          styles.categoryTabText,
          activeCategory === 'emergency' && styles.categoryTabTextActive
        ]}>Emergency</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.categoryTab, 
          activeCategory === 'fitment' && styles.categoryTabActive
        ]}
        onPress={() => setActiveCategory('fitment')}
      >
        <Text style={[
          styles.categoryTabText,
          activeCategory === 'fitment' && styles.categoryTabTextActive
        ]}>Fitment</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.categoryTab, 
          activeCategory === 'repair' && styles.categoryTabActive
        ]}
        onPress={() => setActiveCategory('repair')}
      >
        <Text style={[
          styles.categoryTabText,
          activeCategory === 'repair' && styles.categoryTabTextActive
        ]}>Repair</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotificationsPress}
        >
          <Bell size={24} color={colors.dark} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {activeRequest && (
          <TouchableOpacity 
            style={styles.activeRequestCard}
            onPress={handleActiveRequestPress}
          >
            <View style={styles.activeRequestContent}>
              <View style={styles.activeRequestIcon}>
                <AlertTriangle size={24} color={colors.white} />
              </View>
              <View>
                <Text style={styles.activeRequestTitle}>Active Request</Text>
                <Text style={styles.activeRequestDescription}>
                  {activeRequest.serviceType === 'fuel' ? 'Fuel Delivery' : 
                   activeRequest.serviceType === 'battery' ? 'Battery Jump Start' :
                   activeRequest.serviceType === 'tire' ? 'Flat Tire Assistance' :
                   activeRequest.serviceType === 'tow' ? 'Towing Service' :
                   activeRequest.serviceType === 'lockout' ? 'Lockout Assistance' :
                   activeRequest.serviceType === 'dashcam' ? 'Dashcam Installation' :
                   activeRequest.serviceType === 'multimedia' ? 'Multimedia System' :
                   activeRequest.serviceType === 'fitment' ? 'Vehicle Upgrade' :
                   activeRequest.serviceType === 'inspection' ? 'Car Inspection' :
                   activeRequest.serviceType === 'bike_service' ? 'Bike Express Service' :
                   'Service'} in progress
                </Text>
              </View>
            </View>
            <Text style={styles.activeRequestStatus}>
              {activeRequest.status === 'pending' ? 'Finding provider...' : 
               activeRequest.status === 'accepted' ? 'Provider on the way' :
               'In progress'}
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.sosContainer}>
          <Button
            title="SOS Emergency"
            variant="danger"
            size="large"
            style={styles.sosButton}
            onPress={handleSOSPress}
          />
        </View>
        
        {renderCategoryTabs()}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'emergency' ? 'Emergency Services' : 
             activeCategory === 'fitment' ? 'Fitment Services' : 
             'Repair Services'}
          </Text>
          <TouchableOpacity onPress={handleViewAllPress}>
            <View style={styles.viewAllContainer}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
        
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.type}
            type={service.type}
            title={service.title}
            description={service.description}
            price={service.basePrice}
            isSchedulable={activeCategory !== 'emergency'}
            onPress={() => handleServicePress(service.type)}
          />
        ))}
        
        <Text style={styles.sectionTitle}>Your Vehicle</Text>
        
        {defaultVehicle ? (
          <VehicleCard
            vehicle={defaultVehicle}
            onSelect={() => router.push('/vehicles')}
            onEdit={() => router.push(`/vehicles/edit/${defaultVehicle.id}`)}
          />
        ) : (
          <View style={styles.noVehicleContainer}>
            <View style={styles.noVehicleImagePlaceholder}>
              <Text style={styles.placeholderText}>🚗</Text>
            </View>
            <Text style={styles.noVehicleText}>No vehicles added yet</Text>
            <Button
              title="Add Vehicle"
              onPress={() => router.push('/vehicles/add')}
              style={styles.addVehicleButton}
            />
          </View>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={handleChatPress}
      >
        <MessageSquare size={24} color={colors.white} />
      </TouchableOpacity>
      
      <Modal
        visible={showChatbot}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowChatbot(false)}
      >
        <ChatBot onClose={() => setShowChatbot(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 4,
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  activeRequestCard: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  activeRequestContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeRequestIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeRequestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  activeRequestDescription: {
    fontSize: 14,
    color: colors.gray,
  },
  activeRequestStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  sosContainer: {
    marginBottom: 24,
  },
  sosButton: {
    width: '100%',
  },
  categoryTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 4,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  categoryTabActive: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryTabText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
    marginTop: 8,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  noVehicleContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginVertical: 8,
  },
  noVehicleImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 48,
  },
  noVehicleText: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 16,
  },
  addVehicleButton: {
    minWidth: 150,
  },
  spacer: {
    height: 100,
  },
  chatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});