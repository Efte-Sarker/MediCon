// 1. IMPORTS
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePatientDashboard } from '../../hooks/usePatientDashboard';
import { AppointmentCard } from '../cards/AppointmentCard';
import { MedicationCard } from '../cards/MedicationCard';
import { SymptomSearchBar } from '../forms/SymptomSearchBar';
import { DraggableBottomSheet } from '../ui/DraggableBottomSheet';
// 2. TYPES
/* No external props — this is a self-contained dashboard. */

// 3. COMPONENT
export const PatientDashboard = (): React.JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation();
  const { nextAppointment, nextMedicine } = usePatientDashboard();
  const [appointmentSheetVisible, setAppointmentSheetVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>MediCon</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.push('/(app)/notifications')}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessibilityLabel={t('dashboard.notifications') || 'Notifications'}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(app)/settings/')}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessibilityLabel={t('dashboard.settings') || 'Settings'}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={27.6}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <SymptomSearchBar />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SOS Button */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => router.push('/(app)/emergency/')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={
            t('dashboard.emergencyAccessibility') ||
            'Emergency SOS. Double tap to access emergency protocols.'
          }
        >
          <View style={styles.sosLeftIconWrapper}>
            <MaterialCommunityIcons
              name="alarm-light-outline"
              size={22}
              color={(Colors as any).emergency || Colors.danger}
            />
          </View>
          <View style={styles.sosTextContainer}>
            <Text style={styles.sosText}>{t('dashboard.emergencySOS') || 'Emergency SOS'}</Text>
            <Text style={styles.sosSubtitle}>Get help immediately</Text>
          </View>
          <View style={styles.sosRightIconWrapper}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.surface} />
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="flask-outline"
            label={t('dashboard.reports') || 'Reports'}
            onPress={() => router.push('/(app)/(tabs)/reports')}
          />
          <QuickAction
            icon="hospital-building"
            label={t('dashboard.hospitals') || 'Hospitals'}
            onPress={() => router.push('/(app)/(tabs)/hospitals')}
          />
          {/* 
          <QuickAction
            icon="pill"
            label={t('dashboard.meds') || 'Medicines'}
            onPress={() => router.push('/(app)/medicine')}
          />
          */}
          <QuickAction
            icon="chat-processing-outline"
            label={t('dashboard.aiChat') || 'AI Chat'}
            onPress={() => router.push('/(app)/ai-chat')}
          />
        </View>

        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          <AppointmentCard
            appointment={nextAppointment}
            onPress={() => {
              if (nextAppointment) setAppointmentSheetVisible(true);
            }}
          />
          <MedicationCard
            medication={nextMedicine}
            onPress={() => {
              if (nextMedicine?.prescriptionId) {
                router.push({
                  pathname: '/(app)/prescriptions/[id]',
                  params: { id: nextMedicine.prescriptionId },
                });
              }
            }}
          />
        </View>
      </ScrollView>

      {/* Appointment Details Bottom Sheet */}
      {nextAppointment && (
        <DraggableBottomSheet
          visible={appointmentSheetVisible}
          onClose={() => setAppointmentSheetVisible(false)}
        >
          <View style={sheetStyles.content}>
            {/* Title */}
            <Text style={sheetStyles.sheetTitle}>Appointment Details</Text>

            <View style={sheetStyles.innerContent}>
              {/* Doctor Info */}
              <View style={sheetStyles.doctorRow}>
                <View style={sheetStyles.doctorAvatar}>
                  {nextAppointment.imageUrl ? (
                    <Image
                      source={
                        typeof nextAppointment.imageUrl === 'string'
                          ? { uri: nextAppointment.imageUrl }
                          : nextAppointment.imageUrl
                      }
                      style={sheetStyles.avatarImage}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={28}
                      color={Colors.primary}
                    />
                  )}
                </View>
                <View style={sheetStyles.doctorInfo}>
                  <Text style={sheetStyles.doctorName}>{nextAppointment.doctorName}</Text>
                  <Text style={sheetStyles.doctorSpecialty}>{nextAppointment.specialty}</Text>
                </View>
              </View>

              {/* Date & Time Details */}
              <View style={sheetStyles.detailsCard}>
                <View style={sheetStyles.detailRow}>
                  <MaterialCommunityIcons
                    name="calendar-outline"
                    size={20}
                    color={Colors.primary}
                  />
                  <View style={sheetStyles.detailTextGroup}>
                    <Text style={sheetStyles.detailLabel}>Date</Text>
                    <Text style={sheetStyles.detailValue}>
                      {new Date(nextAppointment.dateTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                <View style={sheetStyles.detailDivider} />
                <View style={sheetStyles.detailRow}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.primary} />
                  <View style={sheetStyles.detailTextGroup}>
                    <Text style={sheetStyles.detailLabel}>Time</Text>
                    <Text style={sheetStyles.detailValue}>
                      {new Date(nextAppointment.dateTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Reschedule Button */}
              <TouchableOpacity
                style={sheetStyles.rescheduleButton}
                activeOpacity={0.8}
                onPress={() => {
                  setAppointmentSheetVisible(false);
                  router.push({
                    pathname: '/(app)/doctors/booking',
                    params: { id: 'demo_doc_1', isReschedule: 'true' },
                  });
                }}
              >
                <MaterialCommunityIcons name="calendar-edit" size={20} color={Colors.surface} />
                <Text style={sheetStyles.rescheduleText}>Reschedule Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </DraggableBottomSheet>
      )}
    </SafeAreaView>
  );
};

// --- Internal sub-component (not exported, single-use) ---

interface QuickActionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
}

const QuickAction = ({ icon, label, onPress }: QuickActionProps): React.JSX.Element => (
  <TouchableOpacity
    style={styles.quickActionItem}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <View style={styles.quickActionIcon}>
      <MaterialCommunityIcons name={icon} size={28} color={Colors.primary} />
    </View>
    <Text style={styles.quickActionText}>{label}</Text>
  </TouchableOpacity>
);

// 4. STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontFamily: FontFamily.extraBold,

    fontSize: FontSize.xxl,
    color: Colors.primary,
  },
  searchContainer: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: (Colors as any).emergency || Colors.danger,
    borderRadius: BorderRadius.md,
    paddingVertical: 19,
    paddingHorizontal: Spacing.lg,
    marginTop: 0,
    marginBottom: Spacing.lg,
  },
  sosLeftIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosRightIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTextContainer: {
    flex: 1,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.md,
  },
  sosText: {
    fontFamily: FontFamily.bold,

    fontSize: 15, // Decreased font size by 5px
    color: Colors.surface,
    marginBottom: 2,
  },
  sosSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.surface,
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: Spacing.sm,
    width: '32%',
  },
  quickActionIcon: {
    width: '100%',
    height: 68,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.5,
  },
  cardsContainer: {
    gap: Spacing.base,
  },
});

// Sheet-specific styles
const sheetStyles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  innerContent: {
    gap: Spacing.lg,
  },
  sheetTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailTextGroup: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.tertiary,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  rescheduleText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.surface,
  },
});
