import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Biomarker } from '../../types/medical.types';
import { Colors, Spacing, FontFamily, FontSize } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BiomarkerRowProps {
  biomarker: Biomarker;
}

export function BiomarkerRow({ biomarker }: BiomarkerRowProps) {
  const valueColor = biomarker.isFlagged ? Colors.danger : Colors.textPrimary;

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        {biomarker.isFlagged && (
          <MaterialCommunityIcons
            name="alert-circle"
            size={16}
            color={Colors.danger}
            style={styles.icon}
          />
        )}
        <Text style={[styles.name, biomarker.isFlagged && styles.nameFlagged]}>
          {biomarker.name}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: valueColor }]}>{biomarker.value}</Text>
          <Text style={styles.unit}>{biomarker.unit}</Text>
        </View>
        <Text style={styles.reference}>Ref: {biomarker.referenceRange}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  name: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  nameFlagged: {
    color: Colors.danger,
    fontFamily: FontFamily.bold,
  },
  detailsContainer: {
    alignItems: 'flex-end',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  unit: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  reference: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
