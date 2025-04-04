import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { colors } from '@/constants/colors';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            props.multiline && styles.multilineInput
          ]}
          placeholderTextColor={colors.gray}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {secureTextEntry ? (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? 
              <EyeOff size={20} color={colors.gray} /> : 
              <Eye size={20} color={colors.gray} />
            }
          </TouchableOpacity>
        ) : rightIcon && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.dark,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark,
  },
  multilineInput: {
    height: 'auto',
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  error: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});