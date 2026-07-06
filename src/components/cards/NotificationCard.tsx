import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SystemNotification } from '../../types/medical.types';
import { Colors, Spacing, FontFamily, FontSize, Shadows, BorderRadius } from '@theme';

interface NotificationCardProps {
  notification: SystemNotification;
  onToggleRead: (id: string) => void;
  onPress?: (notification: SystemNotification) => void;
}

export const NotificationCard = ({
  notification,
  onToggleRead,
  onPress,
}: NotificationCardProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'REMINDER':
        return 'clock-outline';
      case 'CONFIRMATION':
        return 'check-circle-outline';
      case 'QNA_ANSWER':
        return 'message-text-outline';
      case 'SYSTEM':
      default:
        return 'information-outline';
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'REMINDER':
        return Colors.warning;
      case 'CONFIRMATION':
        return Colors.success;
      case 'QNA_ANSWER':
        return Colors.primary;
      case 'SYSTEM':
      default:
        return Colors.secondary;
    }
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(notification.createdAt));

  return (
    <TouchableOpacity
      style={[
        styles.container,
        notification.isRead ? styles.containerRead : styles.containerUnread,
      ]}
      onPress={() => onPress?.(notification)}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole="button"
      accessibilityLabel={`Notification: ${notification.title}. ${notification.message}. ${
        notification.isRead ? 'Read' : 'Unread'
      }`}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
        <MaterialCommunityIcons name={getIcon()} size={24} color={getIconColor()} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.title, notification.isRead ? styles.textRead : styles.textUnread]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
        <Text
          style={[styles.message, notification.isRead ? styles.textRead : null]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => onToggleRead(notification.id)}
        accessibilityRole="button"
        accessibilityLabel={notification.isRead ? 'Mark as unread' : 'Mark as read'}
        testID={`toggle-read-${notification.id}`}
      >
        <MaterialCommunityIcons
          name={notification.isRead ? 'circle-outline' : 'circle'}
          size={24}
          color={notification.isRead ? Colors.textTertiary : Colors.primary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  containerUnread: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  containerRead: {
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    opacity: 0.8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  textUnread: {
    color: Colors.textPrimary,
  },
  textRead: {
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  toggleButton: {
    padding: Spacing.xs,
  },
});
