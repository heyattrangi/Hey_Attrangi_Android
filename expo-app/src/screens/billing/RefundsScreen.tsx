import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { SkeletonInvoices, BillingConfirmDialog } from '../../components/billing';
import { AsyncStateRenderer } from '../../components/async';
import { EmptyState } from '../../components/ui/states';
import { useBillingStore } from '../../store/billingStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

type ListProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Refunds'>;
};

type DetailProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'RefundDetail'>;
  route: RouteProp<MainStackParamList, 'RefundDetail'>;
};

export const RefundsScreen: React.FC<ListProps> = ({ navigation }) => {
  const refunds = useBillingStore((s) => s.refunds);
  const refundStatus = useBillingStore((s) => s.refundStatus);
  const error = useBillingStore((s) => s.error);
  const fetchRefunds = useBillingStore((s) => s.fetchRefunds);

  useEffect(() => {
    if (refundStatus === 'idle') fetchRefunds();
  }, [fetchRefunds, refundStatus]);

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader title="Refunds" onBack={() => navigation.goBack()} />

      <AsyncStateRenderer
        screenId="refunds"
        status={refundStatus}
        error={error}
        onRetry={fetchRefunds}
        hasCachedData={refunds.length > 0}
        loading={<SkeletonInvoices />}
        empty={
          <EmptyState
            variant="invoices"
            title="No refunds"
            message="Refund requests and their status will show up here."
          />
        }
        preferSkeleton
      >
        {refunds.map((refund) => (
          <AppCard
            key={refund.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('RefundDetail', { refundId: refund.id })
            }
          >
            <Text style={styles.amount}>{refund.amount}</Text>
            <Text style={styles.meta}>
              {refund.status} · Invoice {refund.invoiceId.toUpperCase()}
            </Text>
            <Text style={styles.reason}>{refund.reason}</Text>
          </AppCard>
        ))}
      </AsyncStateRenderer>
    </AppScreen>
  );
};

export const RefundDetailScreen: React.FC<DetailProps> = ({
  navigation,
  route,
}) => {
  const showToast = useUiStore((s) => s.showToast);
  const getRefund = useBillingStore((s) => s.getRefund);
  const requestRefund = useBillingStore((s) => s.requestRefund);
  const refund = getRefund(route.params.refundId);
  const [confirm, setConfirm] = useState(false);

  if (!refund) {
    return (
      <AppScreen includeBottomInset gradient="none">
        <AppHeader title="Refund" onBack={() => navigation.goBack()} />
        <EmptyState
          variant="invoices"
          title="No refunds"
          message="This refund could not be found."
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader title="Refund details" onBack={() => navigation.goBack()} />

      <AppCard style={styles.card}>
        <Text style={styles.amount}>{refund.amount}</Text>
        <Text style={styles.status}>{refund.status}</Text>
        <Text style={styles.reason}>{refund.reason}</Text>
      </AppCard>

      <Text style={styles.section}>Timeline</Text>
      {refund.timeline.map((step, index) => (
        <View key={step.id} style={styles.timelineRow}>
          <View style={styles.rail}>
            <View
              style={[
                styles.dot,
                step.done && styles.dotDone,
                step.current && styles.dotCurrent,
              ]}
            />
            {index < refund.timeline.length - 1 ? (
              <View style={styles.line} />
            ) : null}
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepLabel}>{step.label}</Text>
            {step.at ? <Text style={styles.stepAt}>{step.at}</Text> : null}
          </View>
        </View>
      ))}

      {refund.status === 'rejected' ? (
        <TouchableOpacity
          style={styles.retry}
          onPress={() => setConfirm(true)}
          {...buttonA11y('Request refund again')}
        >
          <Text style={styles.retryText}>Request again</Text>
        </TouchableOpacity>
      ) : null}

      <BillingConfirmDialog
        visible={confirm}
        title="Confirm refund"
        message="Submit a new refund request for this invoice?"
        primaryLabel="Request refund"
        onSecondary={() => setConfirm(false)}
        onPrimary={async () => {
          setConfirm(false);
          try {
            const created = await requestRefund(
              refund.invoiceId,
              refund.reason,
            );
            showToast('Refund requested');
            navigation.replace('RefundDetail', { refundId: created.id });
          } catch {
            showToast('Could not request refund', 'error');
          }
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
  amount: {
    ...Typography.heading3,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  status: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginTop: Spacing.xs,
  },
  reason: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  section: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },
  timelineRow: { flexDirection: 'row', minHeight: 56 },
  rail: { width: 24, alignItems: 'center' },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.borderDefault,
    marginTop: 4,
  },
  dotDone: { backgroundColor: Colors.success },
  dotCurrent: { backgroundColor: Colors.primary },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.borderDefault,
    marginTop: 4,
  },
  stepBody: { flex: 1, paddingBottom: Spacing.md },
  stepLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  stepAt: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  retry: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  retryText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
});
