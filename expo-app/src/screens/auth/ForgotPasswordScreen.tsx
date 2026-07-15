import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { TextInput } from '../../components/common/TextInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { AuthStackParamList } from '../../navigation/types';
import { getAuthService } from '../../services/container';
import { Spacing } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

const SUCCESS_MESSAGE =
  'If an account exists for that email, you will receive password reset instructions shortly.';

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert(
        'Reset link sent',
        'Please enter your email or phone number to receive reset instructions.',
      );
      return;
    }

    setLoading(true);
    try {
      await getAuthService().forgotPassword(email.trim());
      Alert.alert('Reset link sent', SUCCESS_MESSAGE);
      navigation.goBack();
    } catch {
      Alert.alert('Reset link sent', SUCCESS_MESSAGE);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingContainer onBackPress={() => navigation.goBack()} glowPosition="topRight">
      <View style={styles.container}>
        <ScreenHeader
          title="Forgot Password"
          subtitle="Enter your email or phone and we'll send reset instructions"
        />
        <TextInput
          label="Email or phone"
          placeholder="Enter your email or phone number"
          value={email}
          onChangeText={setEmail}
        />
        <PrimaryButton
          label="Send Reset Link"
          onPress={handleSubmit}
          showArrow
          loading={loading}
        />
      </View>
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.md,
  },
});
