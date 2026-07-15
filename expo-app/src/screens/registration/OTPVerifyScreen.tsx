import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { OTPInput } from '../../components/ui/OTPInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { OTP_RESEND_COOLDOWN_SECONDS } from '../../services/auth/otpMappers';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Motion } from '../../theme';
import { hapticError, hapticLight, hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'OTPVerify'>;
};

/** Design 4.png — 6 digit code (step 2/4) */
export const OTPVerifyScreen: React.FC<Props> = ({ navigation }) => {
  const { phone, countryCode, otpDigits, setField } = useOnboardingStore();
  const verifyRegistrationOtp = useAuthStore((s) => s.verifyRegistrationOtp);
  const resendRegistrationOtp = useAuthStore((s) => s.resendRegistrationOtp);
  const authStatus = useAuthStore((s) => s.status);

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

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `0${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleResend = async () => {
    if (!canResend || !phone.trim() || loading) return;
    setError(undefined);
    void hapticLight();
    try {
      await resendRegistrationOtp(phone, countryCode);
      setTimer(OTP_RESEND_COOLDOWN_SECONDS);
      setCanResend(false);
      setField('otpDigits', Array(6).fill(''));
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Unable to resend verification code. Please try again.';
      setError(message);
      void hapticError();
    }
  };

  const handleContinue = async () => {
    if (!isOtpComplete || !/^\d{6}$/.test(otpValue)) {
      setError('Please enter the 6-digit verification code');
      void hapticError();
      return;
    }

    setError(undefined);
    try {
      await verifyRegistrationOtp(phone, otpDigits, countryCode);
      setField('phoneVerified', true);
      void hapticSuccess();
      navigation.navigate('SetPassword');
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Verification failed. Please check the code and try again.';
      setError(message);
      void hapticError();
    }
  };

  const formattedPhone = phone ? `${countryCode} ${phone}` : countryCode;

  return (
    <OnboardingContainer
      showProgress
      currentStep={2}
      totalSteps={4}
      onBackPress={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title="6 digit code"
            subtitle={`A 6 digit code sent to ${formattedPhone}`}
            centered
          />
        </Animated.View>

        <Animated.View
          style={styles.content}
          entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        >
          <OTPInput
            code={otpDigits}
            autoFocus
            onChangeCode={(code) => {
              setField('otpDigits', code);
              if (error) setError(undefined);
            }}
            onComplete={() => {
              // Soft cue when all digits filled — user still taps Continue
              void hapticLight();
            }}
          />

          {error ? (
            <Text style={styles.errorText} accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}

          <View style={styles.timerColumn}>
            {canResend ? (
              <Pressable
                onPress={handleResend}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Resend code"
              >
                <Text style={styles.resendLink}>Resend code</Text>
              </Pressable>
            ) : (
              <Text style={styles.timerText}>Resend code in {formatTimer(timer)}</Text>
            )}

            <Pressable
              onPress={() => {
                void hapticLight();
                navigation.navigate('SignUpBasic');
              }}
              accessibilityRole="button"
              accessibilityLabel="Change number"
            >
              <Text style={styles.changeNumText}>Change number?</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(160).duration(Motion.duration.normal)}
        >
          <PrimaryButton
            label="Continue"
            onPress={handleContinue}
            showArrow
            disabled={!isOtpComplete || loading}
            loading={loading}
          />
        </Animated.View>
      </View>
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  content: {
    marginTop: Spacing.md,
    flexGrow: 1,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  timerColumn: {
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
  },
  timerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resendLink: {
    ...Typography.link,
    color: Colors.primary,
    fontWeight: '600',
  },
  changeNumText: {
    ...Typography.link,
    color: Colors.primary,
    marginTop: Spacing.sm,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    width: '100%',
    paddingTop: Spacing.md,
  },
});
