import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize } from '../../../src/theme';
import { AIDisclaimer } from '../../../src/components/medical/AIDisclaimer';
import { symptomTriageService } from '../../../src/services/ai/symptomTriageService';
import { Doctor } from '../../../src/services/api/doctorsService';
import { DoctorCard } from '../../../src/components/cards/DoctorCard';
import { Button } from '../../../src/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function SymptomResultsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const query = typeof q === 'string' ? q : '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const results = await symptomTriageService.searchDoctorsBySymptom(query);
        if (isMounted) setDoctors(results);
      } catch {
        // ignore
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDoctors();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('results.ai_recommendations') || 'AI Recommendations'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AIDisclaimer />

        <Text style={styles.sectionTitle}>
          {t('results.doctors_for') || 'Doctors for "'}
          {query}"
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.doctorsList}>
            {doctors.length === 0 ? (
              <Text style={styles.emptyText}>
                {t('results.no_matching_doctors_found_for_') ||
                  'No matching doctors found for these symptoms.'}
              </Text>
            ) : (
              doctors.map((doctor) => (
                <View key={doctor.id} style={styles.doctorItem}>
                  <DoctorCard
                    doctor={doctor}
                    onPress={() => {
                      // Navigate to doctor profile when built
                    }}
                  />
                  <View style={styles.actions}>
                    <Button
                      label={t('results.book_consultation') || 'Book Consultation'}
                      onPress={() => {
                        // Navigate to booking flow
                        router.push('/(app)/(tabs)/doctors');
                      }}
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  loader: {
    marginTop: Spacing.xxxl,
  },
  doctorsList: {
    gap: Spacing.xl,
  },
  doctorItem: {
    gap: Spacing.sm,
  },
  actions: {
    paddingHorizontal: Spacing.sm,
  },
  bookButton: {
    width: '100%',
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
