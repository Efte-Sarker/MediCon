// 1. IMPORTS
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Layout, Shadows } from '@theme';
import { useAuthStore } from '../../../src/store/authStore';
import { qnaService } from '../../../src/services/api/qnaService';
import { doctorsService } from '../../../src/services/api/doctorsService';
import { QuestionCard } from '../../../src/components/medical/QuestionCard';
import { AnswerComposer } from '../../../src/components/medical/AnswerComposer';
import { Question } from '../../../src/types/medical.types';
import { createAppError, AppError } from '../../../src/utils/errors';
import { ErrorState } from '../../../src/components/ui/ErrorState';
import { useTranslation } from 'react-i18next';

// 2. TYPES
// (no additional types needed beyond imports)

// 3. COMPONENT
export default function QnaInboxScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId) || 'doctor-1';
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [department, setDepartment] = useState<string>('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const doc = await doctorsService.getDoctorDetails(userId);
      if (doc) {
        setDepartment(doc.department);
        const data = await qnaService.getDoctorInbox(doc.department);
        // Filter answers so the doctor only sees their own responses
        const filteredData = data.map((q) => ({
          ...q,
          answers: q.answers.filter((a) => a.doctorId === userId || a.doctorId === doc.name),
        }));
        setQuestions(filteredData);
      } else {
        throw new Error('Doctor not found');
      }
    } catch (err) {
      setError(createAppError('NETWORK_ERROR', String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleAnswer = async (questionId: string, content: string) => {
    try {
      setSubmittingId(questionId);
      const newAnswer = await qnaService.answerQuestion(questionId, userId, content);
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            return { ...q, answers: [...q.answers, newAnswer] };
          }
          return q;
        }),
      );
    } catch (err) {
      const e = createAppError('NETWORK_ERROR', String(err));
      alert(e.message);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.titleBold}>Q&A </Text>
          <Text style={styles.titleBold}>Inbox</Text>
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

      {/* Department Badge */}
      {department ? (
        <View style={styles.departmentRow}>
          <View style={styles.departmentBadge}>
            <MaterialCommunityIcons name="stethoscope" size={14} color={Colors.primary} />
            <Text style={styles.departmentText}>{department}</Text>
          </View>
        </View>
      ) : null}

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <ErrorState message={error.message} onRetry={loadData} />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <ScrollView contentContainerStyle={styles.listContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t('qna.patient_questions') || 'Patient Questions'}
              </Text>
            </View>
            {questions.length === 0 ? (
              <View style={styles.emptySection}>
                <MaterialCommunityIcons
                  name="inbox-outline"
                  size={28}
                  color={Colors.textTertiary}
                />
                <Text style={styles.emptyText}>
                  {t('qna.no_questions_in_your_department') ||
                    'No questions in your department inbox.'}
                </Text>
              </View>
            ) : (
              questions.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.questionItemWrapper}>
                    <QuestionCard 
                      question={item} 
                      onPress={() => {}} 
                      onEdit={() => {}} 
                      onDelete={() => {}} 
                    />
                    {item.answers.length === 0 && (
                      <View style={styles.composerWrapper}>
                        <AnswerComposer
                          loading={submittingId === item.id}
                          onSubmit={(content) => handleAnswer(item.id, content)}
                        />
                      </View>
                    )}
                  </View>
                  {index < questions.length - 1 && <View style={{ height: Spacing.xl }} />}
                </View>
              ))
            )}
          </ScrollView>
        </View>
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
    fontSize: FontSize.xxl,
    color: Colors.primary,
  },

  // --- Department Badge ---
  departmentRow: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  departmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    gap: Spacing.xs,
  },
  departmentText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },

  // --- Section Header ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },

  // --- List ---
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Layout.tabBarHeight + Spacing.xl,
    paddingTop: Spacing.md,
    flexGrow: 1,
  },

  // --- Empty State ---
  emptySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.base,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.5,
    flexShrink: 1,
  },

  // --- Question Items ---
  questionItemWrapper: {
    gap: Spacing.sm,
  },
  composerWrapper: {
    marginTop: -Spacing.xs,
  },

  // --- Loading / Error ---
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
});
