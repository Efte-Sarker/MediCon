// 1. IMPORTS
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontFamily, FontSize } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { doctorsService, Doctor } from '../../../src/services/api/doctorsService';
import { DoctorCard } from '../../../src/components/cards/DoctorCard';

// 2. TYPES
/* No external props */

// 3. COMPONENT
export default function DoctorsListScreen(): React.JSX.Element {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await doctorsService.getDoctors(category);
        setDoctors(data);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [category]);

  const renderItem = useCallback(
    ({ item }: { item: Doctor }) => (
      <View style={styles.cardWrapper}>
        <DoctorCard
          doctor={item}
          onPress={() => router.push(`/(app)/doctors/${item.id}`)}
          hideSectionLabel
        />
      </View>
    ),
    [router],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{category ? 'Specialists' : 'All Doctors'}</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : doctors.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="doctor" size={48} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>No doctors found</Text>
        </View>
      ) : (
        <FlashList
          data={doctors}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// 4. STYLES
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
    backgroundColor: Colors.surface,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerRight: {
    width: 24 + Spacing.xs * 2, // matches back button width to center title
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
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
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
