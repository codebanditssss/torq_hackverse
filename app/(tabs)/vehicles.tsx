import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { VehicleCard } from '@/components/VehicleCard';
import { useVehicleStore } from '@/store/vehicle-store';
import { 
  Plus,
  Car,
  AlertCircle
} from 'lucide-react-native';

export default function VehiclesScreen() {
  const router = useRouter();
  const { vehicles, deleteVehicle, setDefaultVehicle } = useVehicleStore();
  
  const handleAddVehicle = () => {
    router.push('/vehicles/add');
  };
  
  const handleEditVehicle = (id: string) => {
    router.push(`/vehicles/edit/${id}`);
  };
  
  const handleDeleteVehicle = (id: string) => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteVehicle(id)
        }
      ]
    );
  };
  
  const handleSetDefault = (id: string) => {
    setDefaultVehicle(id);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Car size={64} color={colors.lightGray} />
      <Text style={styles.emptyTitle}>No vehicles added</Text>
      <Text style={styles.emptyDescription}>
        Add your vehicles to quickly request services
      </Text>
      <Button
        title="Add Vehicle"
        onPress={handleAddVehicle}
        style={styles.addButton}
        leftIcon={<Plus size={18} color={colors.white} />}
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Vehicles</Text>
        <TouchableOpacity 
          style={styles.addButtonSmall}
          onPress={handleAddVehicle}
        >
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <View style={styles.vehicleCardContainer}>
            <VehicleCard
              vehicle={item}
              onEdit={() => handleEditVehicle(item.id)}
            />
            
            <View style={styles.vehicleActions}>
              {!item.isDefault && (
                <Button
                  title="Set as Default"
                  variant="outline"
                  size="small"
                  onPress={() => handleSetDefault(item.id)}
                  style={styles.actionButton}
                />
              )}
              
              <Button
                title="Delete"
                variant="danger"
                size="small"
                onPress={() => handleDeleteVehicle(item.id)}
                style={styles.actionButton}
              />
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  vehicleCardContainer: {
    marginBottom: 16,
  },
  vehicleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    minWidth: 120,
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
    marginBottom: 24,
  },
  addButton: {
    minWidth: 150,
  },
});