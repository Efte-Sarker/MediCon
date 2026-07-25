// 1. IMPORTS
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Layout, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import { AppointmentQueueCard } from '../cards/AppointmentQueueCard';
import { useAuthStore } from '../../store/authStore';

// 2. TYPES
/* No external props — this is a self-contained dashboard. */

// 3. COMPONENT
export const DoctorDashboard = (): React.JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const { todayQueue, metrics } = useDoctorDashboard();
  const fullName = 'Dr. Smith';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>MediCon</Text>
          <Text style={styles.subtitle}>
            {fullName}
            {' • '}
            {t('doctordashboard.specialty') || 'Cardiology'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.push('/(app)/notifications')}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessibilityRole="button"
            accessibilityLabel={t('dashboard.notifications') || 'Notifications'}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(app)/settings/')}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessibilityRole="button"
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Today at a Glance — stat banner */}
        <View style={styles.statBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{metrics.pending}</Text>
            <Text style={styles.statLabel}>{t('doctordashboard.pending') || 'Pending'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{metrics.completed}</Text>
            <Text style={styles.statLabel}>{t('doctordashboard.completed') || 'Completed'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{metrics.total}</Text>
            <Text style={styles.statLabel}>
              {t('doctordashboard.total_today') || 'Total Today'}
            </Text>
          </View>
        </View>

        {/* Today's Queue */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('doctordashboard.todays_queue') || "Today's Queue"}
          </Text>
        </View>

        {todayQueue.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-check" size={24} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>
              {t('doctordashboard.no_appointments_today') || 'No appointments today'}
            </Text>
          </View>
        ) : (
          <View style={styles.queueContainer}>
            {todayQueue.map((appointment) => (
              <AppointmentQueueCard
                key={appointment.id}
                appointment={appointment}
                onPress={() => router.push('/(app)/doctor/consultation/' + appointment.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontFamily: FontFamily.extraBold,
    fontWeight: '900',
    fontSize: FontSize.xxl,
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.base,
  },
  statBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.surface,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.surface,
    opacity: 0.85,
    marginTop: 2,
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
  queueContainer: {
    gap: Spacing.base,
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    ...Shadows.sm,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
