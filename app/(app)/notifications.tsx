import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontFamily, FontSize } from '@theme';
import { useAuthStore } from '../../src/store/authStore';
import { notificationsListService } from '../../src/services/notifications/notificationsListService';
import { NotificationCard } from '../../src/components/cards/NotificationCard';
import { SystemNotification } from '../../src/types/medical.types';
import { createAppError, AppError } from '../../src/utils/errors';
import { ErrorState } from '../../src/components/ui/ErrorState';
import { useTranslation } from 'react-i18next';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId) || 'patient-1'; // Default for mock
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationsListService.getNotifications(userId);
      setNotifications(data);
    } catch (err) {
      setError(createAppError('NETWORK_ERROR', String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleToggleRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)));
      await notificationsListService.markAsRead(id);
    } catch (err) {
      // Revert on error
      const e = createAppError('NETWORK_ERROR', String(err));
      alert(e.message);
      loadData();
    }
  };

  const handlePress = (notification: SystemNotification) => {
    if (!notification.isRead) {
      handleToggleRead(notification.id);
    }
    if (notification.actionUrl) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(notification.actionUrl as any);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications.title') || 'Notifications'}</Text>
        <View style={styles.headerRight} />
      </View>

      {loading && !error ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <ErrorState message={error.message} onRetry={loadData} />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlashList
            data={notifications}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="bell-off-outline"
                  size={48}
                  color={Colors.textTertiary}
                />
                <Text style={styles.emptyText}>
                  {t('notifications.empty') || 'You have no notifications.'}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <NotificationCard
                notification={item}
                onToggleRead={handleToggleRead}
                onPress={handlePress}
              />
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl * 3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
