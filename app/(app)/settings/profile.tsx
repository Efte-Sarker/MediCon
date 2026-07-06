import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontFamily, FontSize } from '../../../src/theme';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('profile.fullName') || 'Full Name'}</Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder={t('profile.fullNamePlaceholder') || 'Enter your full name'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('profile.phone') || 'Phone Number'}</Text>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder={t('profile.phonePlaceholder') || 'Enter your phone number'}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.actions}>
          <Button
            label={t('common.save') || 'Save Changes'}
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  form: {
    padding: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  actions: {
    marginTop: Spacing.xl,
  },
});
