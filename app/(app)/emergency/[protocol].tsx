import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Shadows, Layout } from '@theme';
import {
  EMERGENCY_PROTOCOLS,
  getProtocolStepsForAge,
} from '../../../src/services/protocols/emergency-protocols.data';
import { EmergencyStepCard } from '../../../src/components/medical/EmergencyStepCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function EmergencyProtocolScreen() {
  const { t } = useTranslation();
  const { protocol: protocolId } = useLocalSearchParams<{ protocol: string }>();
  const router = useRouter();

  const protocol = EMERGENCY_PROTOCOLS[protocolId];

  if (!protocol) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{t('[protocol].protocol_not_found') || 'Protocol not found.'}</Text>
      </SafeAreaView>
    );
  }

  const steps = getProtocolStepsForAge(protocol, 'adult');
  const hasPediatricVariant = Boolean(protocol.steps.child || protocol.steps.infant);

  const handleCall911 = () => {
    Linking.openURL('tel:911').catch(() => {
      // Handle gracefully if device cannot make calls (e.g., simulator)
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">
          {protocol.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>{protocol.description}</Text>

        {protocol.callEmergencyServices && (
          <TouchableOpacity
            style={styles.callButton}
            onPress={handleCall911}
            accessibilityRole="button"
            accessibilityLabel="Call 911 immediately"
          >
            <MaterialCommunityIcons name="phone" color={Colors.surface} size={20} />
            <Text style={styles.callButtonText}>
              {t('[protocol].call_911_now') || 'Call 911 Now'}
            </Text>
          </TouchableOpacity>
        )}

        {hasPediatricVariant && (
          <TouchableOpacity
            style={styles.pediatricBanner}
            onPress={() => router.push(`/(app)/pediatric/${protocol.id}`)}
            accessibilityRole="button"
            accessibilityLabel="Switch to Pediatric Version"
          >
            <MaterialCommunityIcons name="human-child" color={Colors.secondary} size={24} />
            <View style={styles.pediatricBannerTextContainer}>
              <Text style={styles.pediatricBannerTitle}>
                {t('[protocol].treating_a_child_or_infant') || 'Treating a child or infant?'}
              </Text>
              <Text style={styles.pediatricBannerSub}>
                {t('[protocol].view_pediatric_guidelines') || 'View pediatric guidelines'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <EmergencyStepCard
              key={step.id}
              step={step}
              stepIndex={index + 1}
              totalSteps={steps.length}
            />
          ))}
        </View>
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
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
    backgroundColor: Colors.surface,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.xl,
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: Colors.danger,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  callButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
  pediatricBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary + '15',
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  pediatricBannerTextContainer: {
    flex: 1,
  },
  pediatricBannerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.secondary,
  },
  pediatricBannerSub: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stepsContainer: {
    gap: Spacing.xs,
  },
});
