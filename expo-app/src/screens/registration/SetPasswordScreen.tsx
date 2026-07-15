import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput as RNTextInput } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { PasswordRequirements } from '../../components/common/PasswordRequirements';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useOnboardingStore } from '../../store/onboardingStore';
import { AuthStackParamList } from '../../navigation/types';
import { Spacing, Motion } from '../../theme';
import { hapticError, hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SetPassword'>;
};

const SPECIAL = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/;'`~]/;

/** Design 5.png — Set your password (step 3/4) */
export const SetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { password, confirmPassword, setField } = useOnboardingStore();
  const [errors, setErrors] = useState<{ confirm?: string }>({});
  const confirmRef = useRef<RNTextInput>(null);

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = SPECIAL.test(password);
  const isCriteriaMet = hasMinLength && hasNumber && hasSpecialChar;
  const hasConfirmInput = confirmPassword.length > 0;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordsMismatch = hasConfirmInput && password !== confirmPassword;
  const canContinue = isCriteriaMet && passwordsMatch;

  const handleContinue = () => {
    if (!isCriteriaMet) {
      void hapticError();
      return;
    }
    if (!passwordsMatch) {
      setErrors({ confirm: 'Passwords do not match' });
      void hapticError();
      return;
    }

    setErrors({});
    void hapticSuccess();
    navigation.navigate('TrustedContact');
  };

  return (
    <OnboardingContainer
      showProgress
      currentStep={3}
      totalSteps={4}
      onBackPress={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title="Set your password"
            subtitle="Ensure privacy by creating a strong password"
            centered
          />
        </Animated.View>

        <Animated.View
          style={styles.form}
          entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        >
          <PasswordInput
            label="Create password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setField('password', text);
              if (errors.confirm) setErrors({});
            }}
            showToggle
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            blurOnSubmit={false}
            textContentType="newPassword"
          />

          <PasswordRequirements password={password} />

          <PasswordInput
            ref={confirmRef}
            label="Confirm password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(text) => {
              setField('confirmPassword', text);
              if (errors.confirm) setErrors({});
            }}
            showToggle
            success={passwordsMatch}
            error={
              passwordsMismatch
                ? errors.confirm || 'Passwords do not match'
                : errors.confirm
            }
            returnKeyType="done"
            onSubmitEditing={() => {
              if (canContinue) handleContinue();
            }}
            textContentType="newPassword"
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
    marginTop: Spacing.md,
    flexGrow: 1,
  },
  footer: {
    marginTop: 'auto',
    width: '100%',
    paddingTop: Spacing.md,
  },
});
