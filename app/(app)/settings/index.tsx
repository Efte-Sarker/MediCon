import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../src/store/authStore';
import { Colors, Spacing, FontFamily, FontSize } from '../../../src/theme';

const MenuItem = ({ icon, title, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <MaterialCommunityIcons name={icon} size={24} color={Colors.primary} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <MenuItem
          icon="account-outline"
          title={t('settings.profile') || 'Profile'}
          onPress={() => router.push('/(app)/settings/profile')}
        />
        <MenuItem
          icon="account-group-outline"
          title={t('settings.dependents') || 'Dependents'}
          onPress={() => router.push('/(app)/settings/dependents/')}
        />
        <MenuItem
          icon="translate"
          title={t('settings.language') || 'Language'}
          onPress={() => router.push('/(app)/settings/language')}
        />
      </View>

      {__DEV__ && (
        <View style={styles.section}>
          <MenuItem
            icon="hammer-wrench"
            title="Developer Settings (QA)"
            onPress={() => router.push('/(app)/settings/dev')}
          />
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t('settings.logout') || 'Log out'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.tertiary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.danger,
  },
});
