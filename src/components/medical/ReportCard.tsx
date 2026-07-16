import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Report } from '../../types/medical.types';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../theme';
import { useTranslation } from 'react-i18next';

interface ReportCardProps {
  report: Report;
  onPress: () => void;
}

export function ReportCard({ report, onPress }: ReportCardProps) {
  const { t } = useTranslation();
  // Determine if this report has any flagged biomarkers
  const hasFlagged = report.biomarkers?.some((b) => b.isFlagged);

  // Format the date nicely
  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={report.type === 'BLOOD_TEST' ? 'water' : 'file-document-outline'}
            size={24}
            color={Colors.primary}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {report.title}
          </Text>
          <Text style={styles.laboratory} numberOfLines={1}>
            {report.laboratory || 'Unknown Laboratory'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <MaterialCommunityIcons name="calendar" size={14} color={Colors.textSecondary} />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {hasFlagged && (
          <View style={styles.flaggedBadge}>
            <MaterialCommunityIcons name="alert-circle" size={14} color={Colors.danger} />
            <Text style={styles.flaggedText}>{t('reportcard.attention') || 'Attention'}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  laboratory: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.5,
  },
  flaggedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#FFE5E8', // Light red background
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  flaggedText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.danger,
    lineHeight: FontSize.xs * 1.5,
  },
});
