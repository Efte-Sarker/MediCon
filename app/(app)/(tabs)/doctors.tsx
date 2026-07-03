// 1. IMPORTS
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Layout, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doctorsService } from '../../../src/services/api/doctorsService';

// 2. TYPES
type Category = {
  id: string;
  name: string;
  icon: string;
};

// 3. COMPONENT
export default function DoctorsScreen(): React.JSX.Element {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await doctorsService.getCategories();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Doctors Directory</Text>
          <Text style={styles.subtitle}>Find specialists and book appointments</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Links */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/(app)/doctors/history')}
          activeOpacity={0.8}
        >
          <View style={styles.historyContent}>
            <MaterialCommunityIcons name="history" size={24} color={Colors.primary} />
            <Text style={styles.historyText}>Consultation History</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Explore All */}
        <TouchableOpacity
          style={styles.exploreAllButton}
          onPress={() => router.push('/(app)/doctors/')}
          activeOpacity={0.8}
        >
          <Text style={styles.exploreAllText}>Explore All Doctors</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color={Colors.surface} />
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{ marginTop: Spacing.xl }}
            />
          ) : (
            <View style={styles.grid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.gridItem}
                  onPress={() => router.push(`/(app)/doctors/?category=${category.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={category.icon as any}
                      size={28}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={2}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.xl,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  historyText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  exploreAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  exploreAllText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridItem: {
    width: '47%', // roughly half width with gap
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
