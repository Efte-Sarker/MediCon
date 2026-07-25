// 1. IMPORTS
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize, Layout, BorderRadius, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// 2. TYPES
interface PatientMockData {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  condition: string;
  lastVisit: string;
  status: 'active' | 'inactive';
}

const MOCK_PATIENTS: PatientMockData[] = [
  {
    id: 'p1',
    name: 'Rahim Uddin',
    age: 45,
    gender: 'M',
    condition: 'Hypertension',
    lastVisit: 'Today',
    status: 'active',
  },
  {
    id: 'p2',
    name: 'Ayesha Rahman',
    age: 32,
    gender: 'F',
    condition: 'Type 2 Diabetes',
    lastVisit: 'Yesterday',
    status: 'active',
  },
  {
    id: 'p3',
    name: 'Kamal Hasan',
    age: 58,
    gender: 'M',
    condition: 'Chronic Back Pain',
    lastVisit: '2 days ago',
    status: 'active',
  },
  {
    id: 'p4',
    name: 'Nusrat Jahan',
    age: 27,
    gender: 'F',
    condition: 'Asthma',
    lastVisit: '1 week ago',
    status: 'active',
  },
  {
    id: 'p5',
    name: 'Jamal Bhuyan',
    age: 39,
    gender: 'M',
    condition: 'Anxiety Disorder',
    lastVisit: '2 weeks ago',
    status: 'inactive',
  },
  {
    id: 'p6',
    name: 'Farida Khanam',
    age: 51,
    gender: 'F',
    condition: 'Osteoarthritis',
    lastVisit: '3 days ago',
    status: 'active',
  },
  {
    id: 'p7',
    name: 'Tanvir Ahmed',
    age: 34,
    gender: 'M',
    condition: 'Migraine',
    lastVisit: '5 days ago',
    status: 'inactive',
  },
  {
    id: 'p8',
    name: 'Sabina Yasmin',
    age: 62,
    gender: 'F',
    condition: 'Coronary Artery Disease',
    lastVisit: 'Today',
    status: 'active',
  },
];

// 3. COMPONENT
export default function PatientsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_PATIENTS;
    return MOCK_PATIENTS.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.titleBold}>My </Text>
          <Text style={styles.titleBold}>Patients</Text>
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/settings/')}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          accessibilityLabel="Settings"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="account-outline" size={27.6} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients by name..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityRole="search"
            accessibilityLabel="Search patients"
          />
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('patients.recent_patients') || 'Recent Patients'}
        </Text>
        <Text style={styles.patientCount}>{filteredPatients.length} patients</Text>
      </View>

      {/* Patient List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredPatients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="account-search-outline"
              size={48}
              color={Colors.textTertiary}
            />
            <Text style={styles.emptyText}>
              {t('patients.no_patients_found') || 'No patients found matching your search.'}
            </Text>
          </View>
        ) : (
          filteredPatients.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.patientCard,
                index < filteredPatients.length - 1 && styles.patientCardGap,
              ]}
              activeOpacity={0.7}
              onPress={() => router.push('/(app)/doctor/patient/' + item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Patient ${item.name}, ${item.age} years old, ${item.condition}`}
            >
              {/* Avatar */}
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>

              {/* Patient Info */}
              <View style={styles.patientInfo}>
                <Text style={styles.patientName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.patientMeta} numberOfLines={1}>
                  {item.age} yrs •{' '}
                  {item.gender === 'M' ? 'Male' : item.gender === 'F' ? 'Female' : 'Other'}
                </Text>
                <Text style={styles.patientCondition} numberOfLines={1}>
                  {item.condition}
                </Text>
              </View>

              {/* Right side: last visit + status badge */}
              <View style={styles.rightSection}>
                <Text style={styles.visitDate}>{item.lastVisit}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'active' ? styles.statusActive : styles.statusInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'active'
                        ? styles.statusTextActive
                        : styles.statusTextInactive,
                    ]}
                  >
                    {item.status === 'active' ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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

  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    color: Colors.primary,
  },
  titleBold: {
    fontFamily: FontFamily.extraBold,
    fontWeight: '900',
  },

  // --- Search ---
  searchContainer: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },

  // --- Section Header ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  patientCount: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  // --- Scroll ---
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.xl,
    paddingTop: Spacing.md,
  },

  // --- Patient Card ---
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    ...Shadows.sm,
  },
  patientCardGap: {
    marginBottom: Spacing.md,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
  patientInfo: {
    flex: 1,
    gap: 2,
  },
  patientName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  patientMeta: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  patientCondition: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },

  // --- Right Section ---
  rightSection: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  visitDate: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusInactive: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  statusTextActive: {
    color: Colors.success,
  },
  statusTextInactive: {
    color: Colors.danger,
  },

  // --- Empty State ---
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    ...Shadows.sm,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.5,
  },
});
