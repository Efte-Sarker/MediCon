import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing, FontFamily, FontSize, Layout } from '../../../src/theme';
import { prescriptionsService } from '../../../src/services/api/prescriptionsService';
import { Prescription } from '../../../src/types/medical.types';
import { PrescriptionCard } from '../../../src/components/medical/PrescriptionCard';
import { AdherenceTracker } from '../../../src/components/medical/AdherenceTracker';

export default function PrescriptionsScreen() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await prescriptionsService.getPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      await loadData();
      if (isMounted) {
        setLoading(false);
        setRefreshing(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No active prescriptions.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Prescriptions</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlashList
            data={prescriptions}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => (
              <View style={styles.listHeader}>
                <AdherenceTracker />
                <Text style={styles.sectionTitle}>Active Prescriptions</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <PrescriptionCard
                prescription={item}
                onPress={() => router.push(`/(app)/prescriptions/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
              />
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Layout.tabBarHeight + Spacing.xl,
    paddingTop: Spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
});
