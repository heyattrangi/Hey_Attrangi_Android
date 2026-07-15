import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput as RNTextInput } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { TextInput } from '../../components/common/TextInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { AuthStackParamList } from '../../navigation/types';
import { Spacing, Motion } from '../../theme';
import { hapticError } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUpBasic'>;
};

/** Design 3.png — Sign up for free (step 1/4) */
export const SignUpBasicScreen: React.FC<Props> = ({ navigation }) => {
  const { name, phone, countryCode, setField } = useOnboardingStore();
  const sendRegistrationOtp = useAuthStore((s) => s.sendRegistrationOtp);
  const authStatus = useAuthStore((s) => s.status);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const phoneRef = useRef<RNTextInput>(null);

  const loading = authStatus === 'loading';
  const canContinue = name.trim().length > 0 && phone.trim().length >= 10 && !loading;

  const handleContinue = async () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      void hapticError();
      return;
    }

    setErrors({});
    setField('phoneVerified', false);
    setField('otpVerificationToken', null);
    setField('otpDigits', Array(6).fill(''));

    try {
      await sendRegistrationOtp(phone, countryCode);
      navigation.navigate('OTPVerify');
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Unable to send verification code. Please try again.';
      setErrors({ phone: message });
      void hapticError();
    }
  };

  return (
    <OnboardingContainer
      showProgress
      currentStep={1}
      totalSteps={4}
      onBackPress={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader title="Sign up for free!" centered />
        </Animated.View>

        <Animated.View
          style={styles.form}
          entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        >
          <TextInput
            label="Enter Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => {
              setField('name', text);
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
            }}
            error={errors.name}
            autoFocus
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            blurOnSubmit={false}
          />

          <TextInput
            ref={phoneRef}
            label="Enter phone number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={(text) => {
              setField('phone', text.replace(/[^0-9]/g, '').slice(0, 10));
              if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
            }}
            prefix="+91"
            keyboardType="phone-pad"
            error={errors.phone}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (canContinue) void handleContinue();
            }}
            maxLength={10}
          />
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(160).duration(Motion.duration.normal)}
        >
          <PrimaryButton
            label="Continue"
            onPress={handleContinue}
            showArrow
            disabled={!canContinue}
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
  form: {
    marginTop: Spacing.lg,
    flexGrow: 1,
  },
  footer: {
    marginTop: 'auto',
    width: '100%',
    paddingTop: Spacing.md,
  },
});
