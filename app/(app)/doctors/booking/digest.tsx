import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
  DigestData,
  ConsultationType,
} from '../../../../src/services/api/appointmentsService';
import { doctorsService, Doctor } from '../../../../src/services/api/doctorsService';
import { DigestCard } from '../../../../src/components/cards/DigestCard';
import { useTranslation } from 'react-i18next';

export default function BookingDigestScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { doctorId, date, timeSlotId, type } = useLocalSearchParams<{
    doctorId: string;
    date: string;
    timeSlotId: string;
    type: ConsultationType;
  }>();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) return;
      try {
        setLoading(true);
        const [doctorData, digestData] = await Promise.all([
          doctorsService.getDoctorDetails(doctorId),
          appointmentsService.getPreConsultationDigest('currentUser'),
        ]);
        setDoctor(doctorData);
        setDigest(digestData);
      } catch {
        // Ignore for mock
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [doctorId]);

  const handleConfirmBooking = async () => {
    if (!doctorId || !date || !timeSlotId || !type) return;

    try {
      setBooking(true);
      const result = await appointmentsService.bookAppointment({
        doctorId,
        date,
        timeSlotId,
        type,
      });

      if (result.success) {
        router.replace({
          pathname: '/(app)/doctors/booking/confirmation',
          params: {
            appointmentId: result.appointmentId,
            type,
            doctorId,
          },
        });
      }
    } catch {
      Alert.alert('Booking Failed', 'An error occurred while booking. Please try again.');
    } finally {
      setBooking(false);
    }
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

  if (!doctor || !digest) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {t('digest.could_not_load_booking_details') || 'Could not load booking details'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('digest.review_confirm') || 'Review & Confirm'}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>
            {t('digest.appointment_details') || 'Appointment Details'}
          </Text>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.summaryText}>{date}</Text>
          </View>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="doctor" size={20} color={Colors.primary} />
            <Text style={styles.summaryText}>
              {t('digest.dr') || 'Dr.'} {doctor.fullName}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons
              name={type === 'video' ? 'video' : 'hospital-building'}
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.summaryText}>
              {type === 'video' ? 'Video Consultation' : 'In-Person Consultation'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="cash" size={20} color={Colors.primary} />
            <Text style={styles.summaryText}>${doctor.consultationFee}</Text>
          </View>
        </View>

        {/* Digest Preview */}
        <DigestCard data={digest} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, booking && styles.confirmButtonDisabled]}
          onPress={handleConfirmBooking}
          disabled={booking}
        >
          {booking ? (
            <ActivityIndicator size="small" color={Colors.surface} />
          ) : (
            <Text style={styles.confirmText}>
              {t('digest.confirm_booking') || 'Confirm Booking'}
            </Text>
          )}
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
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
    ...Shadows.sm,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.tertiary,
  },
  confirmText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
});
