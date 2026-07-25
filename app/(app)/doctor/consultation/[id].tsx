// 1. IMPORTS
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Layout, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 2. TYPES
interface ConsultationDetail {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  reason: string;
  scheduledTime: string;
  format: 'video' | 'in-person';
  status: 'pending' | 'in-progress' | 'completed';
  activeConditions: string[];
  activeMedicines: string[];
  notes: string;
}

const MOCK_CONSULTATIONS: Record<string, ConsultationDetail> = {
  'appt-101': {
    id: 'appt-101',
    patientName: 'Rahim Uddin',
    patientAge: 45,
    patientGender: 'Male',
    reason: 'Follow-up for hypertension',
    scheduledTime: '9:00 AM',
    format: 'in-person',
    status: 'completed',
    activeConditions: ['Hypertension', 'Type 2 Diabetes'],
    activeMedicines: ['Amlodipine 5mg', 'Metformin 500mg'],
    notes: 'Patient reports good BP control this week. Review blood sugar readings.',
  },
  'appt-102': {
    id: 'appt-102',
    patientName: 'Ayesha Rahman',
    patientAge: 32,
    patientGender: 'Female',
    reason: 'Migraine consultation',
    scheduledTime: '11:00 AM',
    format: 'video',
    status: 'in-progress',
    activeConditions: ['Migraine'],
    activeMedicines: ['Sumatriptan 50mg'],
    notes: 'Patient has had 3 episodes this week. Evaluate preventive therapy.',
  },
  'appt-103': {
    id: 'appt-103',
    patientName: 'Kamal Hasan',
    patientAge: 58,
    patientGender: 'Male',
    reason: 'Routine checkup, blood test review',
    scheduledTime: '2:00 PM',
    format: 'in-person',
    status: 'pending',
    activeConditions: ['Hypertension', 'High Cholesterol'],
    activeMedicines: ['Atorvastatin 20mg', 'Losartan 50mg'],
    notes: 'Annual checkup. Review lipid panel results. Check blood pressure.',
  },
  'appt-104': {
    id: 'appt-104',
    patientName: 'Nusrat Jahan',
    patientAge: 27,
    patientGender: 'Female',
    reason: 'Fever and throat pain for 3 days',
    scheduledTime: '4:00 PM',
    format: 'video',
    status: 'pending',
    activeConditions: [],
    activeMedicines: ['Paracetamol 500mg'],
    notes: 'New patient. Evaluate for viral/bacterial pharyngitis.',
  },
};

// 3. COMPONENT
export default function ConsultationDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const consultation = MOCK_CONSULTATIONS[id ?? ''];

  if (!consultation) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultation</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="calendar-question" size={48} color={Colors.textTertiary} />
          <Text style={styles.errorText}>Consultation not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isVideo = consultation.format === 'video';
  const statusColor =
    consultation.status === 'completed'
      ? Colors.success
      : consultation.status === 'in-progress'
        ? Colors.warning
        : Colors.primary;
  const statusLabel =
    consultation.status === 'completed'
      ? 'Completed'
      : consultation.status === 'in-progress'
        ? 'In Progress'
        : 'Pending';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Patient Banner Card */}
        <View style={styles.patientBanner}>
          <View style={styles.bannerAvatar}>
            <Text style={styles.bannerAvatarText}>{consultation.patientName.charAt(0)}</Text>
          </View>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerName}>{consultation.patientName}</Text>
            <Text style={styles.bannerMeta}>
              {consultation.patientAge} yrs • {consultation.patientGender}
            </Text>
            <View style={styles.bannerRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.bannerMetaSecondary}>{consultation.scheduledTime}</Text>
              <MaterialCommunityIcons
                name={isVideo ? 'video' : 'hospital-building'}
                size={14}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.bannerMetaSecondary}>{isVideo ? 'Video' : 'In-person'}</Text>
            </View>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reason for Visit</Text>
          </View>
          <View style={styles.reasonCard}>
            <Text style={styles.reasonText}>{consultation.reason}</Text>
          </View>
        </View>

        {/* Pre-Consultation Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pre-Consultation Notes</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.notesText}>{consultation.notes}</Text>
          </View>
        </View>

        {/* Active Conditions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Conditions</Text>
          </View>
          {consultation.activeConditions.length === 0 ? (
            <View style={styles.emptySection}>
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color={Colors.textTertiary}
              />
              <Text style={styles.emptySectionText}>No known conditions</Text>
            </View>
          ) : (
            <View style={styles.chipRow}>
              {consultation.activeConditions.map((cond) => (
                <View key={cond} style={styles.chip}>
                  <Text style={styles.chipText}>{cond}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Current Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Medications</Text>
          </View>
          {consultation.activeMedicines.length === 0 ? (
            <View style={styles.emptySection}>
              <MaterialCommunityIcons name="pill" size={20} color={Colors.textTertiary} />
              <Text style={styles.emptySectionText}>No active medications</Text>
            </View>
          ) : (
            <View style={styles.card}>
              {consultation.activeMedicines.map((med, index) => (
                <View
                  key={med}
                  style={[
                    styles.medRow,
                    index < consultation.activeMedicines.length - 1 && styles.medRowBorder,
                  ]}
                >
                  <MaterialCommunityIcons name="pill" size={18} color={Colors.primary} />
                  <Text style={styles.medName}>{med}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {consultation.status !== 'completed' && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => Alert.alert('Video Call', 'Video consultation feature coming soon.')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Start video call"
            >
              <MaterialCommunityIcons name="video" size={20} color={Colors.surface} />
              <Text style={styles.primaryButtonText}>Start Video Call</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() =>
              router.push(
                `/(app)/doctor/prescription/write?patientId=${id}&patientName=${encodeURIComponent(consultation.patientName)}`,
              )
            }
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Write prescription"
          >
            <MaterialCommunityIcons name="pill" size={20} color={Colors.primary} />
            <Text style={styles.outlineButtonText}>Write Prescription</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/(app)/doctor/patient/${id}`)}
            accessibilityRole="button"
            accessibilityLabel="View patient profile"
            style={styles.textLink}
          >
            <Text style={styles.textLinkText}>View Patient Profile</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 4. STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.xxxl,
  },
  patientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  bannerAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerAvatarText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xl,
    color: Colors.surface,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.surface,
    marginBottom: 2,
  },
  bannerMeta: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: Spacing.xs,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  bannerMetaSecondary: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.75)',
    marginRight: Spacing.sm,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    ...Shadows.sm,
  },
  reasonCard: {
    backgroundColor: Colors.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  reasonText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.primary,
    lineHeight: FontSize.base * 1.5,
  },
  notesText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: FontSize.base * 1.6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.tertiary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  emptySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  emptySectionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  medRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
  },
  medName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  actionsSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    minHeight: 56,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.surface,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    minHeight: 56,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  outlineButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  textLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  textLinkText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
