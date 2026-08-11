import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput as RNTextInput, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Input,
  Colors,
  Typography,
  Spacing,
  Radii,
} from '../../design-system';
import { hapticError, hapticLight } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;
};

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
    <Screen backgroundColor={Colors.surface}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Back Link */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => {
            void hapticLight();
            navigation.goBack();
          }}
        >
          <Icon name={AppIcons.back} size={18} color={Colors.brandPrimary} />
          <Text variant="bodyMedium" color={Colors.brandPrimary} style={styles.backText}>
            Back
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text variant="heading1" style={styles.title}>
            Login or Signup to Hey Attrangi
          </Text>
          <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
            Enter your email address to continue your mental wellness journey.
          </Text>
        </View>

        {/* Form Controls */}
        <View style={styles.form}>
          <Input
            label="Email or phone"
            placeholder="Email address"
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

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
            }}
            error={errors.password}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={() => {
              if (canSubmit) void handleSignIn();
            }}
            textContentType="password"
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {
              void hapticLight();
              navigation.navigate('ForgotPassword');
            }}
          >
            <Text variant="caption" color={Colors.brandPrimary} style={styles.forgotText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            label="CONTINUE"
            onPress={handleSignIn}
            loading={loading}
            disabled={!canSubmit}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text variant="caption" color={Colors.textMuted} style={styles.dividerText}>
              OR
            </Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            variant="secondary"
            label="Continue with Google"
            onPress={handleGoogleSignIn}
            loading={loading}
            disabled={loading}
            icon={
              <View style={styles.googleIconCircle}>
                <Text style={styles.googleLetter}>G</Text>
              </View>
            }
          />

          <Button
            variant="ghost"
            label="Sign in with email code"
            onPress={() => {
              void hapticLight();
              navigation.navigate('EmailOtpSignIn');
            }}
            disabled={loading}
            style={styles.otpBtn}
          />
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text variant="bodyMedium" color={Colors.textSecondary}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              void hapticLight();
              navigation.navigate('SignUpBasic');
            }}
          >
            <Text variant="bodyMedium" color={Colors.brandPrimary} style={styles.createLink}>
              Create one
            </Text>
          </TouchableOpacity>
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
  form: {
    marginBottom: Spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    fontWeight: '700',
  },
  actions: {
    gap: Spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderDefault,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  googleIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  googleLetter: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brandGoogle,
  },
  otpBtn: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  createLink: {
    fontWeight: '800',
  },
});
