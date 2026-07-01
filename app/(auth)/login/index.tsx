// 1. IMPORTS
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, TextStyles } from '@theme';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useAuthStore } from '../../../src/store/authStore';
import { authService } from '../../../src/services/api/authService';
import { AuthPhoneForm } from '../../../src/components/forms/AuthPhoneForm';
import { AuthOTPForm } from '../../../src/components/forms/AuthOTPForm';

// 2. TYPES
type LoginStep = 'phone_entry' | 'otp_entry';

// 3. COMPONENT
export default function LoginScreen(): React.JSX.Element {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const setHasSeenOnboarding = useOnboardingStore((s) => s.setHasSeenOnboarding);

  const [step, setStep] = useState<LoginStep>('phone_entry');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSendOtp = async () => {
    setError(undefined);
    setIsLoading(true);
    try {
      await authService.sendOtp(phone);
      setStep('otp_entry');
    } catch (e: any) {
      setError(e.message ?? 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setError(undefined);
    setIsLoading(true);
    try {
      const result = await authService.verifyOtp(phone, otp);
      if (result.isNewUser) {
        // Navigate to registration with phone param
        router.replace({
          pathname: '/(auth)/register',
          params: { phone },
        });
      } else {
        // Existing user — log them in
        login({
          token: result.token,
          role: result.user.role,
          status: result.user.status,
          userId: result.user.id,
        });
        router.replace('/(app)/(tabs)');
      }
    } catch (e: any) {
      setError(e.message ?? 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(undefined);
    try {
      await authService.sendOtp(phone);
      Alert.alert('OTP Resent', `A new code has been sent to ${phone}.`);
    } catch (e: any) {
      setError(e.message ?? 'Failed to resend OTP');
    }
  };

  const handleDebugReset = () => {
    if (__DEV__) {
      setHasSeenOnboarding(false);
      Alert.alert(
        'QA Debug',
        'Onboarding flag has been reset. Reload the app to see the onboarding flow again.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Hidden debug trigger wrapped around the title */}
          <Pressable onLongPress={handleDebugReset} delayLongPress={1000}>
            <Text style={styles.title}>
              {step === 'phone_entry' ? 'Welcome Back' : 'Verify OTP'}
            </Text>
          </Pressable>

          <Text style={styles.subtitle}>
            {step === 'phone_entry'
              ? 'Enter your phone number to get started.'
              : 'We sent a verification code to your phone.'}
          </Text>

          <View style={styles.formWrapper}>
            {step === 'phone_entry' ? (
              <AuthPhoneForm
                phone={phone}
                onChangePhone={setPhone}
                onSubmit={handleSendOtp}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <AuthOTPForm
                phone={phone}
                onSubmit={handleVerifyOtp}
                isLoading={isLoading}
                error={error}
                onResend={handleResendOtp}
              />
            )}
          </View>

          {step === 'otp_entry' && (
            <Pressable
              onPress={() => {
                setStep('phone_entry');
                setError(undefined);
              }}
            >
              <Text style={styles.backLink}>← Change phone number</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 4. STYLES
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    ...TextStyles.h1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...TextStyles.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  backLink: {
    ...TextStyles.body,
    color: Colors.primary,
    marginTop: Spacing.lg,
  },
});
