import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  RewardCard,
  SkeletonCredits,
  BillingConfirmDialog,
} from '../../components/billing';
import { NoCareCreditsState } from '../../components/ui-states';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useBillingStore } from '../../store/billingStore';
import { useUiStore } from '../../store/uiStore';
import { CareReward } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CareCredits'>;
};

export const CareCreditsScreen: React.FC<Props> = ({ navigation }) => {
  const enabled = useFeatureFlag('enableCareCredits');
  const reduceMotion = useReducedMotion();
  const showToast = useUiStore((s) => s.showToast);
  const care = useBillingStore((s) => s.care);
  const careStatus = useBillingStore((s) => s.careStatus);
  const fetchCareCredits = useBillingStore((s) => s.fetchCareCredits);
  const redeemReward = useBillingStore((s) => s.redeemReward);
  const [pendingReward, setPendingReward] = useState<CareReward | null>(null);

  const balanceScale = useSharedValue(1);
  const balanceAnim = useAnimatedStyle(() => ({
    transform: [{ scale: balanceScale.value }],
  }));

  useEffect(() => {
    if (careStatus === 'idle') fetchCareCredits();
  }, [careStatus, fetchCareCredits]);

  useEffect(() => {
    if (care && !reduceMotion) {
      balanceScale.value = withSpring(1.04, { damping: 10 });
      const t = setTimeout(() => {
        balanceScale.value = withSpring(1);
      }, 280);
      return () => clearTimeout(t);
    }
  }, [balanceScale, care?.balance, reduceMotion]);

  if (!enabled) {
    return (
      <AppScreen includeBottomInset gradient="none">
        <AppHeader title="Care Credits" onBack={() => navigation.goBack()} />
        <Text style={styles.disabled}>
          Care Credits are temporarily unavailable.
        </Text>
      </AppScreen>
    );
  }

  if (careStatus === 'loading' && !care) {
    return (
      <AppScreen includeBottomInset gradient="none">
        <AppHeader title="Care Credits" onBack={() => navigation.goBack()} />
        <SkeletonCredits />
      </AppScreen>
    );
  }

  if (!care || (care.balance === 0 && care.rewards.length === 0)) {
    return (
      <AppScreen includeBottomInset gradient="none">
        <AppHeader title="Care Credits" onBack={() => navigation.goBack()} />
        <NoCareCreditsState />
        <PrimaryButton
          label="Add Credits"
          onPress={() =>
            navigation.navigate('BillingCheckout', {
              kind: 'credits',
              title: 'Care Credits pack',
              amount: 3600,
              amountLabel: '₹3,600',
            })
          }
          showArrow
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader title="Care Credits" onBack={() => navigation.goBack()} />

      <Animated.View style={balanceAnim}>
        <AppCard style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{care.balance}</Text>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Earned Today</Text>
              <Text style={styles.statValue}>{care.earnedToday}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Daily Streak</Text>
              <Text style={styles.statValue}>{care.dailyStreak}</Text>
            </View>
          </View>
        </AppCard>
      </Animated.View>

      <View style={styles.summaryRow}>
        <MiniStat label="Earned" value={care.creditsEarned} />
        <MiniStat label="Used" value={care.creditsUsed} />
        <MiniStat label="Referral" value={care.referralCredits} />
      </View>

      <AppCard style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('MainTabs', { screen: 'MoodTab' })}
          activeOpacity={Motion.opacity.pressed}
          {...buttonA11y('Log mood check-in')}
        >
          <Text style={styles.actionText}>+ Log Mood Check-in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Sessions')}
          activeOpacity={Motion.opacity.pressed}
          {...buttonA11y('Complete session')}
        >
          <Text style={styles.actionText}>+ Complete Session</Text>
        </TouchableOpacity>
      </AppCard>

      <Text style={styles.section}>Available Rewards</Text>
      {care.rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          disabled={care.balance < reward.cost}
          onRedeem={() => setPendingReward(reward)}
        />
      ))}

      {care.upcomingRewards.length > 0 ? (
        <>
          <Text style={styles.section}>Upcoming Rewards</Text>
          {care.upcomingRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              disabled
              onRedeem={() => showToast('Coming soon')}
            />
          ))}
        </>
      ) : null}

      <PrimaryButton
        label="Add Credits"
        onPress={() =>
          navigation.navigate('BillingCheckout', {
            kind: 'credits',
            title: 'Care Credits pack',
            amount: 3600,
            amountLabel: '₹3,600',
          })
        }
        showArrow
      />

      <BillingConfirmDialog
        visible={Boolean(pendingReward)}
        title="Redeem reward"
        message={
          pendingReward
            ? `Spend ${pendingReward.cost} credits on “${pendingReward.title}”?`
            : ''
        }
        primaryLabel="Redeem"
        onSecondary={() => setPendingReward(null)}
        onPrimary={async () => {
          const reward = pendingReward;
          setPendingReward(null);
          if (!reward) return;
          try {
            await redeemReward(reward.id);
            showToast('Reward redeemed');
          } catch {
            showToast('Could not redeem reward', 'error');
          }
        }}
      />
    </AppScreen>
  );
};

const MiniStat = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.mini}>
    <Text style={styles.miniLabel}>{label}</Text>
    <Text style={styles.miniValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  disabled: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  balanceCard: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  balanceLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  balanceAmount: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderDefault,
    marginVertical: Spacing.md,
  },
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1 },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statValue: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  mini: {
    flex: 1,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.medium,
    padding: Spacing.sm,
  },
  miniLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  miniValue: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionsCard: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  actionsTitle: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },
  actionBtn: {
    backgroundColor: Colors.calendarInactive,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
  actionText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  section: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
});
