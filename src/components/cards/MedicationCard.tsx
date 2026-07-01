// 1. IMPORTS
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { DashboardMedication } from '../../hooks/usePatientDashboard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

// 2. TYPES
export interface MedicationCardProps {
  medication: DashboardMedication | null;
  onPress?: () => void;
}

const statusConfig: Record<
  DashboardMedication['status'],
  { variant: 'info' | 'success' | 'danger'; label: string }
> = {
  upcoming: { variant: 'info', label: 'Upcoming' },
  taken: { variant: 'success', label: 'Taken' },
  missed: { variant: 'danger', label: 'Missed' },
};

// 3. COMPONENT
export const MedicationCard = ({ medication, onPress }: MedicationCardProps): React.JSX.Element => {
  if (!medication) {
    return (
      <Card accessibilityLabel="No active medications">
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="pill" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>No active medications</Text>
          <Text style={styles.emptySubtitle}>Your prescriptions will appear here.</Text>
        </View>
      </Card>
    );
  }

  const config = statusConfig[medication.status];

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`Next medication: ${medication.name}, ${medication.dosage}, scheduled at ${medication.scheduledTime}, status ${config.label}`}
    >
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Next Medication</Text>
        <Badge label={config.label} variant={config.variant} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="pill" size={24} color={Colors.secondary} />
        </View>
        <View style={styles.details}>
          <Text style={styles.medicineName}>{medication.name}</Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.time}>{medication.scheduledTime}</Text>
      </View>
    </Card>
  );
};

// 4. STYLES
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
  },
  medicineName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  dosage: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
  },
  time: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  emptyTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
