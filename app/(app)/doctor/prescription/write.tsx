// 1. IMPORTS
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadows } from '@theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 2. TYPES
interface MedicineEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Three times', 'As needed'];

function makeEmptyMedicine(index: number): MedicineEntry {
  return {
    id: `med-${Date.now()}-${index}`,
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  };
}

// 3. COMPONENT
export default function WritePrescriptionScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { patientId, patientName } = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const [medicines, setMedicines] = useState<MedicineEntry[]>([makeEmptyMedicine(0)]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const addMedicine = () => {
    setMedicines((prev) => [...prev, makeEmptyMedicine(prev.length)]);
  };

  const updateMedicine = (id: string, field: keyof MedicineEntry, value: string) => {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
    if (validationError) setValidationError('');
  };

  const removeMedicine = (id: string) => {
    if (medicines.length <= 1) return;
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = async () => {
    const allFilled = medicines.every(
      (m) => m.name.trim() && m.dosage.trim() && m.frequency.trim() && m.duration.trim(),
    );
    if (!allFilled) {
      setValidationError(
        'Please fill in Medicine Name, Dosage, Frequency, and Duration for all medicines.',
      );
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);

    Alert.alert('Success', 'Prescription submitted successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        <Text style={styles.headerTitle}>Write Prescription</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Patient Info */}
        {patientName ? (
          <View style={styles.patientInfoCard}>
            <MaterialCommunityIcons name="account" size={20} color={Colors.primary} />
            <Text style={styles.patientInfoText}>
              Patient: <Text style={styles.patientInfoName}>{decodeURIComponent(patientName)}</Text>
            </Text>
          </View>
        ) : null}

        {/* Medicines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medicines</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={addMedicine}
              accessibilityRole="button"
              accessibilityLabel="Add medicine"
            >
              <MaterialCommunityIcons name="plus" size={18} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {medicines.map((medicine, index) => (
            <View key={medicine.id} style={styles.medicineCard}>
              {/* Medicine Card Header */}
              <View style={styles.medicineCardHeader}>
                <Text style={styles.medicineCardTitle}>Medicine #{index + 1}</Text>
                {medicines.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeMedicine(medicine.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove medicine ${index + 1}`}
                    style={styles.removeButton}
                  >
                    <MaterialCommunityIcons name="close" size={18} color={Colors.danger} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Medicine Name */}
              <Text style={styles.fieldLabel}>
                Medicine Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Amlodipine"
                placeholderTextColor={Colors.textTertiary}
                value={medicine.name}
                onChangeText={(v) => updateMedicine(medicine.id, 'name', v)}
                accessibilityLabel={`Medicine name for medicine ${index + 1}`}
              />

              {/* Dosage */}
              <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                Dosage <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 5mg"
                placeholderTextColor={Colors.textTertiary}
                value={medicine.dosage}
                onChangeText={(v) => updateMedicine(medicine.id, 'dosage', v)}
                accessibilityLabel={`Dosage for medicine ${index + 1}`}
              />

              {/* Frequency Chips */}
              <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                Frequency <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.chipRow}>
                {FREQUENCY_OPTIONS.map((freq) => {
                  const selected = medicine.frequency === freq;
                  return (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.freqChip,
                        selected ? styles.freqChipSelected : styles.freqChipUnselected,
                      ]}
                      onPress={() => updateMedicine(medicine.id, 'frequency', freq)}
                      accessibilityRole="radio"
                      accessibilityLabel={freq}
                      accessibilityState={{ checked: selected }}
                    >
                      <Text
                        style={[
                          styles.freqChipText,
                          selected ? styles.freqChipTextSelected : styles.freqChipTextUnselected,
                        ]}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Duration */}
              <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
                Duration <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 7 days"
                placeholderTextColor={Colors.textTertiary}
                value={medicine.duration}
                onChangeText={(v) => updateMedicine(medicine.id, 'duration', v)}
                accessibilityLabel={`Duration for medicine ${index + 1}`}
              />

              {/* Instructions */}
              <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Instructions</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                placeholder="e.g. Take with food (optional)"
                placeholderTextColor={Colors.textTertiary}
                value={medicine.instructions}
                onChangeText={(v) => updateMedicine(medicine.id, 'instructions', v)}
                multiline
                numberOfLines={2}
                accessibilityLabel={`Instructions for medicine ${index + 1}`}
              />
            </View>
          ))}
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
          </View>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline, { minHeight: 80 }]}
            placeholder="e.g. Monitor blood pressure daily. Return in 4 weeks."
            placeholderTextColor={Colors.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            accessibilityLabel="Additional notes"
          />
        </View>

        {/* Validation Error */}
        {validationError ? <Text style={styles.validationError}>{validationError}</Text> : null}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonLoading]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Submit prescription"
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.surface} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={Colors.surface}
              />
              <Text style={styles.submitButtonText}>Submit Prescription</Text>
            </>
          )}
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  patientInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  patientInfoText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  patientInfoName: {
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    minHeight: 32,
  },
  addButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  medicineCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  medicineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  medicineCardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  removeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  required: {
    color: Colors.danger,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.textTertiary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    height: 46,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  textInputMultiline: {
    height: 'auto',
    minHeight: 60,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  freqChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freqChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  freqChipUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.tertiary,
  },
  freqChipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
  },
  freqChipTextSelected: {
    color: Colors.surface,
  },
  freqChipTextUnselected: {
    color: Colors.textSecondary,
  },
  validationError: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.danger,
    marginTop: Spacing.md,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    minHeight: 56,
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  submitButtonLoading: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.surface,
  },
});
