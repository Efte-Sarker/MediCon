import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Layout, Shadows } from '@theme';
import { EMERGENCY_PROTOCOLS } from '../../../src/services/protocols/emergency-protocols.data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const IconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  activity: 'heart-pulse',
  'user-x': 'account-remove',
  droplet: 'water',
  flame: 'fire',
  'alert-triangle': 'alert',
  sun: 'white-balance-sunny',
  thermometer: 'thermometer',
  bed: 'bed',
};

export default function EmergencyTriageScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Sort protocols: Call emergency services first, then the rest.
  const protocols = Object.values(EMERGENCY_PROTOCOLS).sort(
    (a, b) => Number(b.callEmergencyServices) - Number(a.callEmergencyServices),
  );

  const renderItem = ({ item }: { item: (typeof protocols)[0] }) => {
    const iconName = IconMap[item.iconName] || 'alert';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(app)/emergency/${item.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}. ${item.description}`}
        accessibilityHint="Double tap to open this emergency protocol"
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <MaterialCommunityIcons name={iconName} color={item.color} size={28} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          {item.callEmergencyServices && (
            <View
              style={styles.callBadge}
              accessibilityLabel="Calling emergency services may be required"
            >
              <MaterialCommunityIcons name="phone" color={Colors.danger} size={12} />
              <Text style={styles.callBadgeText}>{t('emergency.call_911') || 'Call 911'}</Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons name="chevron-right" color={Colors.textTertiary} size={24} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          {t('emergency.emergency_triage') || 'Emergency Triage'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t('emergency.select_a_situation_for_immedia') ||
            'Select a situation for immediate offline guidance'}
        </Text>
      </View>

      <FlatList
        data={protocols}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.danger,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  cardContent: {
    flex: 1,
    marginRight: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: FontSize.sm * 1.5,
  },
  callBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.danger + '10',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  callBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.danger,
  },
});
