import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontFamily, FontSize, Shadows } from '@theme';
import { useAuthStore } from '../../../../src/store/authStore';
import { qnaService } from '../../../../src/services/api/qnaService';
import { doctorsService } from '../../../../src/services/api/doctorsService';
import { QuestionCard } from '../../../../src/components/medical/QuestionCard';
import { AnswerComposer } from '../../../../src/components/medical/AnswerComposer';
import { Question } from '../../../../src/types/medical.types';
import { createAppError, AppError } from '../../../../src/utils/errors';
import { ErrorState } from '../../../../src/components/ui/ErrorState';
import { useTranslation } from 'react-i18next';

export default function QnaIndexScreen() {
  const role = useAuthStore((s) => s.role);

  if (role === 'doctor') {
    return <DoctorInboxScreen />;
  }

  // Enforces DoD: Patient session cannot navigate into Doctor inbox
  return <PatientQnAScreen />;
}

// ------------------------------------------------------------------
// PATIENT VIEW
// ------------------------------------------------------------------
function PatientQnAScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId) || 'patient-1';
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await qnaService.getPatientQuestions(userId);
      setQuestions(data);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('qna.my_questions') || 'My Questions'}</Text>
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
            data={questions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="chat-question-outline"
                  size={48}
                  color={Colors.textTertiary}
                />
                <Text style={styles.emptyText}>
                  {t('qna.you_havent_asked_any_questions') ||
                    "You haven't asked any questions yet."}
                </Text>
              </View>
            )}
            renderItem={({ item }) => <QuestionCard question={item} />}
          />
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(app)/doctors/qna/ask')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Ask a new question"
      >
        <MaterialCommunityIcons name="plus" size={28} color={Colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------------
// DOCTOR INBOX VIEW
// ------------------------------------------------------------------
function DoctorInboxScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId) || 'doctor-1'; // fallback to mock doctor
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [department, setDepartment] = useState<string>('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch doctor details to get their department
      const doc = await doctorsService.getDoctorDetails(userId);
      if (doc) {
        setDepartment(doc.department);
        const data = await qnaService.getDoctorInbox(doc.department);
        setQuestions(data);
      } else {
        throw new Error('Doctor not found');
      }
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

  const handleAnswer = async (questionId: string, content: string) => {
    try {
      setSubmittingId(questionId);
      const newAnswer = await qnaService.answerQuestion(questionId, userId, content);

      // Optimistically update the list
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
      // could use Alert.alert here, but simple alert is fine
      alert(e.message);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('qna.department_inbox') || 'Department Inbox'}</Text>
          {department ? <Text style={styles.headerSubtitle}>{department}</Text> : null}
        </View>
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
            data={questions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.xl }} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="inbox-outline"
                  size={48}
                  color={Colors.textTertiary}
                />
                <Text style={styles.emptyText}>
                  {t('qna.no_questions_in_your_departmen') ||
                    'No questions in your department inbox.'}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.questionItemWrapper}>
                <QuestionCard question={item} isDoctorView />
                {item.answers.length === 0 && (
                  <View style={styles.composerWrapper}>
                    <AnswerComposer
                      loading={submittingId === item.id}
                      onSubmit={(content) => handleAnswer(item.id, content)}
                    />
                  </View>
                )}
              </View>
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  headerRight: {
    width: 32, // to balance the back button
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
  fab: {
    position: 'absolute',
    bottom: Spacing.xxl,
    right: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
    elevation: 5,
  },
  questionItemWrapper: {
    gap: Spacing.md,
  },
  composerWrapper: {
    // slight inset or just match card styles to attach it visually
    marginTop: -Spacing.sm,
  },
});
