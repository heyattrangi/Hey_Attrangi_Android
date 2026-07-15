import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput as RNTextInput } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Motion } from '../../theme';
import { hapticError, hapticLight } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;
};

/** Design 1.png — Welcome Back / Sign In */
export const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const authStatus = useAuthStore((s) => s.status);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const passwordRef = useRef<RNTextInput>(null);

  const loading = authStatus === 'loading';
  const canSubmit = emailOrPhone.trim().length > 0 && password.trim().length > 0 && !loading;

  const handleSignIn = async () => {
    const newErrors: typeof errors = {};
    if (!emailOrPhone.trim()) newErrors.email = 'Email or phone number is required';
    if (!password.trim()) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      void hapticError();
      return;
    }

    setErrors({});
    try {
      await login({
        isReturningUser: true,
        credentials: { emailOrPhone, password },
      });
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Sign in failed. Please check your credentials and try again.';
      setErrors({ email: message });
      void hapticError();
    }
  };

  const handleGoogleSignIn = async () => {
    setErrors({});
    try {
      await loginWithGoogle();
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Google sign-in failed. Please try again.';
      setErrors({ email: message });
      void hapticError();
    }
  };

  return (
    <OnboardingContainer
      glowPosition="topRight"
      onBackPress={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title="Welcome Back!"
            subtitle="Your companion for mental wellness"
          />
        </Animated.View>

        <Animated.View
          style={styles.form}
          entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        >
          <Input
            label="Email or phone"
            placeholder="Enter your email or phone number"
            value={emailOrPhone}
            onChangeText={(text) => {
              setEmailOrPhone(text);
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
            }}
            error={errors.email}
            autoFocus
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
            textContentType="username"
          />
          <PasswordInput
            ref={passwordRef}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
            }}
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (canSubmit) void handleSignIn();
            }}
            textContentType="password"
          />

          <Pressable
            style={styles.forgotPassword}
            onPress={() => {
              void hapticLight();
              navigation.navigate('ForgotPassword');
            }}
            accessibilityRole="link"
            accessibilityLabel="Forgot Password"
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          style={styles.actions}
          entering={FadeInUp.delay(140).duration(Motion.duration.normal)}
        >
          <PrimaryButton
            label="Sign In"
            onPress={handleSignIn}
            loading={loading}
            disabled={!canSubmit}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <SecondaryButton
            label="Continue with Google"
            onPress={handleGoogleSignIn}
            loading={loading}
            disabled={loading}
            icon={
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleLetter}>G</Text>
              </View>
            }
          />
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable
            onPress={() => {
              void hapticLight();
              navigation.navigate('SignUpBasic');
            }}
            accessibilityRole="link"
          >
            <Text style={styles.footerLink}>Create one</Text>
          </Pressable>
        </View>
      </View>
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  form: {
    marginTop: Spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.xs,
    marginBottom: Spacing.xs,
  },
  forgotPasswordText: {
    ...Typography.link,
    color: Colors.primary,
  },
  actions: {
    width: '100%',
    marginTop: Spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderDefault,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginHorizontal: Spacing.md,
    fontWeight: '600',
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  googleLetter: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandGoogle,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    flexWrap: 'wrap',
  },
  footerText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  footerLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
});
