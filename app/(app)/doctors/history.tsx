// 1. IMPORTS
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontFamily, FontSize } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { doctorsService, ConsultationHistoryItem } from '../../../src/services/api/doctorsService';
import { Card } from '../../../src/components/ui/Card';

// 2. TYPES
/* No external props */

// 3. COMPONENT
export default function ConsultationHistoryScreen(): React.JSX.Element {
  const router = useRouter();

  const [history, setHistory] = useState<ConsultationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await doctorsService.getConsultationHistory();
        setHistory(data);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ConsultationHistoryItem }) => {
      const date = new Date(item.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      return (
        <View style={styles.cardWrapper}>
          <Card
            onPress={() => router.push(`/(app)/doctors/${item.doctorId}`)}
            accessibilityLabel={`Consultation with ${item.doctorName} on ${formattedDate}. Status: ${item.status}`}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === 'completed' ? styles.statusCompleted : styles.statusOther,
                ]}
              >
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="stethoscope" size={24} color={Colors.primary} />
              </View>
              <View style={styles.details}>
                <Text style={styles.doctorName}>{item.doctorName}</Text>
                <Text style={styles.specialty}>{item.specialty}</Text>
              </View>
            </View>
          </Card>
        </View>
      );
    },
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
        <Text style={styles.title}>History</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="history" size={48} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>No history found</Text>
          <Text style={styles.emptyText}>You haven't had any consultations yet.</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/(app)/(tabs)/doctors')}
          >
            <Text style={styles.exploreButtonText}>Find a Doctor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlashList
          data={history}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dateText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: Colors.success + '20', // 20% opacity
  },
  statusOther: {
    backgroundColor: Colors.tertiary,
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.textPrimary,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
  },
  doctorName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  specialty: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
});
