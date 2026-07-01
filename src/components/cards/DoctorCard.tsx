// 1. IMPORTS
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontFamily, FontSize } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { DashboardDoctor } from '../../hooks/usePatientDashboard';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';

// 2. TYPES
export interface DoctorCardProps {
  doctor: DashboardDoctor | null;
  onPress?: () => void;
}

// 3. COMPONENT
export const DoctorCard = ({ doctor, onPress }: DoctorCardProps): React.JSX.Element => {
  if (!doctor) {
    return (
      <Card accessibilityLabel="No recent doctors">
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="stethoscope" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>No recent doctors</Text>
          <Text style={styles.emptySubtitle}>Explore the directory to find a doctor.</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`Recent doctor: ${doctor.name}, ${doctor.specialty}, rated ${doctor.rating} out of 5, ${doctor.experience} experience`}
    >
      <Text style={styles.sectionLabel}>Recent Doctor</Text>

      <View style={styles.body}>
        <Avatar name={doctor.name} size={48} />
        <View style={styles.details}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <MaterialCommunityIcons name="star" size={16} color="#f5a623" />
          <Text style={styles.statText}>{doctor.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <MaterialCommunityIcons name="briefcase-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.statText}>{doctor.experience}</Text>
        </View>
      </View>
    </Card>
  );
};

// 4. STYLES
const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  details: {
    flex: 1,
  },
  doctorName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  specialty: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.tertiary,
    marginHorizontal: Spacing.md,
  },
  statText: {
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
