import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { SkeletonInvoices, BillingConfirmDialog } from '../../components/billing';
import { EmptyState } from '../../components/ui/states';
import { useBillingStore } from '../../store/billingStore';
import { useProfileStore } from '../../store/profileStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'InvoiceDetail'>;
  route: RouteProp<MainStackParamList, 'InvoiceDetail'>;
};

export const InvoiceDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const showToast = useUiStore((s) => s.showToast);
  const billingInvoice = useBillingStore((s) =>
    s.getInvoice(route.params.invoiceId),
  );
  const profileInvoice = useProfileStore((s) =>
    s.getInvoice(route.params.invoiceId),
  );
  const fetchInvoices = useBillingStore((s) => s.fetchInvoices);
  const requestRefund = useBillingStore((s) => s.requestRefund);
  const [refundOpen, setRefundOpen] = useState(false);
  const [booting, setBooting] = useState(!billingInvoice && !profileInvoice);

  useEffect(() => {
    if (!billingInvoice) {
      fetchInvoices().finally(() => setBooting(false));
    } else {
      setBooting(false);
    }
  }, [billingInvoice, fetchInvoices]);

  const invoice = billingInvoice ?? profileInvoice;

  if (booting) {
    return (
      <AppScreen includeBottomInset gradient="none">
        <AppHeader title="Invoice Details" onBack={() => navigation.goBack()} />
        <SkeletonInvoices />
      </AppScreen>
    );
  }

  if (!invoice) {
    return (
      <AppScreen includeBottomInset gradient="none">
        <AppHeader title="Invoice" onBack={() => navigation.goBack()} />
        <EmptyState
          variant="invoices"
          title="No invoices"
          message="This invoice could not be found."
        />
      </AppScreen>
    );
  }

  const shareInvoice = async () => {
    try {
      await Share.share({
        message: `Hey Attrangi invoice ${invoice.id.toUpperCase()} — ${invoice.amount} (${invoice.status})`,
      });
    } catch {
      showToast('Could not share invoice', 'error');
    }
  };

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader title="Invoice Details" onBack={() => navigation.goBack()} />

      <AppCard style={styles.card}>
        <Text style={styles.therapist}>{invoice.therapist}</Text>
        <View
          style={[
            styles.statusBadge,
            invoice.status === 'paid' && styles.statusPaid,
            invoice.status === 'refunded' && styles.statusRefunded,
          ]}
        >
          <Text style={styles.statusText}>{invoice.status}</Text>
        </View>
      </AppCard>

      <AppCard style={styles.detailCard}>
        <DetailRow label="Invoice ID" value={invoice.id.toUpperCase()} />
        {invoice.transactionId ? (
          <DetailRow label="Transaction ID" value={invoice.transactionId} />
        ) : null}
        <DetailRow label="Session Date" value={invoice.sessionDate} />
        <DetailRow label="Invoice Date" value={invoice.date} />
        {invoice.subtotal ? (
          <DetailRow label="Subtotal" value={invoice.subtotal} />
        ) : null}
        {invoice.tax ? <DetailRow label="Tax" value={invoice.tax} /> : null}
        {invoice.discount ? (
          <DetailRow label="Discount" value={invoice.discount} />
        ) : null}
        <DetailRow label="Amount" value={invoice.amount} highlight />
        <DetailRow label="Payment Method" value={invoice.paymentMethod} />
      </AppCard>

      <AppCard style={styles.pdfCard}>
        <Icon name="file-pdf-box" size={40} color={Colors.primary} />
        <Text style={styles.pdfTitle}>PDF preview</Text>
        <Text style={styles.pdfHint}>
          Placeholder — connect invoice PDF API later
        </Text>
      </AppCard>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            showToast(
              invoice.pdfAvailable
                ? 'Download queued (API pending)'
                : 'PDF not available',
            )
          }
          activeOpacity={Motion.opacity.pressed}
          {...buttonA11y('Download invoice')}
        >
          <Icon name="download" size={20} color={Colors.white} />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.secondary]}
          onPress={shareInvoice}
          activeOpacity={Motion.opacity.pressed}
          {...buttonA11y('Share invoice')}
        >
          <Icon name="share-variant-outline" size={20} color={Colors.primaryDark} />
          <Text style={[styles.actionText, styles.secondaryText]}>Share</Text>
        </TouchableOpacity>
      </View>

      {invoice.status === 'paid' ? (
        <TouchableOpacity
          style={styles.refundLink}
          onPress={() => setRefundOpen(true)}
          {...buttonA11y('Request refund')}
        >
          <Text style={styles.refundText}>Request refund</Text>
        </TouchableOpacity>
      ) : null}

      <BillingConfirmDialog
        visible={refundOpen}
        title="Confirm refund"
        message={`Request a refund of ${invoice.amount} for this invoice?`}
        primaryLabel="Request refund"
        onSecondary={() => setRefundOpen(false)}
        onPrimary={async () => {
          setRefundOpen(false);
          try {
            const created = await requestRefund(
              invoice.id,
              'Requested from invoice details',
            );
            showToast('Refund requested');
            navigation.navigate('RefundDetail', { refundId: created.id });
          } catch {
            showToast('Could not request refund', 'error');
          }
        }}
      />
    </AppScreen>
  );
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, highlight && styles.detailHighlight]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  therapist: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusBadge: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.calendarInactive,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  statusPaid: { backgroundColor: Colors.badgeGreen },
  statusRefunded: { backgroundColor: Colors.peachMuted },
  statusText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  detailCard: { marginBottom: Spacing.md },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  detailValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  detailHighlight: {
    ...Typography.title,
    fontWeight: '700',
  },
  pdfCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pdfTitle: {
    ...Typography.title,
    fontWeight: '700',
    marginTop: Spacing.sm,
    color: Colors.textPrimary,
  },
  pdfHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.medium,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
  secondaryText: { color: Colors.primaryDark },
  refundLink: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  refundText: {
    ...Typography.body,
    color: Colors.error,
    fontWeight: '600',
  },
});
