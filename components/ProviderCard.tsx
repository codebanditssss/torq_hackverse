import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { ServiceProvider } from '@/types';
import { Star, Clock } from 'lucide-react-native';

interface ProviderCardProps {
  provider: ServiceProvider;
  onSelect: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onSelect
}) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.providerImagePlaceholder}>
        <Text style={styles.providerInitials}>
          {provider.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{provider.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={colors.secondary} fill={colors.secondary} />
          <Text style={styles.rating}>
            {provider.rating.toFixed(1)} ({provider.totalRatings})
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{provider.distance} km</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ETA</Text>
            <View style={styles.etaContainer}>
              <Clock size={14} color={colors.primary} />
              <Text style={styles.infoValue}>{provider.estimatedTime} min</Text>
            </View>
          </View>
        </View>
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
  },
  providerImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  providerInitials: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});