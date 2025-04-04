import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Card } from './Card';

interface TouchableCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
  onPress: () => void;
}

export const TouchableCard: React.FC<TouchableCardProps> = ({ 
  children, 
  style,
  elevation,
  onPress
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Card style={style} elevation={elevation}>
        {children}
      </Card>
    </TouchableOpacity>
  );
};
