import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { useUiStore } from '../../store/uiStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'PaymentSuccess'>;
  route: RouteProp<MainStackParamList, 'PaymentSuccess'>;
};

export const PaymentSuccessScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { transactionId, receiptId, amountLabel, title, kind } = route.params;
  const showToast = useUiStore((s) => s.showToast);
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(reduceMotion ? 1 : 0.6);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 140 });
  }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader title="Payment successful" onBack={() => navigation.goBack()} />

      <Animated.View style={[styles.hero, animStyle]}>
        <View style={styles.iconCircle}>
          <Icon name="check-circle" size={48} color={Colors.success} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>{amountLabel}</Text>
      </Animated.View>

      <AppCard style={styles.receipt}>
        <Text style={styles.receiptTitle}>Receipt</Text>
        <Row label="Transaction ID" value={transactionId} />
        <Row label="Receipt" value={receiptId} />
        <Row label="Type" value={kind} />
        <Row label="Status" value="Paid" />
      </AppCard>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => {
          showToast('Invoice download ready when PDF API is connected');
          navigation.navigate('BillingHistory');
        }}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y('Download invoice')}
      >
        <Icon name="download" size={20} color={Colors.primaryDark} />
        <Text style={styles.secondaryText}>Download Invoice</Text>
      </TouchableOpacity>

      <PrimaryButton
        label="Continue"
        onPress={() => {
          if (kind === 'subscription') {
            navigation.navigate('Subscription');
          } else if (kind === 'credits') {
            navigation.navigate('CareCredits');
          } else {
            navigation.navigate('BillingHistory');
          }
        }}
        showArrow
      />
    </AppScreen>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(56, 161, 105, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  amount: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  receipt: { marginBottom: Spacing.md },
  receiptTitle: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  rowValue: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    minHeight: 48,
  },
  secondaryText: {
    ...Typography.body,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
