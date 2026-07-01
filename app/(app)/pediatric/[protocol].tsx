import React, { useState } from 'react';
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

export default function PediatricProtocolScreen() {
  const { protocol: protocolId } = useLocalSearchParams<{ protocol: string }>();
  const router = useRouter();
  const [ageBand, setAgeBand] = useState<'child' | 'infant'>('child');

  const protocol = EMERGENCY_PROTOCOLS[protocolId];

  if (!protocol) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Protocol not found.</Text>
      </SafeAreaView>
    );
  }

  const steps = getProtocolStepsForAge(protocol, ageBand);

  // Check if there's actually a difference from adult (for information banner)
  const hasSpecificVariant =
    ageBand === 'child' ? Boolean(protocol.steps.child) : Boolean(protocol.steps.infant);

  const handleCall911 = () => {
    Linking.openURL('tel:911').catch(() => {});
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

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, ageBand === 'child' && styles.activeTab]}
          onPress={() => setAgeBand('child')}
          accessibilityRole="button"
          accessibilityState={{ selected: ageBand === 'child' }}
        >
          <Text style={[styles.tabText, ageBand === 'child' && styles.activeTabText]}>
            Child (1 yr - Puberty)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, ageBand === 'infant' && styles.activeTab]}
          onPress={() => setAgeBand('infant')}
          accessibilityRole="button"
          accessibilityState={{ selected: ageBand === 'infant' }}
        >
          <Text style={[styles.tabText, ageBand === 'infant' && styles.activeTabText]}>
            Infant (Under 1 yr)
          </Text>
        </TouchableOpacity>
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
            <Text style={styles.callButtonText}>Call 911 Now</Text>
          </TouchableOpacity>
        )}

        {!hasSpecificVariant && (
          <View style={styles.infoBanner}>
            <MaterialCommunityIcons name="information" color={Colors.secondary} size={20} />
            <Text style={styles.infoBannerText}>Standard protocol applies for this age group.</Text>
          </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.secondary,
  },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  activeTabText: {
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.secondary,
  },
  stepsContainer: {
    gap: Spacing.xs,
  },
});
