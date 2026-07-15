import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader } from '../../components/app';
import { PaymentFailedState } from '../../components/ui-states';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'PaymentFailure'>;
  route: RouteProp<MainStackParamList, 'PaymentFailure'>;
};

export const PaymentFailureScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const message =
    route.params?.message ??
    'We could not complete your payment. No amount was charged.';

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader title="Payment failed" onBack={() => navigation.goBack()} />

      <Animated.View entering={FadeIn.duration(Motion.duration.normal)}>
        <PaymentFailedState onRetry={() => navigation.goBack()} />
      </Animated.View>

      <Text style={styles.message}>{message}</Text>

      <PrimaryButton
        label="Try again"
        onPress={() => navigation.goBack()}
        showArrow
      />

      <TouchableOpacity
        style={styles.alt}
        onPress={() => navigation.goBack()}
        {...buttonA11y('Choose a different payment method')}
      >
        <Text style={styles.altText}>Different payment method</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.alt}
        onPress={() => navigation.navigate('HelpCenter')}
        {...buttonA11y('Contact support')}
      >
        <Text style={styles.altText}>Contact support</Text>
      </TouchableOpacity>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  alt: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.medium,
    minHeight: 44,
    justifyContent: 'center',
  },
  altText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
});
