// 1. IMPORTS
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Layout, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import { AppointmentQueueCard } from '../cards/AppointmentQueueCard';

// 2. TYPES
/* No external props — this is a self-contained dashboard. */

// 3. COMPONENT
export const DoctorDashboard = (): React.JSX.Element => {
  const router = useRouter();
  const { todayQueue, metrics } = useDoctorDashboard();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Doctor Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, Dr. Smith</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="calendar-clock"
            label="Schedule"
            onPress={() => {
              // Future: Navigation to Schedule
            }}
          />
          <QuickAction
            icon="inbox-outline"
            label="Q&A Inbox"
            onPress={() => router.push('/(app)/doctors/qna/')}
          />
          <QuickAction
            icon="account-group-outline"
            label="Patients"
            onPress={() => {
              // Future: Navigation to Patients list
            }}
          />
        </View>

        {/* Metrics Summary */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.pending}</Text>
            <Text style={styles.metricLabel}>Pending</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.completed}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.total}</Text>
            <Text style={styles.metricLabel}>Total Today</Text>
          </View>
        </View>

        {/* Today's Queue */}
        <View style={styles.queueSection}>
          <Text style={styles.sectionTitle}>Today's Queue</Text>

          {todayQueue.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="calendar-check" size={32} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>No appointments today</Text>
            </View>
          ) : (
            <View style={styles.queueContainer}>
              {todayQueue.map((appointment) => (
                <AppointmentQueueCard
                  key={appointment.id}
                  appointment={appointment}
                  onPress={() => {
                    // Future: Navigate to consultation details
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
      <MaterialCommunityIcons name={icon} size={24} color={Colors.primary} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
  },
  greeting: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.base,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  quickActionLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Colors.tertiary,
  },
  metricValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  metricLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  queueSection: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  queueContainer: {
    gap: Spacing.base,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
