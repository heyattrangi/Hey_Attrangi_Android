import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  PlanCard,
  SkeletonPlans,
  BillingConfirmDialog,
} from '../../components/billing';
import { AsyncStateRenderer } from '../../components/async';
import { useBillingStore } from '../../store/billingStore';
import { useUiStore } from '../../store/uiStore';
import { SubscriptionPlan } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import { mockActivePlanSummary } from '../../mocks/mockBilling';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'Subscription' | 'BillingInvoices'
  >;
};

export const SubscriptionScreen: React.FC<Props> = ({ navigation }) => {
  const guardPress = usePreventDoublePress();
  const showToast = useUiStore((s) => s.showToast);
  const plans = useBillingStore((s) => s.plans);
  const activePlanId = useBillingStore((s) => s.activePlanId);
  const activePlanSummary = useBillingStore((s) => s.activePlanSummary);
  const status = useBillingStore((s) => s.status);
  const error = useBillingStore((s) => s.error);
  const fetchBillingHome = useBillingStore((s) => s.fetchBillingHome);

  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    if (status === 'idle') fetchBillingHome();
  }, [fetchBillingHome, status]);

  const visiblePlans = plans.filter(
    (p) => !p.comingSoon || ['student', 'family', 'corporate'].includes(p.id),
  );

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader title="Billing & Invoices" onBack={() => navigation.goBack()} />

      <View style={styles.links}>
        <TouchableOpacity
          style={styles.linkChip}
          onPress={guardPress(() => navigation.navigate('BillingHistory'))}
          {...buttonA11y('Billing history')}
        >
          <Text style={styles.linkText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkChip}
          onPress={guardPress(() => navigation.navigate('Wallet'))}
          {...buttonA11y('Wallet')}
        >
          <Text style={styles.linkText}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkChip}
          onPress={guardPress(() => navigation.navigate('Refunds'))}
          {...buttonA11y('Refunds')}
        >
          <Text style={styles.linkText}>Refunds</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkChip}
          onPress={guardPress(() => navigation.navigate('SubscriptionComparison'))}
          {...buttonA11y('Compare plans')}
        >
          <Text style={styles.linkText}>Compare</Text>
        </TouchableOpacity>
      </View>

      <AsyncStateRenderer
        screenId="subscription"
        status={status === 'empty' ? 'success' : status}
        error={error}
        onRetry={fetchBillingHome}
        hasCachedData={plans.length > 0}
        loading={<SkeletonPlans />}
        preferSkeleton
      >
        <AppCard style={styles.activeCard}>
          <Text style={styles.activeLabel}>Active Plan</Text>
          <Text style={styles.activeName}>
            {activePlanId === 'free'
              ? activePlanSummary.name
              : plans.find((p) => p.id === activePlanId)?.name ??
                mockActivePlanSummary.name}
          </Text>
          <Text style={styles.activeDesc}>
            {activePlanId === 'free'
              ? activePlanSummary.description
              : plans.find((p) => p.id === activePlanId)?.description ??
                activePlanSummary.description}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Billing cycle</Text>
            <Text style={styles.metaVal}>
              {activePlanId === 'free' ? 'N/A' : 'Monthly'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Plan type</Text>
            <Text style={styles.metaVal}>
              {activePlanId === 'free' ? 'Free' : activePlanId}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Payment method</Text>
            <Text style={styles.metaVal}>
              {activePlanSummary.paymentMethod}
            </Text>
          </View>
        </AppCard>

        <Text style={styles.section}>Compare Plans</Text>
        {visiblePlans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            index={index}
            isCurrent={activePlanId === plan.id}
            onPressCta={() => {
              if (plan.comingSoon) {
                showToast('This plan will be available soon');
                return;
              }
              if (plan.id === 'institution') {
                showToast('Contact support to join the network');
                return;
              }
              setPendingPlan(plan);
            }}
          />
        ))}
      </AsyncStateRenderer>

      <BillingConfirmDialog
        visible={Boolean(pendingPlan)}
        title="Confirm upgrade"
        message={
          pendingPlan
            ? `Switch to ${pendingPlan.name} (${pendingPlan.priceLabel})? Payment gateway will be connected later — this is a mock checkout.`
            : ''
        }
        primaryLabel="Continue to payment"
        onSecondary={() => setPendingPlan(null)}
        onPrimary={() => {
          const plan = pendingPlan;
          setPendingPlan(null);
          if (!plan) return;
          navigation.navigate('BillingCheckout', {
            kind: 'subscription',
            planId: plan.id,
            title: plan.name,
            amount: plan.priceAmount,
            amountLabel: plan.priceLabel,
          });
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  linkChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
  },
  linkText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  activeCard: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  activeLabel: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  activeName: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  activeDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaKey: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  metaVal: {
    ...Typography.caption,
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
