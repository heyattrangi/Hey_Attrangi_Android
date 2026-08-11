import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Icon, AppIcons } from '../../components/app/Icon';
import { useAuthStore } from '../../store/authStore';
import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  Input,
  Chip,
  Colors,
  Typography,
  Spacing,
  Radii,
  Shadows,
} from '../../design-system';
import { hapticError, hapticLight, hapticSuccess } from '../../utils/haptics';

interface OnboardingFormData {
  name: string;
  dob: string;
  age: string;
  emergencyContact: string;
  emergencyPhone: string;
  consentAgreed: boolean;
  selectedPlan: 'ESSENTIAL' | 'PREMIUM';
  preferredLanguage: string;
  heardAboutUs: string;
}

const LANGUAGES = [
  'English',
  'Hindi',
  'Telugu',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Bengali',
];

const HEARD_ABOUT_OPTIONS = [
  'Instagram',
  'LinkedIn',
  'WhatsApp',
  'Google Search',
  'Friend / Family',
  'Workplace',
  'Other',
];

export const PatientOnboardingScreen: React.FC = () => {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const authStatus = useAuthStore((s) => s.status);
  const loading = authStatus === 'loading';

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    dob: '',
    age: '',
    emergencyContact: '',
    emergencyPhone: '',
    consentAgreed: false,
    selectedPlan: 'PREMIUM',
    preferredLanguage: 'English',
    heardAboutUs: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const calculateAge = (dobString: string): string => {
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? String(age) : '';
  };

  const handleDobChange = (text: string) => {
    setFormData((prev) => {
      const calculatedAge = calculateAge(text);
      return { ...prev, dob: text, age: calculatedAge || prev.age };
    });
  };

  const isStep0Valid = formData.name.trim().length > 0 && formData.dob.trim().length > 0;
  const isStep1Valid =
    formData.emergencyContact.trim().length > 0 &&
    formData.emergencyPhone.trim().length >= 10 &&
    formData.consentAgreed;

  const handleNext = () => {
    if (step === 0 && !isStep0Valid) {
      void hapticError();
      return;
    }
    if (step === 1 && !isStep1Valid) {
      void hapticError();
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
    setSubmitting(true);
    try {
      void hapticSuccess();
      await completeOnboarding({
        name: formData.name.trim(),
        age: formData.age,
        dob: formData.dob.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        emergencyPhone: formData.emergencyPhone.trim(),
        preferredLanguage: formData.preferredLanguage,
        heardAboutUs: formData.heardAboutUs || undefined,
      });
    } catch (err: any) {
      void hapticError();
      Alert.alert('Onboarding Error', err?.message || 'Could not complete onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const firstName = formData.name.trim().split(' ')[0] || 'there';

  return (
    <Screen backgroundColor={Colors.surface}>
      <View style={styles.container}>
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
          {/* STEP 0: Personalization */}
          {step === 0 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              <Text variant="heading1" style={styles.title}>
                Help us personalize your experience
              </Text>
              <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
                Please provide a few details to help us customize the platform for you.
              </Text>

              <View style={styles.formGroup}>
                <Input
                  label="What's your name? *"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                  autoCapitalize="words"
                />
                <Input
                  label="Birthday (YYYY-MM-DD) *"
                  placeholder="e.g. 2000-01-15"
                  value={formData.dob}
                  onChangeText={handleDobChange}
                  keyboardType="numeric"
                />
                {formData.age ? (
                  <View style={styles.badgeContainer}>
                    <Badge variant="brand" label={`Calculated Age: ${formData.age} years`} />
                  </View>
                ) : null}

                {/* Preferred Language */}
                <Text variant="caption" style={styles.inputLabel}>
                  What's your preferred language?
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {LANGUAGES.map((lang) => (
                    <Chip
                      key={lang}
                      label={lang}
                      selected={formData.preferredLanguage === lang}
                      onPress={() => setFormData((prev) => ({ ...prev, preferredLanguage: lang }))}
                      style={styles.chipMargin}
                    />
                  ))}
                </ScrollView>

                {/* How did you hear about us */}
                <Text variant="caption" style={styles.inputLabel}>
                  How did you hear about us? (optional)
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {HEARD_ABOUT_OPTIONS.map((opt) => (
                    <Chip
                      key={opt}
                      label={opt}
                      selected={formData.heardAboutUs === opt}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          heardAboutUs: prev.heardAboutUs === opt ? '' : opt,
                        }))
                      }
                      style={styles.chipMargin}
                    />
                  ))}
                </ScrollView>
              </View>
            </Animated.View>
          )}

          {/* STEP 1: Safety & Consent */}
          {step === 1 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              <Text variant="heading1" style={styles.title}>
                Consent & Emergency Contact
              </Text>
              <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
                Your safety is our top priority. Please provide your emergency contact details and review our documents.
              </Text>

              <View style={styles.formGroup}>
                <Input
                  label="Contact Name & Relationship *"
                  placeholder="e.g. Guardian / Partner Name"
                  value={formData.emergencyContact}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, emergencyContact: text }))
                  }
                />
                <Input
                  label="Phone Number (+91) *"
                  placeholder="10-digit mobile number"
                  value={formData.emergencyPhone}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyPhone: text.replace(/\D/g, '').slice(0, 10),
                    }))
                  }
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                <Card variant="default" style={styles.docBox}>
                  <Text variant="caption" style={styles.docBoxTitle}>
                    Documents Included:
                  </Text>
                  <Text variant="caption" color={Colors.textSecondary} style={styles.docItem}>• Terms & Conditions</Text>
                  <Text variant="caption" color={Colors.textSecondary} style={styles.docItem}>• Privacy Policy</Text>
                  <Text variant="caption" color={Colors.textSecondary} style={styles.docItem}>• AI Transparency Statement</Text>
                  <Text variant="caption" color={Colors.textSecondary} style={styles.docItem}>• Trust, Safety & Acceptable Use Policy</Text>
                  <Text variant="caption" color={Colors.textSecondary} style={styles.docItem}>• Data Processing Consent</Text>
                </Card>

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
                  <Text variant="caption" color={Colors.textSecondary} style={styles.checkboxText}>
                    I have read and agree to all the documents mentioned above.
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* STEP 2: Plan Selection */}
          {step === 2 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              <Text variant="heading1" style={styles.title}>
                Unlock more ways to feel better
              </Text>
              <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.subtitle}>
                Start your personal mental wellness journey with Hey Attrangi.
              </Text>

              {/* Feature Highlights */}
              <View style={styles.featuresList}>
                <View style={styles.featureRow}>
                  <View style={[styles.featureIcon, { backgroundColor: '#f3a69a' }]}>
                    <Icon name={AppIcons.heart} size={16} color={Colors.white} />
                  </View>
                  <View>
                    <Text variant="bodyLarge" style={styles.featureTitle}>Personalised Wellbeing Plan</Text>
                    <Text variant="caption" color={Colors.textSecondary}>5-min a day to rewire your mindset</Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={[styles.featureIcon, { backgroundColor: '#c4b0d8' }]}>
                    <Icon name={AppIcons.mood} size={16} color={Colors.white} />
                  </View>
                  <View>
                    <Text variant="bodyLarge" style={styles.featureTitle}>AI Insights</Text>
                    <Text variant="caption" color={Colors.textSecondary}>Uncover surprising patterns about you</Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={[styles.featureIcon, { backgroundColor: '#e8c96a' }]}>
                    <Icon name={AppIcons.library} size={16} color={Colors.white} />
                  </View>
                  <View>
                    <Text variant="bodyLarge" style={styles.featureTitle}>Mood Dashboard</Text>
                    <Text variant="caption" color={Colors.textSecondary}>Keep track of your progress</Text>
                  </View>
                </View>
              </View>

              {/* Plan Options */}
              <View style={styles.plansContainer}>
                {/* Companion Plan (₹149/mo) */}
                <Card
                  variant={formData.selectedPlan === 'PREMIUM' ? 'selected' : 'default'}
                  onPress={() => setFormData((prev) => ({ ...prev, selectedPlan: 'PREMIUM' }))}
                  style={styles.planCard}
                >
                  <View style={styles.planHeaderRow}>
                    <Badge variant="brand" label="BEST OFFER" />
                    <Text variant="heading2" color={Colors.brandPrimary} style={styles.planPrice}>
                      ₹149.00 / mo
                    </Text>
                  </View>
                  <Text variant="heading3" style={styles.planTitle}>Companion</Text>
                  <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.planDesc}>
                    Unlimited AI support & long-term memory, full clinical screeners, and ambient audio access.
                  </Text>
                </Card>

                {/* Listener Plan (₹49/mo) */}
                <Card
                  variant={formData.selectedPlan === 'ESSENTIAL' ? 'selected' : 'default'}
                  onPress={() => setFormData((prev) => ({ ...prev, selectedPlan: 'ESSENTIAL' }))}
                  style={styles.planCard}
                >
                  <View style={styles.planHeaderRow}>
                    <Badge variant="brand" label="EASY START" />
                    <Text variant="heading2" color={Colors.brandPrimary} style={styles.planPrice}>
                      ₹49.00 / mo
                    </Text>
                  </View>
                  <Text variant="heading3" style={styles.planTitle}>Listener</Text>
                  <Text variant="bodyMedium" color={Colors.textSecondary} style={styles.planDesc}>
                    Daily check-ins, basic mood tracking, and Hey Attrangi AI companion chat.
                  </Text>
                </Card>
              </View>
            </Animated.View>
          )}

          {/* STEP 3: Final Welcome */}
          {step === 3 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.finalContainer}>
              <View style={styles.welcomeCircle}>
                <Icon name={AppIcons.heart} size={40} color={Colors.brandPrimary} />
              </View>
              <Text variant="heading1" style={styles.finalTitle}>
                Thanks for sharing, {firstName}.{'\n'}We're here with you.
              </Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Action Buttons */}
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
                label={step === 2 ? 'Subscribe & Pay' : 'Continue'}
                onPress={handleNext}
                disabled={
                  (step === 0 && !isStep0Valid) ||
                  (step === 1 && !isStep1Valid)
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

        {step === 2 && (
          <TouchableOpacity style={styles.skipButton} onPress={() => setStep(3)}>
            <Text variant="caption" color={Colors.brandPrimary} style={styles.skipButtonText}>
              Skip, continue with Free Plan
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
  formGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    fontWeight: '700',
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  chipMargin: {
    marginRight: Spacing.xs,
  },
  badgeContainer: {
    marginBottom: Spacing.xs,
  },
  docBox: {
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  docBoxTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  docItem: {
    fontSize: 12,
    lineHeight: 18,
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
  checkboxText: {
    flex: 1,
    lineHeight: 18,
  },
  featuresList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  plansContainer: {
    gap: Spacing.md,
  },
  planCard: {
    padding: Spacing.lg,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  planPrice: {
    fontWeight: '800',
    fontSize: 16,
  },
  planDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  finalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  welcomeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
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
    gap: Spacing.sm,
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
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  skipButtonText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
