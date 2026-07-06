import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Input } from '../../../../src/components/ui/Input';
import { Button } from '../../../../src/components/ui/Button';
import { useAuthStore } from '../../../../src/store/authStore';
import { qnaService } from '../../../../src/services/api/qnaService';
import { doctorsService } from '../../../../src/services/api/doctorsService';
import { useTranslation } from 'react-i18next';

export default function AskQuestionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId) || 'patient-1';

  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(true);

  const [selectedDept, setSelectedDept] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const data = await doctorsService.getCategories();
        setDepartments(data);
      } catch {
        // silently ignore for mock
      } finally {
        setLoadingDeps(false);
      }
    };
    fetchDeps();
  }, []);

  const handleSubmit = async () => {
    if (!selectedDept || !content.trim()) return;

    try {
      setSubmitting(true);
      await qnaService.askQuestion(userId, selectedDept, content.trim());
      // On success, go back to QnA index
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to submit your question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('ask.ask_a_doctor') || 'Ask a Doctor'}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('ask.select_department') || 'Select Department'}
          </Text>
          <Text style={styles.sectionDesc}>
            {t('ask.route_your_question_to_the_rig') ||
              'Route your question to the right specialists.'}
          </Text>

          {loadingDeps ? (
            <ActivityIndicator style={styles.loader} color={Colors.primary} />
          ) : (
            <View style={styles.chipContainer}>
              {departments.map((dep) => {
                const isSelected = selectedDept === dep.name;
                return (
                  <TouchableOpacity
                    key={dep.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setSelectedDept(dep.name)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {dep.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ask.your_question') || 'Your Question'}</Text>
          <View style={styles.inputContainer}>
            <Input
              placeholder={
                t('ask.describe_your_symptoms_or_ask_') ||
                'Describe your symptoms or ask your medical question clearly...'
              }
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              editable={!submitting}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={t('ask.submit_question') || 'Submit Question'}
          onPress={handleSubmit}
          disabled={!selectedDept || !content.trim() || submitting}
          loading={submitting}
        />
      </View>
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
    width: 32, // to balance the back button
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  loader: {
    marginVertical: Spacing.lg,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  chipSelected: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.primary,
  },
  inputContainer: {
    marginTop: Spacing.sm,
  },
  footer: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
    ...Shadows.md,
  },
});
