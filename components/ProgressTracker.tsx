import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface Step {
  label: string;
  completed: boolean;
  current: boolean;
}

interface ProgressTrackerProps {
  steps: Step[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <View style={styles.stepContainer}>
            <View 
              style={[
                styles.stepCircle,
                step.completed && styles.completedCircle,
                step.current && styles.currentCircle
              ]}
            >
              {step.completed && (
                <View style={styles.completedDot} />
              )}
            </View>
            <Text 
              style={[
                styles.stepLabel,
                (step.completed || step.current) && styles.activeLabel
              ]}
            >
              {step.label}
            </Text>
          </View>
          
          {index < steps.length - 1 && (
            <View 
              style={[
                styles.connector,
                step.completed && styles.completedConnector
              ]} 
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedCircle: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  currentCircle: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  completedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    maxWidth: 80,
  },
  activeLabel: {
    color: colors.dark,
    fontWeight: '500',
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.lightGray,
    marginHorizontal: 4,
  },
  completedConnector: {
    backgroundColor: colors.primary,
  },
});