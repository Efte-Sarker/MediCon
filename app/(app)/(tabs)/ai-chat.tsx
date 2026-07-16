import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize } from '../../../src/theme';
import {
  doctorsService,
  ConsultationHistoryItem,
  Doctor,
} from '../../../src/services/api/doctorsService';
import { DoctorCard } from '../../../src/components/cards/DoctorCard';
import { useTranslation } from 'react-i18next';

type EnrichedConsultation = ConsultationHistoryItem & { doctorInfo?: Doctor | null };

export default function AiChatHistoryScreen() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<EnrichedConsultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const consultations = await doctorsService.getConsultationHistory();
        // Enrich with doctor details for the DoctorCard
        const enriched = await Promise.all(
          consultations.map(async (cons) => {
            const doctorInfo = await doctorsService.getDoctorDetails(cons.doctorId);
            return { ...cons, doctorInfo };
          }),
        );

        setHistory(enriched);
        // Ignore err for now
      } finally {
        setLoading(false);
      }
    };

    void fetchHistory();
  }, []);

  const handleConsultationPress = (consultationId: string) => {
    router.push(`/(app)/ai-chat/${consultationId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('ai-chat.select_consultation') || 'Select Consultation'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t('ai-chat.choose_a_past_consultation_to_') ||
            'Choose a past consultation to ask the AI questions about your diagnosis and prescriptions.'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <DoctorCard
                doctor={item.doctorInfo || null}
                onPress={() => handleConsultationPress(item.id)}
                hideSectionLabel
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                {t('ai-chat.no_past_consultations_found') || 'No past consultations found.'}
              </Text>
            </View>
          }
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
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: Spacing.md,
  },
  cardWrapper: {
    marginBottom: Spacing.md,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: FontSize.md * 1.5,
  },
});
