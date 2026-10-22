import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput as RNTextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/app/Icon';
import { AccountExistenceModal } from '../../components/auth/AccountExistenceModal';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../navigation/types';
import { Text, Radii, Spacing } from '../../design-system';
import { getUserFriendlyErrorMessage } from '../../types/errors';
import { hapticError, hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;
  route?: RouteProp<AuthStackParamList, 'SignIn'>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isAccountExistsError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes('already exists') ||
    lower.includes('already registered') ||
    lower.includes('email is taken') ||
    lower.includes('user_exists') ||
    lower.includes('account exists')
  );
}

function isAccountNotFoundError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes('not found') ||
    lower.includes('no account') ||
    lower.includes('user does not exist') ||
    lower.includes('unregistered') ||
    lower.includes('account_not_found') ||
    lower.includes('invalid credentials')
  );
}

export const SignInScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loginWithApple = useAuthStore((s) => s.loginWithApple);
  const sendEmailOtp = useAuthStore((s) => s.sendEmailOtp);
  const authStatus = useAuthStore((s) => s.status);

  const initialMode = route?.params?.mode ?? 'signin';
  const initialEmail = route?.params?.email ?? '';

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [emailOrPhone, setEmailOrPhone] = useState(initialEmail);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const [modalState, setModalState] = useState<{
    visible: boolean;
    type: 'account_exists' | 'account_not_found' | 'error';
    title?: string;
    message?: string;
  }>({ visible: false, type: 'account_exists' });

  const loading = authStatus === 'loading';
  const canSubmit = emailOrPhone.trim().length > 0 && !loading;

  const handleContinue = async () => {
    const trimmedEmail = emailOrPhone.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrors({ email: 'Please enter your email address.' });
      void hapticError();
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrors({ email: 'Please enter a valid email address.' });
      void hapticError();
      return;
    }

    setErrors({});
    void hapticSelection();

    try {
      await sendEmailOtp(trimmedEmail);
      navigation.navigate('EmailOtpVerify', { email: trimmedEmail, mode: authMode });
    } catch (err: any) {
      const rawMessage =
        err?.message ??
        useAuthStore.getState().error?.message ??
        '';

      void hapticError();

      if (authMode === 'signup' && isAccountExistsError(rawMessage)) {
        setModalState({
          visible: true,
          type: 'account_exists',
          title: 'Looks like you already have an account',
          message: 'An account with this email already exists. Please log in to continue.',
        });
        return;
      }

      if (authMode === 'signin' && isAccountNotFoundError(rawMessage)) {
        setModalState({
          visible: true,
          type: 'account_not_found',
          title: 'No account found',
          message: "We couldn't find an account with this email. Would you like to create one?",
        });
        return;
      }

      const friendlyMsg = getUserFriendlyErrorMessage(err);
      setErrors({ email: friendlyMsg });
    }
  };

  const handleGoogleSignIn = async () => {
    setErrors({});
    void hapticSelection();
    try {
      await loginWithGoogle();
      void hapticSuccess();
    } catch (err: any) {
      const rawMessage =
        err?.message ??
        useAuthStore.getState().error?.message ??
        '';

      void hapticError();

      if (isAccountExistsError(rawMessage)) {
        setModalState({
          visible: true,
          type: 'account_exists',
          title: 'Looks like you already have an account',
          message: 'Please log in with this account to continue.',
        });
        return;
      }

      if (isAccountNotFoundError(rawMessage)) {
        setModalState({
          visible: true,
          type: 'account_not_found',
          title: 'No account found',
          message: "We couldn't find an account associated with this Google login. Would you like to create one?",
        });
        return;
      }

      const friendlyMsg = getUserFriendlyErrorMessage(err);
      setErrors({ email: friendlyMsg });
    }
  };

  const handleAppleSignIn = async () => {
    setErrors({});
    void hapticSelection();
    try {
      await loginWithApple();
      void hapticSuccess();
    } catch (err: any) {
      if (err?.message?.includes('cancelled') || err?.message?.includes('canceled')) {
        return;
      }
      void hapticError();
      const friendlyMsg = getUserFriendlyErrorMessage(err);
      setErrors({ email: friendlyMsg });
    }
  };

  const handleModalPrimary = () => {
    const currentType = modalState.type;
    setModalState((prev) => ({ ...prev, visible: false }));

    if (currentType === 'account_exists') {
      void hapticLight();
      setAuthMode('signin');
    } else if (currentType === 'account_not_found') {
      void hapticLight();
      setAuthMode('signup');
    }
  };

  const handleModalSecondary = () => {
    setModalState((prev) => ({ ...prev, visible: false }));
    void hapticLight();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Main Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {authMode === 'signup'
                ? 'Create your\npersonal space.'
                : "Welcome back to\nyour space."}
            </Text>
            <Text style={styles.subtitle}>
              {authMode === 'signup'
                ? 'Enter your email address to get started with Hey Attrangi.'
                : 'Enter your email address to continue your mental wellness journey.'}
            </Text>
          </View>

          {/* Input Form */}
          <View style={styles.form}>
            <View style={[styles.inputBox, errors.email ? styles.inputBoxError : null]}>
              <RNTextInput
                style={styles.textInput}
                placeholder="Email address"
                placeholderTextColor="#94A3B8"
                value={emailOrPhone}
                onChangeText={(text) => {
                  setEmailOrPhone(text);
                  if (errors.email) setErrors({});
                }}
                autoFocus
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="go"
                onSubmitEditing={handleContinue}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {/* Primary Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueBtn,
                (!canSubmit || loading) && styles.continueBtnDisabled,
              ]}
              onPress={handleContinue}
              disabled={!canSubmit || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.continueBtnText}>
                  {authMode === 'signup' ? 'CREATE ACCOUNT' : 'LOG IN'}
                </Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign-In Button */}
            <TouchableOpacity
              style={[
                styles.googleBtn,
                Platform.OS === 'ios' && styles.socialBtnIos,
                loading && { opacity: 0.6 },
              ]}
              onPress={handleGoogleSignIn}
              disabled={loading}
              activeOpacity={0.85}
            >
              <View style={styles.googleBadge}>
                <Icon name="google" size={18} color="#FF7D5C" />
              </View>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Apple Sign-In Button (iOS only) */}
            {Platform.OS === 'ios' && (
              <View style={styles.appleBtnContainer}>
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={25}
                  style={styles.appleBtn}
                  onPress={handleAppleSignIn}
                />
              </View>
            )}

            {/* Two-Way Mode Switcher Link */}
            <TouchableOpacity
              style={styles.modeSwitchRow}
              onPress={() => {
                void hapticLight();
                setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
                setErrors({});
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.modeSwitchText}>
                {authMode === 'signin'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <Text style={styles.modeSwitchLink}>
                  {authMode === 'signin' ? 'Create account' : 'Log in'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Smart Account Existence Dialog */}
      <AccountExistenceModal
        visible={modalState.visible}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onPrimaryPress={handleModalPrimary}
        onSecondaryPress={handleModalSecondary}
        onDismiss={handleModalSecondary}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
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
    marginBottom: 20,
    gap: 4,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF7D5C',
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF7D5C',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0E1726',
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  form: {
    marginBottom: 20,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputBoxError: {
    borderColor: '#EF4444',
  },
  textInput: {
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '600',
  },
  actions: {
    gap: 14,
  },
  continueBtn: {
    backgroundColor: '#FF7D5C',
    borderRadius: Radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7D5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  continueBtnDisabled: {
    backgroundColor: '#FF7D5C',
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  googleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0E1726',
  },
  socialBtnIos: {
    height: 50,
    borderRadius: 25,
    paddingVertical: 0,
  },
  appleBtnContainer: {
    width: '100%',
    marginTop: 0,
  },
  appleBtn: {
    width: '100%',
    height: 50,
  },
  modeSwitchRow: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  modeSwitchText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  modeSwitchLink: {
    color: '#FF7D5C',
    fontWeight: '700',
  },
});
