import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { ServiceCard } from '@/components/ServiceCard';
import { SERVICES } from '@/constants/services';
import { useVehicleStore } from '@/store/vehicle-store';
import { ServiceCategory } from '@/types';

export default function ServiceCategoryScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { getDefaultVehicle } = useVehicleStore();
  
  const defaultVehicle = getDefaultVehicle();
  
  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'emergency': return 'Emergency Services';
      case 'fitment': return 'Fitment Services';
      case 'repair': return 'Repair Services';
      default: return 'Services';
    }
  };
  
  const filteredServices = SERVICES.filter(
    service => service.category === (category as ServiceCategory)
  );
  
  const handleServicePress = (serviceType: string) => {
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
  
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={getCategoryTitle(category as string)} 
        showBackButton={true}
        showNotifications={true}
      />
      
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.type}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ServiceCard
            key={item.type}
            type={item.type}
            title={item.title}
            description={item.description}
            price={item.basePrice}
            isSchedulable={item.category !== 'emergency'}
            onPress={() => handleServicePress(item.type)}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.description}>
              {category === 'emergency' 
                ? 'Get immediate assistance for your vehicle emergencies.'
                : category === 'fitment'
                ? 'Professional installation services for your vehicle upgrades.'
                : 'Expert repair and maintenance services for your vehicle.'}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services available in this category</Text>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 22,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
});