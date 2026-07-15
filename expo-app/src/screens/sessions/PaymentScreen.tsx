import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppHeader, AppCard, AppScreen } from '../../components/app';
import { PaymentOptionCard } from '../../components/ui/PaymentOptionCard';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { TherapistCard } from '../../components/ui/TherapistCard';
import { FormScreen } from '../../components/ui/FormScreen';
import { BookingProgress } from '../../components/therapists';
import {
  PromoCodeInput,
  PaymentSummaryCard,
  BillingConfirmDialog,
} from '../../components/billing';
import {
  PaymentFailedState,
  BookingFailedState,
  LoadingIllustration,
} from '../../components/ui-states';
import { useTherapistStore } from '../../store/therapistStore';
import { useProfileStore } from '../../store/profileStore';
import { useBookingStore } from '../../store/bookingStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useSessionStore } from '../../store/sessionStore';
import { useBillingStore } from '../../store/billingStore';
import { PaymentMethod } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { Icons } from '../../app/design-system';
import { getTherapistImageSource } from '../../utils/therapistImage';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Payment'>;
  route: RouteProp<MainStackParamList, 'Payment'>;
};

type PayPhase = 'form' | 'loading' | 'paymentFailed' | 'bookingFailed';

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

const parsePrice = (price: string) => {
  const n = Number(String(price).replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const getTherapistById = useTherapistStore((s) => s.getTherapistById);
  const selectedPaymentMethod = useProfileStore((s) => s.selectedPaymentMethod);
  const setSelectedPaymentMethod = useProfileStore((s) => s.setSelectedPaymentMethod);
  const createBooking = useBookingStore((s) => s.createBooking);
  const lastBooking = useBookingStore((s) => s.lastBooking);
  const completePaymentFlow = usePaymentStore((s) => s.completePaymentFlow);
  const paymentStatus = usePaymentStore((s) => s.status);
  const fetchSessions = useSessionStore((s) => s.fetchSessions);
  const appliedPromo = useBillingStore((s) => s.appliedPromo);
  const promoSuggestions = useBillingStore((s) => s.promoSuggestions);
  const applyPromo = useBillingStore((s) => s.applyPromo);
  const clearPromo = useBillingStore((s) => s.clearPromo);

  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<PayPhase>('form');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const therapist = getTherapistById(route.params.therapistId);
  const hasValidBooking =
    Boolean(route.params.therapistId) &&
    Boolean(route.params.date) &&
    Boolean(route.params.time) &&
    Boolean(route.params.price);

  const base = parsePrice(route.params.price);
  const discount = appliedPromo?.valid ? appliedPromo.discountAmount ?? 0 : 0;
  const tax = Math.round(Math.max(0, base - discount) * 0.18);
  const total = Math.max(0, base - discount + tax);

  const summaryLines = useMemo(
    () => [
      { label: 'Session', amount: route.params.price },
      {
        label: discount ? `Discount (${appliedPromo?.code})` : 'Discount',
        amount: discount ? `-₹${discount}` : '₹0',
        muted: true,
      },
      { label: 'Taxes (GST 18%)', amount: `₹${tax}` },
      { label: 'Total', amount: `₹${total}`, emphasize: true },
    ],
    [appliedPromo?.code, discount, route.params.price, tax, total],
  );

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!hasValidBooking) {
      setError('Booking details are incomplete');
      return;
    }
    if (!selectedPaymentMethod || METHODS.find((m) => m.id === selectedPaymentMethod)?.soon) {
      setError('Please select a payment method');
      return;
    }

    setError(null);
    setPhase('loading');

    try {
      let booking = lastBooking;
      if (!booking?.paymentUrl) {
        booking = await createBooking();
      }

      if (!booking.paymentUrl) {
        setPhase('bookingFailed');
        return;
      }

      // Gateway methods beyond upi/card/wallet map to wallet for mock verify flow
      const gatewayMethod: PaymentMethod =
        selectedPaymentMethod === 'netbanking' ||
        selectedPaymentMethod === 'care_credits'
          ? 'wallet'
          : selectedPaymentMethod === 'apple_pay' ||
              selectedPaymentMethod === 'google_pay'
            ? 'upi'
            : selectedPaymentMethod;

      await completePaymentFlow({
        bookingId: booking.id,
        paymentUrl: booking.paymentUrl,
        method: gatewayMethod,
      });

      await fetchSessions();
      navigation.navigate('PaymentSuccess', {
        transactionId: `TXN-HA-${booking.id.slice(-6).toUpperCase()}`,
        receiptId: `RCP-${booking.id.slice(-4).toUpperCase()}`,
        amountLabel: `₹${total}`,
        title: 'Session booked',
        kind: 'session',
      });
      setPhase('form');
    } catch {
      navigation.navigate('PaymentFailure', {
        message: 'Payment could not be completed. Try another method.',
      });
      setPhase('form');
    }
  };

  if (phase === 'loading') {
    return (
      <AppScreen scrollable={false} includeBottomInset gradient="none">
        <LoadingIllustration domain="session" />
      </AppScreen>
    );
  }

  if (phase === 'paymentFailed') {
    return (
      <AppScreen scrollable={false} includeBottomInset gradient="none">
        <PaymentFailedState onRetry={() => setPhase('form')} />
      </AppScreen>
    );
  }

  if (phase === 'bookingFailed') {
    return (
      <AppScreen scrollable={false} includeBottomInset gradient="none">
        <BookingFailedState onRetry={() => setPhase('form')} />
      </AppScreen>
    );
  }

  return (
    <FormScreen>
      <AppHeader title="Proceed Booking" onBack={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 24 }}>
        <BookingProgress current="payment" />
      </View>

      <AppCard style={styles.summaryCard}>
        {therapist ? (
          <TherapistCard
            therapist={{
              id: therapist.id,
              name: therapist.name,
              specialty: therapist.specialty,
              imageUrl: therapist.profileImageUrl,
              image: getTherapistImageSource(therapist),
            }}
            compact
          />
        ) : null}
        <View style={styles.bookingDetails}>
          <Text style={styles.detailText}>{route.params.date}</Text>
          <Text style={styles.detailText}>{route.params.time}</Text>
        </View>
      </AppCard>

      <PaymentSummaryCard lines={summaryLines} />

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

      <Text style={styles.sectionTitle}>Choose payment method</Text>
      {METHODS.map((m) => (
        <View key={m.id} style={m.soon ? styles.soon : undefined}>
          <PaymentOptionCard
            label={m.soon ? `${m.label} (Soon)` : m.label}
            icon={m.icon}
            selected={selectedPaymentMethod === m.id}
            onPress={() => {
              if (m.soon) return;
              setSelectedPaymentMethod(m.id);
              setError(null);
            }}
          />
        </View>
      ))}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <PrimaryButton
        label="Confirm Payment"
        onPress={() => setConfirmOpen(true)}
        showArrow
        loading={paymentStatus === 'loading'}
        disabled={!hasValidBooking || paymentStatus === 'loading'}
      />

      <BillingConfirmDialog
        visible={confirmOpen}
        title="Confirm payment"
        message={`Pay ₹${total} for your session with ${route.params.name}?`}
        primaryLabel="Pay now"
        secondaryLabel="Cancel"
        onSecondary={() => setConfirmOpen(false)}
        onPrimary={handleConfirm}
      />
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    marginBottom: Spacing.md,
  },
  bookingDetails: {
    marginTop: Spacing.sm,
  },
  detailText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginBottom: Spacing.sm,
  },
  soon: { opacity: 0.55 },
});
