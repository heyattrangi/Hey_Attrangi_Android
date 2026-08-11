import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
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
  Spacing,
} from '../../design-system';
import { hapticError, hapticLight } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'EmailOtpSignIn'>;
};

export const EmailOtpSignInScreen: React.FC<Props> = ({ navigation }) => {
  const sendEmailOtp = useAuthStore((s) => s.sendEmailOtp);
  const authStatus = useAuthStore((s) => s.status);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const loading = authStatus === 'loading';
  const isValidEmail = email.trim().includes('@') && email.trim().length >= 5;
  const canSubmit = isValidEmail && !loading;

  const handleSendOtp = async () => {
    if (!email.trim()) {
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
      void hapticLight();
      await sendEmailOtp(email.trim());
      navigation.navigate('EmailOtpVerify', { email: email.trim() });
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Failed to send verification code. Please check your email and try again.';
      setError(message);
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
            label="CONTINUE"
            onPress={handleSendOtp}
            loading={loading}
            disabled={!canSubmit}
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
  },
});
