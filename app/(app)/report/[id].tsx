import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../../src/theme';
import { reportsService } from '../../../src/services/api/reportsService';
import { Report } from '../../../src/types/medical.types';
import { BiomarkerRow } from '../../../src/components/medical/BiomarkerRow';
import { AIDisclaimer } from '../../../src/components/medical/AIDisclaimer';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No report ID provided');
        const data = await reportsService.getReportDetails(id);
        setReport(data);
      } catch (err) {
        setError('Failed to load report details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={Colors.danger} />
        <Text style={styles.errorText}>{error || 'Report not found.'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Report Details
        </Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <View style={styles.metadataCard}>
          <View style={styles.metadataRow}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color={Colors.primary} />
            <View style={styles.metadataTextContainer}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportSubtitle}>{report.laboratory || 'Unknown Laboratory'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.metadataRow}>
            <MaterialCommunityIcons name="calendar" size={20} color={Colors.textSecondary} />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>

        {report.aiSummary && (
          <View style={styles.section}>
            <AIDisclaimer />
            <Text style={styles.aiSummaryText}>{report.aiSummary}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Biomarkers</Text>

          {report.biomarkers && report.biomarkers.length > 0 ? (
            <View style={styles.biomarkerList}>
              {report.biomarkers.map((biomarker) => (
                <BiomarkerRow key={biomarker.id} biomarker={biomarker} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyBiomarkers}>
              <Text style={styles.emptyBiomarkersText}>
                No specific biomarkers were extracted from this report.
              </Text>
            </View>
          )}
        </View>

        {/* Placeholder for viewing original document */}
        <TouchableOpacity style={styles.viewOriginalButton}>
          <MaterialCommunityIcons name="eye-outline" size={20} color={Colors.primary} />
          <Text style={styles.viewOriginalText}>View Original Document</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  backButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerIcon: {
    padding: Spacing.sm,
    width: 44,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.surface,
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  metadataCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  reportTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  reportSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.tertiary,
    marginVertical: Spacing.md,
  },
  dateText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  aiSummaryText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: 24,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  biomarkerList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  emptyBiomarkers: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  emptyBiomarkersText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  viewOriginalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    marginBottom: Spacing.xl,
  },
  viewOriginalText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
});
