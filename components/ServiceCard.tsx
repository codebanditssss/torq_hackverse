import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { ServiceType } from '@/types';
import { 
  Droplet, 
  Battery, 
  Truck, 
  Key, 
  Wrench,
  AlertCircle,
  Video,
  Music,
  Settings,
  ClipboardCheck,
  Tool
} from 'lucide-react-native';

interface ServiceCardProps {
  type: ServiceType;
  title: string;
  description: string;
  onPress: () => void;
  price?: number;
  isSchedulable?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  type,
  title,
  description,
  onPress,
  price,
  isSchedulable
}) => {
  const renderIcon = () => {
    switch (type) {
      case 'fuel':
        return <Droplet size={28} color={colors.secondary} />;
      case 'battery':
        return <Battery size={28} color={colors.secondary} />;
      case 'tire':
        return <Truck size={28} color={colors.secondary} />;
      case 'tow':
        return <Truck size={28} color={colors.secondary} />;
      case 'lockout':
        return <Key size={28} color={colors.secondary} />;
      case 'dashcam':
        return <Video size={28} color={colors.secondary} />;
      case 'multimedia':
        return <Music size={28} color={colors.secondary} />;
      case 'fitment':
        return <Settings size={28} color={colors.secondary} />;
      case 'inspection':
        return <ClipboardCheck size={28} color={colors.secondary} />;
      case 'bike_service':
        return <Tool size={28} color={colors.secondary} />;
      case 'other':
        return <Wrench size={28} color={colors.secondary} />;
      default:
        return <AlertCircle size={28} color={colors.secondary} />;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        {price && (
          <Text style={styles.price}>From ₹{price}</Text>
        )}
        
        {isSchedulable && (
          <View style={styles.scheduleBadge}>
            <Text style={styles.scheduleBadgeText}>Schedulable</Text>
          </View>
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
  description: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  scheduleBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scheduleBadgeText: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '500',
  }
});