import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RazorpayCheckout from 'react-native-razorpay';
import { Icon } from '../../components/app/Icon';
import { billingRepository } from '../../repositories/BillingRepository';
import { profileRepository } from '../../repositories/ProfileRepository';
import { revenueCatService } from '../../services/billing/revenueCatService';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';
import { MainStackParamList } from '../../navigation/types';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

import { CLOUDINARY_BANNER_BG_URL } from '../../assets';
import {
  BillingPeriod,
  BillingPeriodSelector,
  BILLING_PERIOD_CONFIGS,
} from '../../components/billing/BillingPeriodSelector';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const SubscriptionComparisonScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [period, setPeriod] = useState<BillingPeriod>('monthly');
  const [submitting, setSubmitting] = useState(false);

  const loadProfile = useProfileStore((s) => s.initialize);

  React.useEffect(() => {
    async function syncBackendSubscription() {
      try {
        await profileRepository.getMobileMe();
        await loadProfile();
        await useBillingStore.getState().fetchBillingHome();
      } catch {
        // Fallback
      }
    }
    void syncBackendSubscription();
  }, [loadProfile]);

  const activePeriodConfig = BILLING_PERIOD_CONFIGS[period];
  const currentPriceDisplay = activePeriodConfig.priceDisplay;
  const currentBilledSubtext = activePeriodConfig.billedSubtext;
  const checkoutAmount = activePeriodConfig.checkoutAmount;

  const personalInfo = useProfileStore((s) => s.personalInfo);

  const openExternalDocument = async (url: string) => {
    void hapticSelection();
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.warn('[DOCUMENT_LINK] Failed to open URL:', url, err);
    }
  };

  const handleRestorePurchases = async () => {
    void hapticSelection();
    setSubmitting(true);
    try {
      await revenueCatService.restorePurchases();
      await profileRepository.getMobileMe();
      await loadProfile();
      void hapticSuccess();
      Alert.alert('Purchases Restored', 'Your subscription purchases have been restored successfully.');
    } catch (err: any) {
      Alert.alert('Restore Failed', err?.message || 'Could not restore purchases. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetPremium = async () => {
    void hapticLight();
    setSubmitting(true);

    try {
      if (Platform.OS === 'ios') {
        const offerings = await revenueCatService.getOfferings();
        const currentOffering = offerings?.current;
        if (!currentOffering) {
          Alert.alert(
            'Subscriptions Unavailable',
            'In-App Purchase products are currently being configured in App Store Connect. Please try again later.',
          );
          return;
        }

        const targetPackage =
          period === 'annual'
            ? currentOffering.annual
            : period === 'semester'
            ? currentOffering.sixMonth
            : currentOffering.monthly;

        if (!targetPackage) {
          Alert.alert('Package Unavailable', 'Selected subscription plan is not available.');
          return;
        }

        const result = await revenueCatService.purchasePackage(targetPackage);
        if (result) {
          void hapticSuccess();
          await profileRepository.getMobileMe();
          await loadProfile();
          Alert.alert(
            'Upgrade Successful! 🎉',
            'You are now subscribed to Hey Attrangi Premium.',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
          );
        }
        return;
      }

      // 1. Call production backend to create Razorpay Order
      const orderRes = await billingRepository.createSubscriptionOrder(
        'PREMIUM',
        checkoutAmount,
      );

      const orderId = orderRes?.orderId || orderRes?.order?.id;
      const orderAmount = orderRes?.amount || orderRes?.order?.amount || (checkoutAmount * 100);
      const razorpayKey = orderRes?.key || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;

      if (!orderId) {
        throw new Error('Could not create subscription order.');
      }

      const prefillObj: any = {};
      if (personalInfo?.email) {
        prefillObj.email = personalInfo.email;
      }
      if (personalInfo?.fullName) {
        prefillObj.name = personalInfo.fullName;
      }
      if (personalInfo?.phone && personalInfo.phone.trim().length > 0) {
        prefillObj.contact = personalInfo.phone.trim();
      }

      // 2. Launch Razorpay native checkout
      const options: any = {
        description: 'Companion Plan Subscription',
        currency: orderRes?.currency || orderRes?.order?.currency || 'INR',
        key: razorpayKey,
        amount: orderAmount,
        name: 'Hey Attrangi',
        order_id: orderId,
        theme: { color: '#FF6B00' },
      };

      if (Object.keys(prefillObj).length > 0) {
        options.prefill = prefillObj;
      }

      const keyPrefix = razorpayKey ? razorpayKey.substring(0, 8) : 'unknown';
      console.log(
        `[RZP][ORDER_CREATED] orderId=${orderId} amount=${orderAmount} currency=${options.currency} keyPrefix=${keyPrefix}`,
      );

      const razorpayData: any = await RazorpayCheckout.open(options);

      // 3. Verify Razorpay signature with backend
      const verifyRes = await billingRepository.verifySubscription({
        razorpay_order_id: razorpayData.razorpay_order_id,
        razorpay_payment_id: razorpayData.razorpay_payment_id,
        razorpay_signature: razorpayData.razorpay_signature,
        plan: 'PREMIUM',
        amount: checkoutAmount,
      });

      if (verifyRes.success) {
        void hapticSuccess();
        await profileRepository.getMobileMe();
        await loadProfile();
        Alert.alert(
          'Upgrade Successful! 🎉',
          'You are now subscribed to Hey Attrangi Premium.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Verification Failed',
          verifyRes.message || 'Payment verification failed.',
        );
      }
    } catch (err: any) {
      const errCode = err?.code;
      const errDescription = err?.description || err?.message || '';

      const isUserCancellation =
        errCode === 2 &&
        String(errDescription).toLowerCase().includes('cancel');

      if (!isUserCancellation) {
        Alert.alert(
          'Payment Error',
          "Payment couldn't be completed. Please try again or use another payment method.",
          [
            { text: 'Try Again', onPress: () => void handleGetPremium() },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const activePlanId = useBillingStore((s) => s.activePlanId);
  const userPlan = useProfileStore((s) => s.userPlan);
  const isPremiumUser =
    activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

  return (
    <View style={[styles.screenRoot, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 32 },
        ]}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              void hapticLight();
              navigation.goBack();
            }}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription</Text>
        </View>

        {/* MAIN PREMIUM CARD */}
        <View style={styles.cardShadow}>
          <View style={styles.cardClip}>
            {/* Top Pastel Gradient Section */}
            <ImageBackground
              source={{ uri: CLOUDINARY_BANNER_BG_URL }}
              style={styles.cardTopGradient}
              imageStyle={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
              resizeMode="cover"
            >
              <View style={styles.premiumHeaderBadgeRow}>
                <Icon name="star-four-points" size={16} color="#0F172A" />
                <Text style={styles.premiumHeaderBadge}>
                  {isPremiumUser ? 'CURRENT PLAN — PREMIUM ACTIVE' : 'PREMIUM'}
                </Text>
              </View>

              {/* Segmented Billing Period Control */}
              <BillingPeriodSelector selectedPeriod={period} onSelectPeriod={setPeriod} />

              {/* Dynamic Price Display */}
              <View style={styles.priceRow}>
                <Text style={styles.priceBig}>{currentPriceDisplay}</Text>
                <Text style={styles.pricePeriod}>/ month</Text>
              </View>
              <Text style={styles.subtextBilled}>{currentBilledSubtext}</Text>

              {/* Premium Description */}
              <Text style={styles.premiumDescription}>
                {isPremiumUser
                  ? 'Your Premium plan is active and you now have access to all Premium features.'
                  : 'More space to understand yourself - with longer continuity and personalized support.'}
              </Text>

              {/* CTA BUTTON VS PREMIUM ACTIVE STATUS BADGE */}
              {isPremiumUser ? (
                <View style={styles.activePlanBadge}>
                  <Icon name="crown" size={18} color="#F59E0B" />
                  <Text style={styles.activePlanBadgeText}>Current Plan — Premium Active</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.getPremiumBtn}
                  onPress={handleGetPremium}
                  activeOpacity={0.88}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.getPremiumBtnText}>Get Premium</Text>
                  )}
                </TouchableOpacity>
              )}
            </ImageBackground>

            {/* Bottom White Includes Section */}
            <View style={styles.featuresSection}>
              <Text style={styles.includesTitle}>Includes</Text>

              {[
                '150 AI messages/day',
                'Full listening library',
                'Unlimited assessments',
                '1 year of history',
                'Personalized reminders',
              ].map((feat) => (
                <View key={feat} style={styles.featureItemRow}>
                  <View style={styles.blueCheckCircle}>
                    <Icon name="check-bold" size={11} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}

              <Text style={styles.cancelAnytimeText}>Cancel anytime.</Text>

              <View style={styles.legalLinksRow}>
                <TouchableOpacity
                  onPress={() => void openExternalDocument('https://www.heyattrangi.com/terms-and-conditions')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.legalLinkText}>Terms</Text>
                </TouchableOpacity>
                <Text style={styles.legalLinkSep}>·</Text>
                <TouchableOpacity
                  onPress={() => void openExternalDocument('https://www.heyattrangi.com/privacy-policy')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.legalLinkText}>Privacy Policy</Text>
                </TouchableOpacity>
                {Platform.OS === 'ios' && (
                  <>
                    <Text style={styles.legalLinkSep}>·</Text>
                    <TouchableOpacity
                      onPress={handleRestorePurchases}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.legalLinkText}>Restore Purchases</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Skip Action */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => {
            void hapticLight();
            navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.skipBtnText}>Skip, continue with Free Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },
  cardClip: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  cardTopGradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
  },
  premiumHeaderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  premiumHeaderBadge: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.5,
  },
  segmentedControlBar: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    borderRadius: 24,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  discountBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  discountBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#047857',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 2,
  },
  priceBig: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0F172A',
  },
  pricePeriod: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  subtextBilled: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 14,
  },
  premiumDescription: {
    fontSize: 13.5,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 19,
    marginBottom: 20,
  },
  getPremiumBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  getPremiumBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  activePlanBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 24,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  activePlanBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
  },
  featuresSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
  },
  includesTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  blueCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  cancelAnytimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  legalLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  legalLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textDecorationLine: 'underline',
  },
  legalLinkSep: {
    fontSize: 11,
    color: '#94A3B8',
  },
  skipBtn: {
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  skipBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF6000',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
