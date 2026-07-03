// 1. IMPORTS
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Layout, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePatientDashboard } from '../../hooks/usePatientDashboard';
import { AppointmentCard } from '../cards/AppointmentCard';
import { DoctorCard } from '../cards/DoctorCard';
import { MedicationCard } from '../cards/MedicationCard';

// 2. TYPES
/* No external props — this is a self-contained dashboard. */

// 3. COMPONENT
export const PatientDashboard = (): React.JSX.Element => {
  const router = useRouter();
  const { nextAppointment, recentDoctor, nextMedicine } = usePatientDashboard();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.subtitle}>Here&apos;s your health overview</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SOS Button */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => router.push('/(app)/emergency/')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Emergency SOS. Double tap to access emergency protocols."
        >
          <MaterialCommunityIcons name="alert-octagon" size={24} color={Colors.surface} />
          <Text style={styles.sosText}>EMERGENCY SOS</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.surface} />
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="stethoscope"
            label="Doctors"
            onPress={() => router.push('/(app)/(tabs)/doctors')}
          />
          <QuickAction
            icon="flask-outline"
            label="Reports"
            onPress={() => router.push('/(app)/(tabs)/reports')}
          />
          <QuickAction
            icon="hospital-building"
            label="Hospitals"
            onPress={() => router.push('/(app)/(tabs)/hospitals')}
          />
          <QuickAction
            icon="chat-processing-outline"
            label="AI Chat"
            onPress={() => router.push('/(app)/(tabs)/ai-chat')}
          />
        </View>

        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          <AppointmentCard appointment={nextAppointment} />
          <MedicationCard medication={nextMedicine} />
          <DoctorCard doctor={recentDoctor} />
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
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  sosText: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
    textAlign: 'center',
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
  cardsContainer: {
    gap: Spacing.base,
  },
});
