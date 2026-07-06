import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontFamily, FontSize } from '../../../../src/theme';
import { Avatar } from '../../../../src/components/ui/Avatar';

export default function DependentsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const dependents = [
    { id: 'dep-1', name: 'Jane Doe', relation: 'Spouse' },
    { id: 'dep-2', name: 'Jimmy Doe', relation: 'Child' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.list}>
        {dependents.map((dep) => (
          <TouchableOpacity
            key={dep.id}
            style={styles.item}
            onPress={() => router.push(`/(app)/settings/dependents/${dep.id}`)}
          >
            <View style={styles.itemLeft}>
              <Avatar name={dep.name} size={48} />
              <View style={styles.info}>
                <Text style={styles.name}>{dep.name}</Text>
                <Text style={styles.relation}>{dep.relation}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(app)/settings/dependents/new')}
      >
        <MaterialCommunityIcons name="plus" size={24} color={Colors.primary} />
        <Text style={styles.addText}>{t('dependents.add') || 'Add Dependent'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.tertiary,
    backgroundColor: Colors.surface,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: Spacing.md,
  },
  name: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  relation: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    marginTop: Spacing.xl,
  },
  addText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
});
