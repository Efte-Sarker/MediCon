import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Question } from '../../types/medical.types';
import { useTranslation } from 'react-i18next';

interface QuestionCardProps {
  question: Question;
  isDoctorView?: boolean;
}

const getTimeAgo = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h ago`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}m ago`;
};

export const QuestionCard = ({
  question,
  isDoctorView = false,
}: QuestionCardProps): React.JSX.Element => {
  const { t } = useTranslation();
  const isAnswered = question.answers.length > 0;
  const timeAgo = getTimeAgo(question.createdAt);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.badge, isAnswered ? styles.answeredBadge : styles.unansweredBadge]}>
            <Text
              style={[styles.badgeText, isAnswered ? styles.answeredText : styles.unansweredText]}
            >
              {isAnswered ? 'Answered' : 'Pending'}
            </Text>
          </View>
          <Text style={styles.department}>{question.department}</Text>
        </View>
        <Text style={styles.timestamp}>{timeAgo}</Text>
      </View>

      <Text style={styles.content}>{question.content}</Text>

      {isAnswered && (
        <View style={styles.answersContainer}>
          {question.answers.map((answer, index) => (
            <View key={answer.id} style={[styles.answerItem, index > 0 && styles.answerDivider]}>
              <View style={styles.answerHeader}>
                <MaterialCommunityIcons name="doctor" size={16} color={Colors.primary} />
                <Text style={styles.doctorName}>
                  {t('questioncard.doctor_response') || 'Doctor Response'}
                </Text>
              </View>
              <Text style={styles.answerContent}>{answer.content}</Text>
              <Text style={styles.answerTime}>{getTimeAgo(answer.createdAt)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  answeredBadge: {
    backgroundColor: Colors.success + '20',
  },
  unansweredBadge: {
    backgroundColor: Colors.warning + '20',
  },
  badgeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  answeredText: {
    color: Colors.success,
  },
  unansweredText: {
    color: Colors.warning,
  },
  department: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  timestamp: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  content: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  answersContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
  },
  answerItem: {
    gap: Spacing.xs,
  },
  answerDivider: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  doctorName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  answerContent: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  answerTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
});
