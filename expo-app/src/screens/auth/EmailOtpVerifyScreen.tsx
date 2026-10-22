import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { OTPInput } from '../../components/ui/OTPInput';
import { useAuthStore } from '../../store/authStore';
import { OTP_RESEND_COOLDOWN_SECONDS } from '../../services/auth/otpMappers';
import { AuthStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Colors,
  Spacing,
} from '../../design-system';
import { hapticError, hapticLight, hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'EmailOtpVerify'>;
  route: RouteProp<AuthStackParamList, 'EmailOtpVerify'>;
};

export const EmailOtpVerifyScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params;
  const verifyEmailOtp = useAuthStore((s) => s.verifyEmailOtp);
  const sendEmailOtp = useAuthStore((s) => s.sendEmailOtp);
  const authStatus = useAuthStore((s) => s.status);

  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(OTP_RESEND_COOLDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const loading = authStatus === 'loading';
  const otpValue = otpDigits.join('');
  const isOtpComplete = otpDigits.every((digit) => digit !== '');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResend = async () => {
    if (!canResend || loading) return;
    setError(undefined);
    void hapticLight();
    try {
      await sendEmailOtp(email, true);
      setTimer(OTP_RESEND_COOLDOWN_SECONDS);
      setCanResend(false);
      setOtpDigits(Array(6).fill(''));
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Unable to resend verification code. Please try again.';
      setError(message);
      void hapticError();
    }
  };

  const handleVerify = async () => {
    if (!isOtpComplete || !/^\d{6}$/.test(otpValue)) {
      setError('Please enter the 6-digit verification code');
      void hapticError();
      return;
    }

    setError(undefined);
    try {
      await verifyEmailOtp(email, otpValue);
      void hapticSuccess();
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Verification failed. Please check the code and try again.';
      setError(message);
      void hapticError();
    }
  };

  return (
    <Screen backgroundColor={Colors.surface}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hey Attrangi Logo Header */}
        <View style={styles.brandRow}>
          <View style={styles.logoGrid}>
            <View style={[styles.logoSquare, { backgroundColor: '#FFC107', borderTopLeftRadius: 3 }]} />
            <View style={[styles.logoSquare, { backgroundColor: '#FF5252', borderTopRightRadius: 3 }]} />
            <View style={[styles.logoSquare, { backgroundColor: '#FF9800', borderBottomLeftRadius: 3 }]} />
            <View style={[styles.logoSquare, { backgroundColor: '#E64A19', borderBottomRightRadius: 3 }]} />
          </View>
          <Text style={styles.brandTitle}>Hey Attrangi</Text>
        </View>

        {/* Back Link */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => {
            void hapticLight();
            navigation.goBack();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name={AppIcons.back} size={18} color={Colors.brandPrimary} />
          <Text variant="bodyMedium" color={Colors.brandPrimary} style={styles.backText}>
            Back
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Let's create your{'\n'}personal space.
          </Text>
          <Text style={styles.subtitle}>
            Verify the 6-digit code sent to your email.{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
        </View>

        {/* OTP Input Component */}
        <View style={styles.otpWrapper}>
          <OTPInput
            code={otpDigits}
            autoFocus
            onChangeCode={(code) => {
              setOtpDigits(code);
              if (error) setError(undefined);
            }}
            onComplete={() => {
              void hapticLight();
            }}
          />

          {error ? (
            <Text variant="caption" color={Colors.error} style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          <View style={styles.timerRow}>
            <TouchableOpacity
              onPress={() => {
                void hapticLight();
                navigation.goBack();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text variant="caption" color={Colors.brandPrimary} style={styles.changeEmailText}>
                ← Use a different email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResend}
              disabled={!canResend || loading}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                variant="caption"
                color={canResend ? Colors.brandPrimary : Colors.textMuted}
                style={canResend ? styles.resendActive : undefined}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            label="VERIFY & CONTINUE"
            onPress={handleVerify}
            disabled={!isOtpComplete || loading}
            loading={loading}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoGrid: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 8,
  },
  logoSquare: {
    width: 11,
    height: 11,
    margin: 0.5,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: 4,
  },
  backText: {
    fontWeight: '600',
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  emailHighlight: {
    fontWeight: '700',
  },
  otpWrapper: {
    marginVertical: Spacing.md,
  },
  errorText: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  changeEmailText: {
    fontWeight: '700',
  },
  resendActive: {
    fontWeight: '700',
  },
  actions: {
    marginTop: Spacing.lg,
    width: '100%',
  },
});
