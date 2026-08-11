import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader } from '../../components/app';
import { PaymentOptionCard } from '../../components/ui/PaymentOptionCard';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import {
  PromoCodeInput,
  PaymentSummaryCard,
  BillingConfirmDialog,
  SkeletonPayment,
} from '../../components/billing';
import RazorpayCheckout from 'react-native-razorpay';
import { useBillingStore } from '../../store/billingStore';
import { useProfileStore } from '../../store/profileStore';
import { billingRepository } from '../../repositories/BillingRepository';
import { profileRepository } from '../../repositories/ProfileRepository';
import { PaymentMethod } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { Icons } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'BillingCheckout'>;
  route: RouteProp<MainStackParamList, 'BillingCheckout'>;
};

const METHODS: Array<{
  id: PaymentMethod;
  label: string;
  icon: string;
  soon?: boolean;
}> = [
  { id: 'upi', label: 'UPI', icon: Icons.upi },
  { id: 'card', label: 'Card', icon: Icons.creditCard },
  { id: 'netbanking', label: 'Net Banking', icon: 'bank-outline' },
  { id: 'wallet', label: 'Wallet', icon: Icons.wallet },
  { id: 'care_credits', label: 'Care Credits', icon: 'heart-outline' },
  { id: 'apple_pay', label: 'Apple Pay', icon: 'apple', soon: true },
  { id: 'google_pay', label: 'Google Pay', icon: 'google', soon: true },
];

export const BillingCheckoutScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { kind, planId, title, amount } = route.params;
  const selected = useProfileStore((s) => s.selectedPaymentMethod);
  const setSelected = useProfileStore((s) => s.setSelectedPaymentMethod);
  const appliedPromo = useBillingStore((s) => s.appliedPromo);
  const promoSuggestions = useBillingStore((s) => s.promoSuggestions);
  const applyPromo = useBillingStore((s) => s.applyPromo);
  const clearPromo = useBillingStore((s) => s.clearPromo);
  const checkout = useBillingStore((s) => s.checkout);
  const checkoutStatus = useBillingStore((s) => s.checkoutStatus);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const discount = appliedPromo?.valid ? appliedPromo.discountAmount ?? 0 : 0;
  const tax = Math.round((amount - discount) * 0.18);
  const total = Math.max(0, amount - discount + tax);

  const lines = useMemo(
    () => [
      { label: title, amount: `₹${amount}` },
      {
        label: discount ? `Discount (${appliedPromo?.code})` : 'Discount',
        amount: discount ? `-₹${discount}` : '₹0',
        muted: true,
      },
      { label: 'Taxes (GST 18%)', amount: `₹${tax}` },
      {
        label: 'Total',
        amount: `₹${total}`,
        emphasize: true,
      },
    ],
    [amount, appliedPromo?.code, discount, tax, title, total],
  );

  const pay = async () => {
    setConfirmOpen(false);
    try {
      if (kind === 'subscription') {
        const orderRes = await billingRepository.createSubscriptionOrder(
          planId || 'essential',
          total,
        );

        if (orderRes?.order?.id && orderRes?.key) {
          const options = {
            description: `${title} Subscription`,
            image: 'https://heyattrangi.app/logo.png',
            currency: 'INR',
            key: orderRes.key,
            amount: orderRes.order.amount,
            name: 'Hey Attrangi',
            order_id: orderRes.order.id,
            prefill: {
              email: 'patient@heyattrangi.app',
              contact: '9876543210',
              name: 'Patient',
            },
            theme: { color: Colors.primary },
          };

          const razorpayData: any = await RazorpayCheckout.open(options);

          const verifyRes = await billingRepository.verifySubscription({
            razorpay_order_id: razorpayData.razorpay_order_id,
            razorpay_payment_id: razorpayData.razorpay_payment_id,
            razorpay_signature: razorpayData.razorpay_signature,
            plan: planId || 'essential',
            amount: total,
          });

          if (verifyRes.success) {
            await profileRepository.getMobileMe();
            navigation.replace('PaymentSuccess', {
              transactionId: verifyRes.transactionId || razorpayData.razorpay_payment_id,
              receiptId: orderRes.order.id,
              amountLabel: `₹${total}`,
              title: 'Subscription updated',
              kind: 'subscription',
            });
            return;
          }
        }
      }

      // Fallback checkout
      const result = await checkout({
        kind,
        planId,
        amount: total,
        amountLabel: `₹${total}`,
        method: selected,
        couponCode: appliedPromo?.valid ? appliedPromo.code : undefined,
      });
      navigation.replace('PaymentSuccess', {
        transactionId: result.transactionId,
        receiptId: result.receiptId,
        amountLabel: `₹${total}`,
        title: kind === 'subscription' ? 'Subscription updated' : 'Credits added',
        kind,
      });
    } catch (err: any) {
      setFailed(true);
      navigation.navigate('PaymentFailure', {
        message: err?.message || 'Payment cancelled or failed. Please try again.',
      });
    }
  };

  if (failed) {
    return null;
  }

  if (checkoutStatus === 'loading') {
    return (
      <AppScreen includeBottomInset gradient="none">
        <AppHeader title="Payment" onBack={() => navigation.goBack()} />
        <SkeletonPayment />
        <Text style={styles.loadingHint}>
          Preparing secure checkout… (gateway placeholder)
        </Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader
        title="Payment"
        subtitle="Razorpay / Stripe ready — mock checkout only"
        onBack={() => navigation.goBack()}
      />

      <PaymentSummaryCard lines={lines} />

      <PromoCodeInput
        applied={appliedPromo}
        suggestions={promoSuggestions}
        loading={promoLoading}
        onClear={clearPromo}
        onApply={async (code) => {
          setPromoLoading(true);
          try {
            await applyPromo(code);
          } finally {
            setPromoLoading(false);
          }
        }}
      />

      <Text style={styles.section}>Payment method</Text>
      {METHODS.map((m) => (
        <View key={m.id} style={m.soon ? styles.soonWrap : undefined}>
          <PaymentOptionCard
            label={m.soon ? `${m.label} (Soon)` : m.label}
            icon={m.icon}
            selected={selected === m.id}
            onPress={() => {
              if (m.soon) return;
              setSelected(m.id);
            }}
          />
        </View>
      ))}

      <PrimaryButton
        label="Confirm Payment"
        onPress={() => setConfirmOpen(true)}
        showArrow
        disabled={METHODS.find((m) => m.id === selected)?.soon}
      />

      <BillingConfirmDialog
        visible={confirmOpen}
        title="Confirm payment"
        message={`Pay ₹${total} via ${selected.replace('_', ' ')} for ${title}?`}
        primaryLabel="Pay now"
        secondaryLabel="Cancel"
        onSecondary={() => setConfirmOpen(false)}
        onPrimary={pay}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  section: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  soonWrap: { opacity: 0.55 },
  loadingHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
