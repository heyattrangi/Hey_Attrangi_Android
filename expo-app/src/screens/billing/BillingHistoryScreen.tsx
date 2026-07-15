import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { SearchBar } from '../../components/ui/SearchBar';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { AsyncStateRenderer } from '../../components/async';
import { EmptyState } from '../../components/ui/states';
import { SkeletonInvoices } from '../../components/billing';
import { emptyKinds } from '../../config/emptyStates';
import { useBillingStore } from '../../store/billingStore';
import { InvoiceStatus } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y, toggleA11y } from '../../utils/accessibility';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import { useUiStore } from '../../store/uiStore';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'BillingHistory'>;
};

type StatusFilter = 'all' | InvoiceStatus;
type MethodFilter = 'all' | string;

export const BillingHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const guardPress = usePreventDoublePress();
  const showToast = useUiStore((s) => s.showToast);
  const invoices = useBillingStore((s) => s.invoices);
  const status = useBillingStore((s) => s.status);
  const error = useBillingStore((s) => s.error);
  const fetchInvoices = useBillingStore((s) => s.fetchInvoices);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle' || invoices.length === 0) fetchInvoices();
  }, [fetchInvoices, invoices.length, status]);

  const methods = useMemo(
    () => [...new Set(invoices.map((i) => i.paymentMethod))],
    [invoices],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (methodFilter !== 'all' && inv.paymentMethod !== methodFilter) {
        return false;
      }
      if (!q) return true;
      return (
        inv.therapist.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.amount.toLowerCase().includes(q) ||
        (inv.transactionId ?? '').toLowerCase().includes(q)
      );
    });
  }, [invoices, methodFilter, query, statusFilter]);

  const listStatus =
    status === 'success' && invoices.length === 0
      ? 'empty'
      : status === 'empty'
        ? 'empty'
        : status;

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader
        title="Billing history"
        subtitle="Search and filter your transactions"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            onPress={() => setFilterOpen(true)}
            {...buttonA11y('Filter transactions')}
          >
            <Icon name="filter-variant" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search invoices…"
        onClear={() => setQuery('')}
      />

      <AsyncStateRenderer
        screenId="billingHistory"
        status={listStatus}
        error={error}
        onRetry={fetchInvoices}
        hasCachedData={invoices.length > 0}
        loading={<SkeletonInvoices />}
        emptyKind={emptyKinds.invoices}
        loadingDomain="invoice"
        preferSkeleton
      >
        {filtered.length === 0 ? (
          <EmptyState
            variant="searchResults"
            title="No transactions found"
            message="Try another search or clear filters."
            actionLabel="Clear filters"
            onAction={() => {
              setQuery('');
              setStatusFilter('all');
              setMethodFilter('all');
            }}
          />
        ) : (
          filtered.map((invoice) => (
            <AppCard
              key={invoice.id}
              style={styles.card}
              onPress={guardPress(() =>
                navigation.navigate('InvoiceDetail', {
                  invoiceId: invoice.id,
                }),
              )}
            >
              <View style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.title}>{invoice.therapist}</Text>
                  <Text style={styles.meta}>
                    {invoice.date} · {invoice.paymentMethod}
                  </Text>
                  <Text style={styles.status}>{invoice.status}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.amount}>{invoice.amount}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      showToast(
                        invoice.pdfAvailable
                          ? 'PDF download ready when API is connected'
                          : 'No PDF for this invoice',
                      )
                    }
                    {...buttonA11y('Download invoice')}
                  >
                    <Icon
                      name="download"
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </AppCard>
          ))
        )}
      </AsyncStateRenderer>

      <BottomSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter transactions"
      >
        <Text style={styles.filterLabel}>Status</Text>
        <View style={styles.chips}>
          {(['all', 'paid', 'pending', 'failed', 'refunded'] as StatusFilter[]).map(
            (s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, statusFilter === s && styles.chipOn]}
                onPress={() => setStatusFilter(s)}
                {...toggleA11y(s, statusFilter === s)}
              >
                <Text style={styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ),
          )}
        </View>
        <Text style={styles.filterLabel}>Payment method</Text>
        <View style={styles.chips}>
          <TouchableOpacity
            style={[styles.chip, methodFilter === 'all' && styles.chipOn]}
            onPress={() => setMethodFilter('all')}
            {...toggleA11y('All methods', methodFilter === 'all')}
          >
            <Text style={styles.chipText}>All</Text>
          </TouchableOpacity>
          {methods.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, methodFilter === m && styles.chipOn]}
              onPress={() => setMethodFilter(m)}
              {...toggleA11y(m, methodFilter === m)}
            >
              <Text style={styles.chipText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  status: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  amount: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  filterLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  chipOn: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
