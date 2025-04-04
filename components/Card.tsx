import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  elevation = 2
}) => {
  return (
    <View style={[
      styles.card, 
      { 
        shadowOpacity: 0.1 * elevation,
        elevation: elevation
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginVertical: 8,
  },
});