import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { SkeletonWallet } from '../../components/billing';
import { EmptyState } from '../../components/ui/states';
import { AsyncStateRenderer } from '../../components/async';
import { useBillingStore } from '../../store/billingStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Wallet'>;
};

export const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const wallet = useBillingStore((s) => s.wallet);
  const walletStatus = useBillingStore((s) => s.walletStatus);
  const error = useBillingStore((s) => s.error);
  const fetchWallet = useBillingStore((s) => s.fetchWallet);

  useEffect(() => {
    if (walletStatus === 'idle') fetchWallet();
  }, [fetchWallet, walletStatus]);

  const status =
    walletStatus === 'success' &&
    wallet &&
    wallet.transactions.length === 0
      ? 'empty'
      : walletStatus;

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader
        title="Wallet"
        subtitle="Frontend only — gateway integration later"
        onBack={() => navigation.goBack()}
      />

      <AsyncStateRenderer
        screenId="wallet"
        status={status}
        error={error}
        onRetry={fetchWallet}
        hasCachedData={Boolean(wallet)}
        loading={<SkeletonWallet />}
        empty={
          <EmptyState
            variant="invoices"
            title="No payments yet"
            message="Wallet top-ups and refunds will appear here."
          />
        }
        preferSkeleton
      >
        {wallet ? (
          <>
            <View style={styles.stats}>
              <Stat label="Balance" value={`₹${wallet.balance}`} accent />
              <Stat label="Pending" value={`₹${wallet.pending}`} />
              <Stat label="Refunds" value={`₹${wallet.refundsTotal}`} />
            </View>

            <Text style={styles.section}>Transactions</Text>
            {wallet.transactions.map((txn) => (
              <AppCard key={txn.id} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.info}>
                    <Text style={styles.label}>{txn.label}</Text>
                    <Text style={styles.meta}>
                      {txn.date} · {txn.status}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.amount,
                      txn.amount > 0 && styles.credit,
                      txn.kind === 'pending' && styles.pending,
                    ]}
                  >
                    {txn.amount > 0 ? '+' : ''}
                    ₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                  </Text>
                </View>
              </AppCard>
            ))}
          </>
        ) : null}
      </AsyncStateRenderer>
    </AppScreen>
  );
};

const Stat = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <View style={[styles.stat, accent && styles.statAccent]}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.sm,
  },
  statAccent: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  statValue: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  section: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  card: { marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  amount: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  credit: { color: Colors.success },
  pending: { color: Colors.primaryDark },
});
