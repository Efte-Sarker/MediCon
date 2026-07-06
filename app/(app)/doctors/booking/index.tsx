import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Colors,
  Spacing,
  FontFamily,
  FontSize,
  BorderRadius,
  Shadows,
} from '../../../../src/theme';
import {
  appointmentsService,
  TimeSlot,
  ConsultationType,
} from '../../../../src/services/api/appointmentsService';
import { doctorsService, Doctor } from '../../../../src/services/api/doctorsService';
import { Avatar } from '../../../../src/components/ui/Avatar';
import { useTranslation } from 'react-i18next';

export default function BookingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-06');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<ConsultationType>('video');
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Mock dates for calendar
  const mockDates = [
    { day: 'Mon', date: '06', full: '2026-07-06' },
    { day: 'Tue', date: '07', full: '2026-07-07' },
    { day: 'Wed', date: '08', full: '2026-07-08' },
    { day: 'Thu', date: '09', full: '2026-07-09' },
    { day: 'Fri', date: '10', full: '2026-07-10' },
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await doctorsService.getDoctorDetails(id);
        setDoctor(data);
      } finally {
        setLoading(false);
      }
    };
    void fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!id) return;
      try {
        setSlotsLoading(true);
        const availableSlots = await appointmentsService.getAvailableSlots(id, selectedDate);
        setSlots(availableSlots);
        setSelectedSlot(null); // Reset selection on date change
      } finally {
        setSlotsLoading(false);
      }
    };
    void fetchSlots();
  }, [id, selectedDate]);

  const handleContinue = () => {
    if (!id || !selectedSlot) return;
    router.push({
      pathname: '/(app)/doctors/booking/digest',
      params: {
        doctorId: id,
        date: selectedDate,
        timeSlotId: selectedSlot,
        type: consultationType,
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!doctor) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {t('booking.doctor_not_found') || 'Doctor not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('booking.book_appointment') || 'Book Appointment'}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Doctor Info */}
        <View style={styles.doctorCard}>
          <Avatar name={doctor.fullName} size={50} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.fullName}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.department}</Text>
          </View>
        </View>

        {/* Consultation Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('booking.consultation_type') || 'Consultation Type'}
          </Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeOption, consultationType === 'video' && styles.typeOptionActive]}
              onPress={() => setConsultationType('video')}
            >
              <MaterialCommunityIcons
                name="video"
                size={24}
                color={consultationType === 'video' ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[styles.typeText, consultationType === 'video' && styles.typeTextActive]}
              >
                {t('booking.video_call') || 'Video Call'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeOption,
                consultationType === 'in-person' && styles.typeOptionActive,
              ]}
              onPress={() => setConsultationType('in-person')}
            >
              <MaterialCommunityIcons
                name="hospital-building"
                size={24}
                color={consultationType === 'in-person' ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[styles.typeText, consultationType === 'in-person' && styles.typeTextActive]}
              >
                {t('booking.in_person') || 'In Person'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('booking.select_date') || 'Select Date'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {mockDates.map((item) => (
              <TouchableOpacity
                key={item.full}
                style={[styles.dateBox, selectedDate === item.full && styles.dateBoxActive]}
                onPress={() => setSelectedDate(item.full)}
              >
                <Text style={[styles.dateDay, selectedDate === item.full && styles.dateTextActive]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateNum, selectedDate === item.full && styles.dateTextActive]}>
                  {item.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('booking.available_time') || 'Available Time'}</Text>
          {slotsLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.slotsGrid}>
              {slots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotBox,
                    !slot.isAvailable && styles.slotDisabled,
                    selectedSlot === slot.id && styles.slotBoxActive,
                  ]}
                  disabled={!slot.isAvailable}
                  onPress={() => setSelectedSlot(slot.id)}
                >
                  <Text
                    style={[
                      styles.slotText,
                      !slot.isAvailable && styles.slotTextDisabled,
                      selectedSlot === slot.id && styles.slotTextActive,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedSlot && styles.continueButtonDisabled]}
          disabled={!selectedSlot}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>{t('booking.continue') || 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerRight: {
    width: 32,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    ...Shadows.sm,
  },
  doctorInfo: {
    marginLeft: Spacing.md,
  },
  doctorName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  doctorSpecialty: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    backgroundColor: Colors.surface,
    gap: Spacing.sm,
  },
  typeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`, // very light primary
  },
  typeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  typeTextActive: {
    color: Colors.primary,
  },
  dateScroll: {
    flexDirection: 'row',
  },
  dateBox: {
    width: 60,
    height: 80,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  dateBoxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateDay: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dateNum: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  dateTextActive: {
    color: Colors.surface,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  slotBox: {
    width: '30%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  slotBoxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotDisabled: {
    backgroundColor: Colors.background,
    borderColor: Colors.tertiary,
  },
  slotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  slotTextActive: {
    color: Colors.surface,
  },
  slotTextDisabled: {
    color: Colors.textTertiary,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
    ...Shadows.sm,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.tertiary,
  },
  continueText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
});
