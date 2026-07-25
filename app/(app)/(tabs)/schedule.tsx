// 1. IMPORTS
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize, Layout, BorderRadius, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDoctorDashboard } from '../../../src/hooks/useDoctorDashboard';
import { AppointmentQueueCard } from '../../../src/components/cards/AppointmentQueueCard';

// 2. TYPES
interface DateItem {
  day: string;
  date: number;
  month: number;
  year: number;
  index: number;
}

// 3. COMPONENT
export default function ScheduleScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const { todayQueue } = useDoctorDashboard();

  // Build a 7-day strip anchored to today
  const today = new Date();
  const todayDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Mon=0 … Sun=6

  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weekDates: DateItem[] = shortDays.map((day, index) => {
    const offset = index - todayDayIndex;
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return {
      day,
      date: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      index,
    };
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(todayDayIndex);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header — exact pattern from doctors.tsx */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.titleBold}>My </Text>
          <Text style={styles.titleBold}>Schedule</Text>
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/settings/')}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          accessibilityLabel="Settings"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="account-outline" size={27.6} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStripContent}
        >
          {weekDates.map((item) => {
            const isSelected = item.index === selectedIndex;
            return (
              <TouchableOpacity
                key={item.index}
                style={[
                  styles.dateCard,
                  isSelected ? styles.dateCardSelected : styles.dateCardUnselected,
                ]}
                onPress={() => setSelectedIndex(item.index)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={`${item.day} ${item.date}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.dateDayText,
                    isSelected ? styles.dateTextActive : styles.dateTextDefault,
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.dateNumberText,
                    isSelected ? styles.dateTextActive : styles.dateTextDefault,
                  ]}
                >
                  {item.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Appointments Section — exact pattern from doctors.tsx */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('schedule.appointments_today') || 'Appointments Today'}
            </Text>
          </View>

          {todayQueue.length === 0 ? (
            <View style={styles.emptySection}>
              <MaterialCommunityIcons name="calendar-check" size={28} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>
                {t('schedule.no_appointments') || 'No appointments scheduled for this day.'}
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

  // --- Header (exact from doctors.tsx) ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    color: Colors.primary,
  },
  titleBold: {
    fontFamily: FontFamily.extraBold,
    fontWeight: '900',
  },

  // --- Scroll content ---
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.base,
  },

  // --- Date Strip ---
  dateStripContent: {
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  dateCard: {
    width: 60,
    height: 80,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  dateCardSelected: {
    backgroundColor: Colors.primary,
  },
  dateCardUnselected: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  dateDayText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  dateNumberText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  dateTextActive: {
    color: Colors.surface,
  },
  dateTextDefault: {
    color: Colors.textSecondary,
  },

  // --- Section (exact from doctors.tsx) ---
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

  // --- Queue ---
  queueContainer: {
    gap: Spacing.base,
  },

  // --- Empty state (exact row style from doctors.tsx) ---
  emptySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.5,
    flex: 1,
  },
});
