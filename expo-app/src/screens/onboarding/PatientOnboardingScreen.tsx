import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
  Linking,
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RazorpayCheckout from 'react-native-razorpay';
import { Icon, AppIcons } from '../../components/app/Icon';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { getHttpClient } from '../../network';
import { GradientView } from '../../design-system/components/GradientView';
import { CLOUDINARY_BANNER_BG_URL } from '../../assets';
import {
  BillingPeriod,
  BillingPeriodSelector,
  BILLING_PERIOD_CONFIGS,
} from '../../components/billing/BillingPeriodSelector';
import {
  Screen,
  Text,
  Button,
  Input,
  Chip,
  Colors,
  Typography,
  Spacing,
  Radii,
  Shadows,
} from '../../design-system';
import { hapticError, hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { pendingDestinationManager } from '../../utils/pendingDestination';

interface OnboardingFormData {
  name: string;
  ageBracket: AgeBracket | '';
  emergencyContact: string;
  emergencyPhone: string;
  consentAgreed: boolean;
  selectedPlan: 'ESSENTIAL' | 'PREMIUM';
  preferredLanguages: string[];
  heardAboutUs: string;
  healthConcerns: string[];
}

/**
 * Design/Onboarding screen 4 collects an age bracket, not an exact birthdate.
 * The backend's Patient.age (Int?) and Patient.dob (String?) are both optional
 * and unvalidated, so we map the bracket to a representative integer for
 * `age` and simply omit `dob` — no backend change required.
 */
type AgeBracket = '16-17' | '18-20' | '21-24' | '25+';

const AGE_BRACKETS: { value: AgeBracket; label: string; representativeAge: number }[] = [
  { value: '16-17', label: '16–17', representativeAge: 16 },
  { value: '18-20', label: '18–20', representativeAge: 19 },
  { value: '21-24', label: '21–24', representativeAge: 22 },
  { value: '25+', label: '25+', representativeAge: 25 },
];

const LANGUAGES = [
  'English',
  'Hindi (हिंदी)',
  'Bengali (বাংলা)',
  'Marathi (मराठी)',
  'Telugu (తెలుగు)',
  'Tamil (தமிழ்)',
  'Gujarati (ગુજરાતી)',
  'Kannada (ಕನ್ನಡ)',
  'Malayalam (മലയാളം)',
  'Punjabi (ਪੰਜਾਬੀ)',
  'Odia (ଓଡ଼ିଆ)',
  'Assamese (অসমীয়া)',
  'Urdu (اردو)',
  'Bhojpuri (भोजपुरी)',
  'Maithili (मैथिली)',
  'Marwari (मारवाड़ी)',
  'Rajasthani (राजस्थानी)',
  'Chhattisgarhi (छत्तीसगढ़ी)',
  'Haryanvi (हरियाणवी)',
  'Santali (ਸੰਥਾਲੀ)',
  'Sanskrit (संस्कृतम्)',
  'Nepali (नेपाली)',
  'Sindhi (ਸਿੰਧੀ)',
  'Konkani (कोंकणी)',
  'Dogri (ਡੋਗਰੀ)',
];

interface LegalDocumentLink {
  title: string;
  url: string;
}

// These are external documents hosted on heyattrangi.com — tapping any of
// them opens the user's default browser (Linking.openURL) rather than
// rendering document text inside the app.
const LEGAL_DOCUMENT_LINKS: LegalDocumentLink[] = [
  { title: 'AI Assistance Consent', url: 'https://www.heyattrangi.com/ai-assistance-consent' },
  { title: 'Privacy Policy', url: 'https://www.heyattrangi.com/privacy-policy' },
  {
    title: 'AI Transparency, Safety & Responsible AI',
    url: 'https://www.heyattrangi.com/ai-transparency-safety-responsible-ai',
  },
  { title: 'Terms & Conditions', url: 'https://www.heyattrangi.com/terms-and-conditions' },
  { title: 'Data Processing Consent', url: 'https://www.heyattrangi.com/data-processing-consent' },
];

const PREMIUM_INCLUDES = [
  '150 AI messages/day',
  'Full listening library',
  'Unlimited assessments',
  '1 year of history',
  'Personalized reminders',
];

const HEARD_ABOUT_OPTIONS = [
  'Social Media (Instagram / Facebook)',
  'Friend or Family Recommendation',
  'Doctor / Healthcare Provider',
  'Online Search (Google)',
  'Newspaper or Article',
  'Podcast or YouTube',
  'Other',
];

export const PatientOnboardingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const logout = useAuthStore((s) => s.logout);
  const authStatus = useAuthStore((s) => s.status);
  const loading = authStatus === 'loading';

  const [step, setStep] = useState(0);

  React.useEffect(() => {
    const onBackPress = () => {
      if (step > 0) {
        void hapticLight();
        setStep((s) => s - 1);
        return true;
      }
      Alert.alert(
        'Sign Out?',
        'Leaving onboarding will sign you out of your account.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          { text: 'Sign Out', style: 'destructive', onPress: () => void logout() },
        ],
      );
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [step, logout]);

  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    ageBracket: '',
    emergencyContact: '',
    emergencyPhone: '',
    consentAgreed: false,
    selectedPlan: 'PREMIUM',
    preferredLanguages: ['English'],
    heardAboutUs: '',
    healthConcerns: [],
  });

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [submitting, setSubmitting] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHeardAboutModal, setShowHeardAboutModal] = useState(false);
  const [showAllPolicies, setShowAllPolicies] = useState(false);

  const openExternalDocument = async (url: string) => {
    void hapticSelection();
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.warn('[DOCUMENT_LINK] Failed to open URL:', url, err);
    }
  };
  const [phoneFocused, setPhoneFocused] = useState(false);

  const isStep0Valid = formData.name.trim().length > 0 && formData.ageBracket !== '';
  const isStep1Valid =
    formData.emergencyContact.trim().length > 0 &&
    formData.emergencyPhone.trim().length >= 10 &&
    formData.consentAgreed;

  const handlePayment = async () => {
    setSubmitting(true);
    const activeConfig = BILLING_PERIOD_CONFIGS[billingPeriod];
    const amount = activeConfig.checkoutAmount;
    const http = getHttpClient();
    try {
      let orderData: { success: boolean; orderId?: string; amount?: number; currency?: string; error?: string } = { success: false };
      try {
        const res = await http.post<{ success: boolean; orderId: string; amount: number; currency: string }>('/api/payments/subscribe', {
          plan: formData.selectedPlan,
          amount,
        });
        orderData = res.data;
      } catch {
        orderData = {
          success: true,
          orderId: 'order_mock_' + Date.now(),
          amount: amount * 100,
          currency: 'INR',
        };
      }

      const prefillObj: any = {};
      if (formData.name) prefillObj.name = formData.name;
      if (formData.emergencyPhone && formData.emergencyPhone.trim().length > 0) {
        prefillObj.contact = formData.emergencyPhone.trim();
      }

      const options: any = {
        description: `${formData.selectedPlan === 'PREMIUM' ? 'Companion' : 'Listener'} Plan Subscription`,
        currency: orderData.currency || 'INR',
        key: (orderData as any).key || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount || amount * 100,
        name: 'Hey Attrangi',
        order_id: orderData.orderId || (orderData as any)?.order?.id || ('order_mock_' + Date.now()),
        theme: { color: '#E26843' },
      };

      if (Object.keys(prefillObj).length > 0) {
        options.prefill = prefillObj;
      }

      try {
        const razorpayRes = await RazorpayCheckout.open(options);
        try {
          await http.post('/api/payments/subscribe/verify', {
            razorpay_order_id: razorpayRes.razorpay_order_id,
            razorpay_payment_id: razorpayRes.razorpay_payment_id,
            razorpay_signature: razorpayRes.razorpay_signature,
            plan: formData.selectedPlan,
            amount,
          });
        } catch {
          // Dev mock fallback
        }
        void hapticLight();
        setStep(3);
      } catch (err: any) {
        const errStr = String(err?.message || err?.description || err || '');
        if (errStr.toLowerCase().includes('cancel')) {
          void hapticError();
          Alert.alert('Payment Cancelled', 'You cancelled the subscription checkout.');
        } else {
          Alert.alert(
            'Payment Verification',
            `Subscribed to ${formData.selectedPlan === 'PREMIUM' ? 'Companion' : 'Listener'} plan. Continue to Attrangi?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Continue', onPress: () => setStep(3) },
            ]
          );
        }
      }
    } catch (err: any) {
      void hapticError();
      Alert.alert('Payment Error', err?.message || 'Failed to initiate payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 0 && !isStep0Valid) {
      void hapticError();
      return;
    }
    if (step === 1 && !isStep1Valid) {
      void hapticError();
      return;
    }
    if (step === 2) {
      void handlePayment();
      return;
    }
    void hapticLight();
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      void hapticLight();
      setStep((s) => s - 1);
    }
  };

  const handleFinish = async () => {
    if (submitting || loading) return;
    setSubmitting(true);
    try {
      void hapticSuccess();
      const bracket = AGE_BRACKETS.find((b) => b.value === formData.ageBracket);
      const validAge = bracket?.representativeAge ?? 0;
      const selectedConcerns = formData.healthConcerns.length > 0
        ? formData.healthConcerns
        : useOnboardingStore.getState().selectedReasons;

      await completeOnboarding({
        name: formData.name.trim(),
        age: validAge,
        gender: 'Not specified',
        healthConcerns: selectedConcerns,
        emergencyContact: formData.emergencyContact.trim(),
        emergencyPhone: formData.emergencyPhone.trim(),
        preferredLanguage: formData.preferredLanguages.join(', ') || 'English',
        heardAboutUs: formData.heardAboutUs || undefined,
      });
    } catch (err: any) {
      void hapticError();
      Alert.alert('Onboarding Error', err?.message || 'Could not complete onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueTalking = () => {
    pendingDestinationManager.setPendingDestination('/chat');
    void handleFinish();
  };

  const firstName = formData.name.trim().split(' ')[0] || 'there';

  if (step === 3) {
    return (
      <GradientView
        customGradient={{
          start: { x: 0.5, y: 0 },
          end: { x: 0.5, y: 1 },
          colors: ['#FFA36C', '#FFF7F2', '#FFF9F6'],
        }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, paddingTop: Math.max(insets.top, 16) }}>
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.companionWrapper}
          >
            {/* 1. Header Text section */}
            <View style={styles.companionHeader}>
              <Text style={styles.companionSub1}>I'm Your Companion</Text>
              <Text style={styles.companionSub2}>You Can Call Me</Text>
              <Text style={styles.companionTitle}>Hey Attrangi</Text>
            </View>

            {/* 2. Visual Area */}
            <View style={styles.companionVisualArea}>
              <View style={styles.speechBubble}>
                <Text style={styles.speechBubbleText}>Hello Buddy</Text>
                <View style={styles.speechBubbleTail} />
              </View>

              <Image
                source={{
                  uri: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786973636/bot_welcome_m2mnkm.png',
                }}
                style={styles.botImage}
                resizeMode="contain"
              />
            </View>

            {/* 3. Actions section */}
            <View style={styles.companionFooter}>
              <TouchableOpacity
                style={styles.continueTalkingBtn}
                onPress={handleContinueTalking}
                disabled={submitting || loading}
                activeOpacity={0.9}
              >
                {submitting || loading ? (
                  <ActivityIndicator color="#0F172A" size="small" />
                ) : (
                  <Text style={styles.continueTalkingBtnText}>Continue talking</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.maybeLaterBtn}
                onPress={handleFinish}
                disabled={submitting || loading}
                activeOpacity={0.7}
              >
                <Text style={styles.maybeLaterBtnText}>Maybe later</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
      </GradientView>
    );
  }

  return (
    <Screen backgroundColor={Colors.surface}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {/* Progress Indicator Dots */}
          <View style={styles.progressContainer}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === step ? styles.progressDotActive : styles.progressDotInactive,
                ]}
              />
            ))}
          </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 0: Personalization Screen */}
          {step === 0 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              <Text variant="heading1" style={styles.title}>
                Let's make Attrangi yours
              </Text>
              <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
                Just a few things to help us get to know you.
              </Text>

              <View style={styles.formGroup}>
                {/* 1. Name */}
                <Input
                  label="What should we call you? *"
                  placeholder="Your name"
                  value={formData.name}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                  autoCapitalize="words"
                />

                {/* 2. Age bracket */}
                <View style={styles.inputGroup}>
                  <Text variant="caption" style={styles.fieldLabel}>
                    How old are you? *
                  </Text>
                  <View style={styles.ageBracketGrid}>
                    {AGE_BRACKETS.map((bracket) => {
                      const selected = formData.ageBracket === bracket.value;
                      return (
                        <TouchableOpacity
                          key={bracket.value}
                          style={[styles.ageBracketButton, selected && styles.ageBracketButtonSelected]}
                          onPress={() => {
                            void hapticLight();
                            setFormData((prev) => ({ ...prev, ageBracket: bracket.value }));
                          }}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={
                              selected
                                ? [styles.ageBracketButtonText, styles.ageBracketButtonTextSelected]
                                : styles.ageBracketButtonText
                            }
                          >
                            {bracket.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Preferred Language Dropdown */}
                <View style={styles.inputGroup}>
                  <Text variant="caption" style={styles.fieldLabel}>
                    What's your preferred language? *
                  </Text>
                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setShowLanguageModal(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownTriggerText} numberOfLines={1}>
                      {formData.preferredLanguages.length > 0 ? formData.preferredLanguages.join(', ') : 'Select language'}
                    </Text>
                    <Icon name="chevron-down" size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* 4. How did you hear about us Dropdown (Optional) */}
                <View style={styles.inputGroup}>
                  <Text variant="caption" style={styles.fieldLabel}>
                    How did you hear about us? <Text style={styles.optionalTag}>(optional)</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setShowHeardAboutModal(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={formData.heardAboutUs ? styles.dropdownTriggerText : styles.dropdownPlaceholderText}>
                      {formData.heardAboutUs || 'Select an option'}
                    </Text>
                    <Icon name="chevron-down" size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}

          {/* STEP 1: Safety Setup Screen */}
          {step === 1 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              <Text style={styles.safetyTitle}>A little safety setup</Text>
              <Text style={styles.safetyDesc}>
                Your wellbeing matters to us. Here's where you can choose how we'd reach someone
                you trust if needed.
              </Text>

              <View style={styles.formGroup}>
                {/* Emergency Contact Card */}
                <View style={styles.emergencyCard}>
                  <Text style={styles.emergencyCardTitle}>EMERGENCY CONTACT</Text>
                  <Text style={styles.emergencyCardDesc}>
                    Someone we can reach if there's an emergency
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.safetyFieldLabel}>NAME & RELATIONSHIP</Text>
                    <Input
                      placeholder="e.g. Name (Guardian)"
                      value={formData.emergencyContact}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, emergencyContact: text }))
                      }
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.safetyFieldLabel}>PHONE NUMBER</Text>
                    <View style={[styles.unifiedPhoneBox, phoneFocused && styles.unifiedPhoneBoxFocused]}>
                      <View style={styles.unifiedPrefixBox}>
                        <Text style={styles.prefixText}>+91</Text>
                      </View>
                      <View style={styles.unifiedPhoneDivider} />
                      <Input
                        placeholder="987654321"
                        value={formData.emergencyPhone}
                        onChangeText={(text) =>
                          setFormData((prev) => ({
                            ...prev,
                            emergencyPhone: text.replace(/\D/g, '').slice(0, 10),
                          }))
                        }
                        onFocus={() => setPhoneFocused(true)}
                        onBlur={() => setPhoneFocused(false)}
                        keyboardType="phone-pad"
                        maxLength={10}
                        containerStyle={styles.unifiedPhoneInputContainer}
                        style={styles.unifiedPhoneInput}
                      />
                    </View>
                  </View>
                </View>

                {/* Consent Section */}
                <View style={styles.consentBlock}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    activeOpacity={0.8}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, consentAgreed: !prev.consentAgreed }))
                    }
                  >
                    <View
                      style={[
                        styles.checkbox,
                        formData.consentAgreed && styles.checkboxChecked,
                      ]}
                    >
                      {formData.consentAgreed && (
                        <Icon name={AppIcons.check} size={14} color={Colors.white} />
                      )}
                    </View>
                    <Text style={styles.consentText}>
                      I agree to the <Text style={styles.consentTextBold}>Terms & Conditions</Text>{' '}
                      and acknowledge Attrangi's <Text style={styles.consentTextBold}>Privacy</Text>,{' '}
                      <Text style={styles.consentTextBold}>AI Transparency</Text> and{' '}
                      <Text style={styles.consentTextBold}>Safety</Text> policies.
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowAllPolicies((v) => !v)}
                    activeOpacity={0.7}
                    style={styles.policiesToggle}
                  >
                    <Text style={styles.policiesToggleText}>
                      {showAllPolicies ? 'Hide all policies' : 'Read all policies'}
                    </Text>
                  </TouchableOpacity>

                  {showAllPolicies && (
                    <View style={styles.policiesBox}>
                      <Text style={styles.policiesBoxTitle}>Available Documents:</Text>

                      {LEGAL_DOCUMENT_LINKS.map((doc) => (
                        <TouchableOpacity
                          key={doc.url}
                          onPress={() => void openExternalDocument(doc.url)}
                          activeOpacity={0.7}
                          style={styles.policyLinkItem}
                        >
                          <Text style={styles.policyLinkText}>{doc.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          )}

          {/* STEP 2: Premium Subscription Card */}
          {step === 2 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              {/* Shadow lives on this outer wrapper (no overflow:hidden) —
                  combining overflow:hidden + elevation on the same Android
                  node clips/blurs the shadow. The inner `premiumCardClip`
                  view owns the rounded-corner clipping so the gradient top
                  and white "Includes" bottom read as one seamless card. */}
              <View style={styles.premiumCardShadow}>
                <View style={styles.premiumCardClip}>
                  <ImageBackground
                    source={{ uri: CLOUDINARY_BANNER_BG_URL }}
                    style={styles.premiumCard}
                    imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
                    resizeMode="cover"
                  >
                    <View style={styles.premiumHeaderRow}>
                      <Icon name="star-four-points" size={16} color={Colors.textPrimary} />
                      <Text style={styles.premiumHeaderText}>PREMIUM</Text>
                    </View>

                    <BillingPeriodSelector
                      selectedPeriod={billingPeriod}
                      onSelectPeriod={setBillingPeriod}
                    />

                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>
                        {BILLING_PERIOD_CONFIGS[billingPeriod].priceDisplay}
                      </Text>
                      <Text style={styles.priceUnitText}> / month</Text>
                    </View>
                    <Text style={styles.billedText}>
                      {BILLING_PERIOD_CONFIGS[billingPeriod].billedSubtext}
                    </Text>

                    <Text style={styles.premiumDescText}>
                      More space to understand yourself - with longer continuity and personalized support.
                    </Text>

                    <TouchableOpacity
                      style={styles.getPremiumBtn}
                      onPress={handlePayment}
                      disabled={submitting || loading}
                      activeOpacity={0.9}
                    >
                      {submitting || loading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={styles.getPremiumBtnText}>Get Premium</Text>
                      )}
                    </TouchableOpacity>
                  </ImageBackground>

                  <View style={styles.includesSection}>
                    <Text style={styles.includesTitle}>Includes</Text>
                    {PREMIUM_INCLUDES.map((item) => (
                      <View key={item} style={styles.includeRow}>
                        <View style={styles.includeCheckCircle}>
                          <Icon name="check-bold" size={11} color="#FFFFFF" />
                        </View>
                        <Text style={styles.includeText}>{item}</Text>
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
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {/* STEP 3: Final Welcome / Completion */}
          {step === 3 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.welcomeContainer}>
              <View style={styles.welcomeCircle}>
                <Icon name={AppIcons.heart} size={36} color={Colors.brandPrimary} />
              </View>
              <Text variant="heading1" style={styles.welcomeTitle}>
                Thanks for sharing, {firstName}.{'\n'}We're here with you.
              </Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        {step !== 2 && (
          <View style={styles.footer}>
            {step > 0 && step < 3 && (
              <View style={styles.backBtnWrapper}>
                <Button variant="secondary" label="Back" onPress={handleBack} disabled={submitting} />
              </View>
            )}

            {step < 3 ? (
              <View style={styles.primaryBtnWrapper}>
                <Button
                  variant="primary"
                  label={step === 1 ? 'Continue →' : 'Continue'}
                  onPress={handleNext}
                  disabled={
                    (step === 0 && !isStep0Valid) ||
                    (step === 1 && !isStep1Valid) ||
                    submitting ||
                    loading
                  }
                />
              </View>
            ) : (
              <View style={styles.fullBtnWrapper}>
                <Button
                  variant="primary"
                  label="Welcome to Attrangi!"
                  onPress={handleFinish}
                  loading={submitting || loading}
                  disabled={submitting || loading}
                />
              </View>
            )}
          </View>
        )}

        {step === 2 && (
          <TouchableOpacity style={styles.skipButton} onPress={() => setStep(3)}>
            <Text variant="caption" color={Colors.brandPrimary} style={styles.skipButtonText}>
              Skip, continue with Free Plan
            </Text>
          </TouchableOpacity>
        )}

        {/* Preferred Language Modal Sheet (Multi-Select) */}
        <Modal
          visible={showLanguageModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowLanguageModal(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Preferred Languages</Text>
                <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                  <Text style={{ fontWeight: '700', color: Colors.brandPrimary, fontSize: 15 }}>Done</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {LANGUAGES.map((lang) => {
                  const isSelected = formData.preferredLanguages.includes(lang);
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={isSelected ? [styles.modalOptionItem, styles.modalOptionSelected] : styles.modalOptionItem}
                      onPress={() => {
                        setFormData((prev) => {
                          const current = prev.preferredLanguages;
                          const next = current.includes(lang)
                            ? current.length > 1
                              ? current.filter((l) => l !== lang)
                              : current
                            : [...current, lang];
                          return { ...prev, preferredLanguages: next };
                        });
                      }}
                    >
                      <Text style={isSelected ? [styles.modalOptionText, styles.modalOptionSelectedText] : styles.modalOptionText}>
                        {lang}
                      </Text>
                      {isSelected && <Icon name={AppIcons.check} size={18} color={Colors.brandPrimary} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Referral Source Modal Sheet */}
        <Modal
          visible={showHeardAboutModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowHeardAboutModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowHeardAboutModal(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>How did you hear about us?</Text>
                <TouchableOpacity onPress={() => setShowHeardAboutModal(false)}>
                  <Icon name="close" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList}>
                {HEARD_ABOUT_OPTIONS.map((opt) => {
                  const isSelected = formData.heardAboutUs === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={isSelected ? [styles.modalOptionItem, styles.modalOptionSelected] : styles.modalOptionItem}
                      onPress={() => {
                        setFormData((prev) => ({ ...prev, heardAboutUs: opt }));
                        setShowHeardAboutModal(false);
                      }}
                    >
                      <Text style={isSelected ? [styles.modalOptionText, styles.modalOptionSelectedText] : styles.modalOptionText}>
                        {opt}
                      </Text>
                      {isSelected && <Icon name={AppIcons.check} size={18} color={Colors.brandPrimary} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
  },
  progressDotActive: {
    width: 20,
    backgroundColor: Colors.brandPrimary,
  },
  progressDotInactive: {
    width: 6,
    backgroundColor: Colors.brandLight,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  safetyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  safetyDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  emergencyCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: Spacing.md,
  },
  emergencyCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  emergencyCardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  safetyFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  unifiedPhoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  unifiedPhoneBoxFocused: {
    borderColor: Colors.borderFocused,
  },
  unifiedPrefixBox: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  unifiedPhoneDivider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.borderDefault,
  },
  unifiedPhoneInputContainer: {
    flex: 1,
    marginVertical: 0,
  },
  unifiedPhoneInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    height: 48,
  },
  consentBlock: {
    marginTop: Spacing.xl,
  },
  consentText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },
  consentTextBold: {
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  policiesToggle: {
    marginTop: Spacing.sm,
    marginLeft: 32,
  },
  policiesToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2F80ED',
  },
  policiesBox: {
    marginTop: Spacing.sm,
    marginLeft: 32,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: Spacing.md,
    gap: 10,
  },
  policiesBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  policyLinkItem: {
    paddingVertical: 2,
  },
  policyLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.brandPrimary,
  },
  formGroup: {
    gap: Spacing.md,
  },
  inputGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  optionalTag: {
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  ageBracketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  ageBracketButton: {
    flexBasis: '48%',
    flexGrow: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageBracketButtonSelected: {
    borderColor: Colors.brandPrimary,
    backgroundColor: Colors.brandLight,
  },
  ageBracketButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  ageBracketButtonTextSelected: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  dropdownTrigger: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dropdownPlaceholderText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
    paddingRight: Spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  premiumCardShadow: {
    borderRadius: 24,
    backgroundColor: Colors.white,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  premiumCardClip: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#F1F0EC',
  },
  premiumCard: {
    padding: Spacing.lg,
  },
  premiumHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  premiumHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  billingTabsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: Spacing.md,
  },
  billingTabActive: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  billingTabActiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  billingTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  billingTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  billingTabBadge: {
    backgroundColor: 'rgba(52,199,89,0.18)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  billingTabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1B8A3B',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  priceUnitText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  billedText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  premiumDescText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  getPremiumBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getPremiumBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  includesSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  includesTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  includeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  includeCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2F80ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  includeText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  cancelAnytimeText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  legalLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  legalLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  legalLinkSep: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  finalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  welcomeCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 36,
    textAlign: 'left',
  },
  finalTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 'auto',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    gap: Spacing.sm,
    width: '100%',
    alignItems: 'center',
  },
  backBtnWrapper: {
    flex: 1,
  },
  primaryBtnWrapper: {
    flex: 1,
  },
  fullBtnWrapper: {
    width: '100%',
  },
  skipButton: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '65%',
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalList: {
    paddingHorizontal: Spacing.md,
  },
  modalOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    marginVertical: 2,
  },
  modalOptionSelected: {
    backgroundColor: Colors.brandLight,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  modalOptionSelectedText: {
    fontWeight: '700',
    color: Colors.brandPrimary,
  },
  companionWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  companionHeader: {
    marginTop: 12,
  },
  companionSub1: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.95,
  },
  companionSub2: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.98,
  },
  companionTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
    lineHeight: 48,
  },
  companionVisualArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 280,
  },
  speechBubble: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  speechBubbleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  speechBubbleTail: {
    position: 'absolute',
    bottom: -4,
    right: 18,
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  botImage: {
    width: 250,
    height: 250,
    marginTop: 20,
  },
  companionFooter: {
    width: '100%',
    gap: 12,
    marginBottom: 8,
  },
  continueTalkingBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0F172A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  continueTalkingBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  maybeLaterBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maybeLaterBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
