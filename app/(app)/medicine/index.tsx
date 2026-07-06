import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../../src/theme';
import { useTranslation } from 'react-i18next';

export default function MedicineHubScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('medicine.medicine_intelligence') || 'Medicine Intelligence'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          {t('medicine.explore_aidriven_insights_abou') ||
            `Explore AI-driven insights about your medications. Choose an option below to learn more,
                            compare, or check for potential interactions.`}
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(app)/medicine/explainer')}
        >
          <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
            <MaterialCommunityIcons name="pill" size={24} color={Colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              {t('medicine.medicine_explainer') || 'Medicine Explainer'}
            </Text>
            <Text style={styles.cardDesc}>
              {t('medicine.learn_about_forms_side_effects') ||
                'Learn about forms, side effects, and dietary conflicts.'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(app)/medicine/compare')}
        >
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <MaterialCommunityIcons name="scale-balance" size={24} color={Colors.warning} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              {t('medicine.medicine_comparator') || 'Medicine Comparator'}
            </Text>
            <Text style={styles.cardDesc}>
              {t('medicine.sidebyside_comparison_with_ai_') ||
                'Side-by-side comparison with AI rationale.'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(app)/medicine/interaction-checker')}
        >
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color={Colors.danger} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              {t('medicine.interaction_checker') || 'Interaction Checker'}
            </Text>
            <Text style={styles.cardDesc}>
              {t('medicine.crossreference_new_meds_with_y') ||
                'Cross-reference new meds with your active prescriptions.'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
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
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
