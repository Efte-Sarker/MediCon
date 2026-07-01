import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Shadows } from '@theme';
import { Feather } from '@expo/vector-icons';
import type { ProtocolStep } from '../../services/protocols/emergency-protocols.data';

export interface EmergencyStepCardProps {
  step: ProtocolStep;
  stepIndex: number;
  totalSteps: number;
}

export const EmergencyStepCard = ({
  step,
  stepIndex,
  totalSteps,
}: EmergencyStepCardProps): React.JSX.Element => {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Step ${stepIndex} of ${totalSteps}: ${step.instruction}${
        step.warning ? `. Warning: ${step.warning}` : ''
      }`}
    >
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{stepIndex}</Text>
        </View>
        <Text
          style={styles.instruction}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          {step.instruction}
        </Text>
      </View>

      {step.warning && (
        <View
          style={styles.warningContainer}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          <Feather name="alert-circle" color={Colors.danger} size={20} />
          <Text style={styles.warningText}>{step.warning}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numberText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  instruction: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginTop: 4, // Align text baseline somewhat with the badge
  },
  warningContainer: {
    marginTop: Spacing.base,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  warningText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.danger,
    lineHeight: 20,
  },
});
