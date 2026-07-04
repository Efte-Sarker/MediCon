import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Colors, Spacing, FontFamily, FontSize, Layout, BorderRadius } from '../../../src/theme';
import { prescriptionsService } from '../../../src/services/api/prescriptionsService';
import { reminderService } from '../../../src/services/notifications/reminderService';
import { Prescription, PrescriptionMedicine } from '../../../src/types/medical.types';

export default function PrescriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  // Time picker state for setting reminders
  const [showPicker, setShowPicker] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  const [reminderTimes, setReminderTimes] = useState<Record<string, Date>>({});

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await prescriptionsService.getPrescriptionDetails(id as string);
        if (isMounted) {
          setPrescription(data);

          // Seed default reminder times (e.g., 08:00 AM)
          const defaultTimes: Record<string, Date> = {};
          data.medicines.forEach((med) => {
            const defaultTime = new Date();
            defaultTime.setHours(8, 0, 0, 0); // 8:00 AM
            defaultTimes[med.id] = defaultTime;
          });
          setReminderTimes(defaultTimes);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          Alert.alert('Error', 'Failed to load prescription');
          router.back();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id, router]);

  const handleSetReminder = async (med: PrescriptionMedicine, date: Date) => {
    try {
      const hasPermission = await reminderService.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your settings to set reminders.',
        );
        return;
      }

      const identifier = await reminderService.scheduleDailyReminder(
        med.id,
        'Medicine Reminder',
        `It's time to take ${med.name} (${med.dosage})!`,
        date.getHours(),
        date.getMinutes(),
      );

      setReminderTimes((prev) => ({ ...prev, [med.id]: date }));
      Alert.alert(
        'Success',
        `Daily reminder set for ${med.name} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to schedule reminder');
    }
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate && selectedMedId) {
      const med = prescription?.medicines.find((m) => m.id === selectedMedId);
      if (med) {
        handleSetReminder(med, selectedDate);
      }
    }
  };

  if (loading || !prescription) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Issued On:</Text>
          <Text style={styles.metaValue}>
            {new Date(prescription.issuedAt).toLocaleDateString()}
          </Text>
          <Text style={[styles.metaLabel, { marginTop: Spacing.sm }]}>Doctor ID:</Text>
          <Text style={styles.metaValue}>{prescription.doctorId}</Text>
        </View>

        <Text style={styles.sectionTitle}>Medicines</Text>

        {prescription.medicines.map((med) => (
          <View key={med.id} style={styles.medicineCard}>
            <View style={styles.medHeader}>
              <View>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDosage}>
                  {med.dosage} • {med.frequency}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.reminderButton}
                onPress={() => {
                  setSelectedMedId(med.id);
                  setShowPicker(true);
                }}
              >
                <MaterialCommunityIcons name="bell-ring-outline" size={20} color={Colors.primary} />
                <Text style={styles.reminderButtonText}>
                  {reminderTimes[med.id]?.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) || 'Set Time'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.instructionBox}>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.instructionText}>{med.instructions}</Text>
            </View>

            {med.aiDemystifierSummary && (
              <View style={styles.aiBox}>
                <View style={styles.aiHeader}>
                  <MaterialCommunityIcons name="robot-outline" size={16} color={Colors.secondary} />
                  <Text style={styles.aiHeaderTitle}>AI Demystifier</Text>
                </View>
                <Text style={styles.aiText}>{med.aiDemystifierSummary}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {showPicker && (
        <DateTimePicker
          value={
            selectedMedId && reminderTimes[selectedMedId]
              ? reminderTimes[selectedMedId]
              : new Date()
          }
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onChangeTime}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Layout.tabBarHeight + Spacing.xl,
  },
  metaCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  metaLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  medicineCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  medName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  medDosage: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4FE',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  reminderButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  instructionBox: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  instructionText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  aiBox: {
    backgroundColor: '#F5F3FF', // Light purple
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  aiHeaderTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.secondary,
  },
  aiText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
