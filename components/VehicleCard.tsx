import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Vehicle } from '@/types';
import { Check, Pencil } from 'lucide-react-native';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: () => void;
  onEdit?: () => void;
  selected?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  onEdit,
  selected = false
}) => {
  const getFuelTypeLabel = (type: string) => {
    switch (type) {
      case 'petrol': return 'Petrol';
      case 'diesel': return 'Diesel';
      case 'electric': return 'Electric';
      case 'cng': return 'CNG';
      default: return type;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        selected && styles.selectedCard
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
          {vehicle.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        
        <View style={styles.details}>
          <Text style={styles.detailText}>
            {vehicle.year} • {vehicle.color} • {getFuelTypeLabel(vehicle.fuelType)}
          </Text>
          <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        {selected && (
          <View style={styles.checkIcon}>
            <Check size={20} color={colors.white} />
          </View>
        )}
        
        {onEdit && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={onEdit}
          >
            <Pencil size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  details: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray,
  },
  licensePlate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
  },
});