import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { AccountExistenceModal } from '../../components/auth/AccountExistenceModal';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Input,
  Colors,
  Spacing,
} from '../../design-system';
import { getUserFriendlyErrorMessage } from '../../types/errors';
import { hapticError, hapticLight, hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'EmailOtpSignIn'>;
  route?: RouteProp<AuthStackParamList, 'EmailOtpSignIn'>;
};

function isAccountExistsError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes('already exists') ||
    lower.includes('already registered') ||
    lower.includes('email is taken') ||
    lower.includes('user_exists')
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

export const EmailOtpSignInScreen: React.FC<Props> = ({ navigation, route }) => {
  const sendEmailOtp = useAuthStore((s) => s.sendEmailOtp);
  const authStatus = useAuthStore((s) => s.status);

  const initialMode = route?.params?.mode ?? 'signin';
  const initialEmail = route?.params?.email ?? '';

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | undefined>(undefined);

  const [modalState, setModalState] = useState<{
    visible: boolean;
    type: 'account_exists' | 'account_not_found' | 'error';
    title?: string;
    message?: string;
  }>({ visible: false, type: 'account_exists' });

  const loading = authStatus === 'loading';
  const isValidEmail = email.trim().includes('@') && email.trim().length >= 5;
  const canSubmit = isValidEmail && !loading;

  const handleSendOtp = async () => {
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail) {
      setError('Email address is required');
      void hapticError();
      return;
    }

    if (!isValidEmail) {
      setError('Please enter a valid email address');
      void hapticError();
      return;
    }

    setError(undefined);
    try {
      void hapticSelection();
      await sendEmailOtp(sanitizedEmail);
      navigation.navigate('EmailOtpVerify', { email: sanitizedEmail, mode: authMode });
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

      const friendly = getUserFriendlyErrorMessage(err);
      setError(friendly);
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
            {authMode === 'signup' ? 'Create your account' : 'Login to Hey Attrangi'}
          </Text>
          <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
            {authMode === 'signup'
              ? 'Enter your email address to get started with Hey Attrangi.'
              : 'Enter your email address to continue your mental wellness journey.'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(undefined);
            }}
            error={error}
            autoFocus
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="send"
            onSubmitEditing={() => {
              if (canSubmit) void handleSendOtp();
            }}
            textContentType="emailAddress"
          />
        </View>

        {/* Action Button */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            label={authMode === 'signup' ? 'CREATE ACCOUNT' : 'LOG IN'}
            onPress={handleSendOtp}
            loading={loading}
            disabled={!canSubmit}
          />

          <TouchableOpacity
            style={styles.modeSwitchRow}
            onPress={() => {
              void hapticLight();
              setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
              setError(undefined);
            }}
            activeOpacity={0.7}
          >
            <Text variant="bodySmall" color={Colors.textSecondary}>
              {authMode === 'signin'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Text variant="bodySmall" color={Colors.brandPrimary} style={styles.modeSwitchLink}>
                {authMode === 'signin' ? 'Create account' : 'Log in'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Account Existence Dialog */}
      <AccountExistenceModal
        visible={modalState.visible}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onPrimaryPress={handleModalPrimary}
        onSecondaryPress={handleModalSecondary}
        onDismiss={handleModalSecondary}
      />
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
    marginBottom: Spacing.lg,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  modeSwitchRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modeSwitchLink: {
    fontWeight: '700',
  },
});
