import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader } from '../../components/app';
import { AppInput } from '../../components/app';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { PasswordRequirements } from '../../components/common/PasswordRequirements';
import { FormScreen } from '../../components/ui/FormScreen';
import { PasswordChangedDialog } from '../../components/ui-states';
import { useProfileStore } from '../../store/profileStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import {
  isRequired,
  isValidEmail,
  isStrongPassword,
  passwordsMatch,
} from '../../utils/validation';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'EmailSecurity'>;
};

export const EmailSecurityScreen: React.FC<Props> = ({ navigation }) => {
  const emailSecurity = useProfileStore((s) => s.emailSecurity);
  const updateEmailSecurity = useProfileStore((s) => s.updateEmailSecurity);
  const saveEmailSecurity = useProfileStore((s) => s.saveEmailSecurity);
  const profileStatus = useProfileStore((s) => s.status);
  const showToast = useUiStore((s) => s.showToast);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordChangedVisible, setPasswordChangedVisible] = useState(false);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!isRequired(emailSecurity.currentEmail)) {
      next.currentEmail = 'Current email is required';
    } else if (!isValidEmail(emailSecurity.currentEmail)) {
      next.currentEmail = 'Invalid email format';
    }
    if (emailSecurity.newEmail && !isValidEmail(emailSecurity.newEmail)) {
      next.newEmail = 'Invalid new email format';
    }
    if (emailSecurity.newPassword || emailSecurity.confirmPassword) {
      if (!isRequired(emailSecurity.currentPassword)) {
        next.currentPassword = 'Current password is required to change password';
      }
      if (!isStrongPassword(emailSecurity.newPassword)) {
        next.newPassword = 'Password does not meet requirements';
      }
      if (!passwordsMatch(emailSecurity.newPassword, emailSecurity.confirmPassword)) {
        next.confirmPassword = 'Passwords do not match';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast('Please fix the errors below', 'error');
      return;
    }
    try {
      const changingPassword = Boolean(
        emailSecurity.newPassword || emailSecurity.confirmPassword,
      );
      await saveEmailSecurity();
      if (changingPassword) {
        setPasswordChangedVisible(true);
      } else {
        showToast('Security settings updated successfully');
        navigation.goBack();
      }
    } catch {
      showToast('Failed to update security settings', 'error');
    }
  };

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  };

  const canSave =
    isRequired(emailSecurity.currentEmail) &&
    isValidEmail(emailSecurity.currentEmail) &&
    (!emailSecurity.newEmail || isValidEmail(emailSecurity.newEmail)) &&
    (!emailSecurity.newPassword ||
      (isStrongPassword(emailSecurity.newPassword) &&
        passwordsMatch(emailSecurity.newPassword, emailSecurity.confirmPassword) &&
        isRequired(emailSecurity.currentPassword)));

  return (
    <FormScreen>
      <AppHeader title="Email & Security" onBack={() => navigation.goBack()} />

      <AppInput
        label="Current Email"
        placeholder="your@email.com"
        value={emailSecurity.currentEmail}
        onChangeText={(t) => {
          updateEmailSecurity({ currentEmail: t });
          clearError('currentEmail');
        }}
        keyboardType="email-address"
        error={errors.currentEmail}
      />
      <AppInput
        label="New Email"
        placeholder="New email (optional)"
        value={emailSecurity.newEmail}
        onChangeText={(t) => {
          updateEmailSecurity({ newEmail: t });
          clearError('newEmail');
        }}
        keyboardType="email-address"
        error={errors.newEmail}
      />
      <AppInput
        label="Current Password"
        placeholder="Enter current password"
        value={emailSecurity.currentPassword}
        onChangeText={(t) => {
          updateEmailSecurity({ currentPassword: t });
          clearError('currentPassword');
        }}
        secureTextEntry
        showPasswordToggle
        error={errors.currentPassword}
      />
      <AppInput
        label="New Password"
        placeholder="Enter new password"
        value={emailSecurity.newPassword}
        onChangeText={(t) => {
          updateEmailSecurity({ newPassword: t });
          clearError('newPassword');
        }}
        secureTextEntry
        showPasswordToggle
        error={errors.newPassword}
      />
      {emailSecurity.newPassword ? (
        <PasswordRequirements password={emailSecurity.newPassword} />
      ) : null}
      <AppInput
        label="Confirm Password"
        placeholder="Confirm new password"
        value={emailSecurity.confirmPassword}
        onChangeText={(t) => {
          updateEmailSecurity({ confirmPassword: t });
          clearError('confirmPassword');
        }}
        secureTextEntry
        showPasswordToggle
        success={
          emailSecurity.confirmPassword.length > 0 &&
          emailSecurity.newPassword === emailSecurity.confirmPassword
        }
        error={
          emailSecurity.confirmPassword.length > 0 &&
          emailSecurity.newPassword !== emailSecurity.confirmPassword
            ? errors.confirmPassword || 'Passwords do not match'
            : errors.confirmPassword
        }
      />

      <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
      <Text style={styles.sectionHint}>
        Add an extra layer of security to your account.
      </Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Enable 2FA</Text>
        <Switch
          value={emailSecurity.twoFactorEnabled}
          onValueChange={(v) => updateEmailSecurity({ twoFactorEnabled: v })}
          trackColor={{ false: Colors.calendarInactive, true: Colors.primaryLight }}
          thumbColor={emailSecurity.twoFactorEnabled ? Colors.primary : Colors.white}
        />
      </View>

      <PrimaryButton
        label="Update Security"
        onPress={handleSave}
        disabled={!canSave || profileStatus === 'loading'}
        loading={profileStatus === 'loading'}
      />

      <PasswordChangedDialog
        visible={passwordChangedVisible}
        onDone={() => {
          setPasswordChangedVisible(false);
          navigation.goBack();
        }}
      />
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionHint: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  switchLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
