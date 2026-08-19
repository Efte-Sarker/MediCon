import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../../src/theme';
import { reportsService } from '../../../src/services/api/reportsService';
import { createAppError } from '../../../src/utils/errors';
import { useTranslation } from 'react-i18next';

interface SelectedFile {
  uri: string;
  type: 'image' | 'pdf';
  name: string;
}

export default function UploadReportScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>(() => {
    if (params.files && typeof params.files === 'string') {
      try {
        return JSON.parse(params.files);
      } catch (e) {
        console.warn('Failed to parse files param', e);
      }
    }
    return [];
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePickImages = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Denied',
          'You need to allow access to your photos to upload a report.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newFiles: SelectedFile[] = result.assets.map((asset) => ({
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `page-${Date.now()}.jpg`,
        }));
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (err) {
      const appError = createAppError('UNKNOWN_ERROR', String(err));
      Alert.alert('Error', appError.message);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (!file.mimeType?.includes('pdf')) {
          Alert.alert('Unsupported File', 'Please upload a valid PDF document.');
          return;
        }
        // Replace all — a PDF is a single document representing the whole report
        setSelectedFiles([{ uri: file.uri, type: 'pdf', name: file.name }]);
      }
    } catch (err) {
      const appError = createAppError('UNKNOWN_ERROR', String(err));
      Alert.alert('Error', appError.message);
    }
  };

  const handleRemovePage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const parsedReport = await reportsService.uploadReport(selectedFiles);
      router.replace(`/(app)/report/${parsedReport.id}`);
    } catch (err: any) {
      const msg = err?.message || String(err) || 'Unknown error';
      Alert.alert(
        'Upload Failed',
        `Could not analyze the report.\n\nDetails: ${msg}\n\nMake sure the backend server is running.`,
      );
      setIsProcessing(false);
    }
  };

  // ── Processing State ────────────────────────────────────────────────────────
  if (isProcessing) {
    return (
      <SafeAreaView style={styles.processingContainer}>
        <View style={styles.processingCard}>
          <View style={styles.processingIconBg}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
          <Text style={styles.processingTitle}>Analyzing Report...</Text>
          <Text style={styles.processingSubtitle}>
            Our AI is scanning{' '}
            {selectedFiles.length > 1 ? `all ${selectedFiles.length} pages` : 'the document'} and
            extracting clinical biomarkers.
            {'\n\n'}This may take 10–20 seconds.
          </Text>
          <View style={styles.processingSteps}>
            {['Reading document', 'Extracting biomarkers', 'Generating summary'].map((step, i) => (
              <View key={i} style={styles.processingStep}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.processingStepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Preview State (files selected) ─────────────────────────────────────────
  if (selectedFiles.length > 0) {
    const isPdf = selectedFiles[0].type === 'pdf';

    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: Colors.surface, paddingTop: insets.top }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Review Document</Text>
              {!isPdf && (
                <Text style={styles.headerSubtitle}>
                  {`${selectedFiles.length} page${selectedFiles.length > 1 ? 's' : ''} selected`}
                </Text>
              )}
            </View>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: Spacing.base, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
        >
          {isPdf ? (
            <View style={styles.pdfPreviewCard}>
              <MaterialCommunityIcons name="file-pdf-box" size={72} color={Colors.danger} />
              <Text style={styles.pdfFileName}>{selectedFiles[0].name}</Text>
              <Text style={styles.pdfFileSubtitle}>PDF Document ready for analysis</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.gridSectionLabel}>Pages (tap to remove)</Text>
              <View style={styles.thumbnailGrid}>
                {selectedFiles.map((file, index) => (
                  <View key={`${file.uri}-${index}`} style={styles.thumbnailWrapper}>
                    <Image source={{ uri: file.uri }} style={styles.thumbnail} resizeMode="cover" />
                    <View style={styles.thumbnailPageBadge}>
                      <Text style={styles.thumbnailPageText}>{index + 1}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.thumbnailRemoveBtn}
                      onPress={() => handleRemovePage(index)}
                    >
                      <MaterialCommunityIcons name="close-circle" size={22} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
                {/* Add more tile */}
                <TouchableOpacity
                  style={styles.addMoreTile}
                  onPress={handlePickImages}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="plus" size={28} color={Colors.primary} />
                  <Text style={styles.addMoreTileText}>Add page</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="information-outline" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              Make sure all pages of your report are included for the most accurate analysis.
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.bottomActions, { paddingBottom: Spacing.base + insets.bottom }]}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>Analyze Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Fallback if no files were provided via params
  return (
    <SafeAreaView style={styles.processingContainer}>
      <Text style={styles.processingTitle}>No file selected</Text>
      <TouchableOpacity
        style={[styles.primaryButton, { marginTop: Spacing.xl, paddingHorizontal: Spacing.xl }]}
        onPress={() => router.back()}
      >
        <Text style={styles.primaryButtonText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const THUMBNAIL_SIZE = 100;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Processing
  processingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  processingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  processingIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.tertiaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  processingTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  processingSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
    marginBottom: Spacing.xl,
  },
  processingSteps: { width: '100%', gap: Spacing.sm },
  processingStep: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  processingStepText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.base,
    paddingLeft: 5,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    gap: Spacing.xs,
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTextBlock: { flex: 1 },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addMoreText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },

  // Selection screen
  selectionContainer: { padding: Spacing.xl },
  heroBanner: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  heroTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.6,
  },
  sectionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionTextContainer: { flex: 1 },
  optionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  optionSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tipsCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.tertiaryLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  tipsTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  tipText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: FontSize.sm * 1.5,
  },

  // Preview screen - thumbnail grid
  gridSectionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  thumbnailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  thumbnailWrapper: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: BorderRadius.md,
    overflow: 'visible',
    position: 'relative',
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  thumbnailPageBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  thumbnailPageText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#fff',
  },
  thumbnailRemoveBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  addMoreTile: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.tertiaryLight,
  },
  addMoreTileText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.base,
    backgroundColor: Colors.tertiaryLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  infoText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: FontSize.sm * 1.5,
  },

  // PDF preview
  pdfPreviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl ?? Spacing.xl * 1.5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.tertiary,
    borderStyle: 'dashed',
    marginBottom: 0,
  },
  pdfFileName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  pdfFileSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  // Bottom actions
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    minHeight: 52,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
});
