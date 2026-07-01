// 1. IMPORTS
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { DashboardAppointment } from '../../hooks/usePatientDashboard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

// 2. TYPES
export interface AppointmentCardProps {
  appointment: DashboardAppointment | null;
  onPress?: () => void;
}

// 3. COMPONENT
export const AppointmentCard = ({
  appointment,
  onPress,
}: AppointmentCardProps): React.JSX.Element => {
  if (!appointment) {
    return (
      <Card accessibilityLabel="No upcoming appointments">
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={32}
            color={Colors.textTertiary}
          />
          <Text style={styles.emptyTitle}>No upcoming appointments</Text>
          <Text style={styles.emptySubtitle}>Book a consultation to get started.</Text>
        </View>
      </Card>
    );
  }

  const date = new Date(appointment.dateTime);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const isVideo = appointment.format === 'video';

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`Next appointment with ${appointment.doctorName}, ${appointment.specialty}, ${formattedDate} at ${formattedTime}, ${appointment.format}`}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionLabel}>Next Appointment</Text>
        </View>
        <Badge label={isVideo ? 'Video' : 'In-person'} variant={isVideo ? 'info' : 'success'} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={isVideo ? 'video-outline' : 'hospital-building'}
            size={24}
            color={Colors.primary}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          <Text style={styles.specialty}>{appointment.specialty}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.dateTime}>
          {formattedDate} · {formattedTime}
        </Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    gap: Spacing.xs,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
  },
  dateTime: {
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
