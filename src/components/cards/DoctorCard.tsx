// 1. IMPORTS
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontFamily, FontSize } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { DashboardDoctor } from '../../hooks/usePatientDashboard';
import type { Doctor } from '../../services/api/doctorsService';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { useTranslation } from 'react-i18next';

export interface DoctorCardProps {
  doctor: DashboardDoctor | Doctor | null;
  onPress?: () => void;
  hideSectionLabel?: boolean;
}

// 3. COMPONENT
export const DoctorCard = ({
  doctor,
  onPress,
  hideSectionLabel = false,
}: DoctorCardProps): React.JSX.Element => {
  const { t } = useTranslation();
  if (!doctor) {
    return (
      <Card accessibilityLabel="No recent doctors">
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="stethoscope" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>
            {t('doctorcard.no_recent_doctors') || 'No recent doctors'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {t('doctorcard.explore_the_directory_to_find_') ||
              'Explore the directory to find a doctor.'}
          </Text>
        </View>
      </Card>
    );
  }

  const isDashboard = 'name' in doctor;
  const displayName = isDashboard ? doctor.name : doctor.fullName;
  const displaySpecialty = isDashboard ? doctor.specialty : doctor.department;
  const isOnline = !isDashboard && 'isOnline' in doctor ? doctor.isOnline : false;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`Doctor: ${displayName}, ${displaySpecialty}, rated ${doctor.rating} out of 5`}
    >
      {!hideSectionLabel && (
        <Text style={styles.sectionLabel}>{t('doctorcard.recent_doctor') || 'Recent Doctor'}</Text>
      )}

      <View style={styles.body}>
        <View>
          <Avatar name={displayName} size={48} />
          {isOnline && <View style={styles.onlineBadge} />}
        </View>
        <View style={styles.details}>
          <Text style={styles.doctorName}>{displayName}</Text>
          <Text style={styles.specialty}>{displaySpecialty}</Text>
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
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#28a745',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
});
