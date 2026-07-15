import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { DropdownSelect } from '../../components/common/DropdownSelect';
import { TextInput } from '../../components/common/TextInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Icon } from '../../components/app/Icon';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Motion } from '../../theme';
import { hapticError, hapticLight, hapticSuccess } from '../../utils/haptics';

const RELATIONSHIP_OPTIONS = [
  'Parent',
  'Sibling',
  'Friend',
  'Spouse',
  'Guardian',
  'Roommate',
  'Academic Mentor',
  'Other',
];

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'TrustedContact'>;
};

/** Design 6.png — Add a trusted contact (step 4/4) */
export const TrustedContactScreen: React.FC<Props> = ({ navigation }) => {
  const register = useAuthStore((s) => s.register);
  const {
    name,
    phone,
    password,
    otpDigits,
    relationship,
    trustedContactName,
    trustedContactPhone,
    setField,
  } = useOnboardingStore();
  const [errors, setErrors] = useState<{
    relationship?: string;
    phone?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSelectContact = () => {
    void hapticLight();
    const mockName = 'Emergency Contact';
    const mockNumber = '9876543210';
    setField('trustedContactName', mockName);
    setField('trustedContactPhone', mockNumber);
    setErrors({});
    Alert.alert('Contact Selected', `Picked ${mockName}: +91 ${mockNumber}`);
  };

  const handleContinue = async () => {
    const newErrors: typeof errors = {};
    if (!relationship) newErrors.relationship = 'Relationship is required';
    if (!trustedContactPhone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (trustedContactPhone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      void hapticError();
      return;
    }

    setErrors({});
    setLoading(true);

    const contactName =
      trustedContactName.trim() || 'Trusted Contact';

    try {
      await register({
        name,
        phone,
        countryCode: '+91',
        password,
        otpDigits,
        relationship: relationship!,
        trustedContactName: contactName,
        trustedContactPhone,
      });
      await useProfileStore.getState().initialize();
      void hapticSuccess();
      // RootNavigator switches to Onboarding — do not navigate to Home
    } catch {
      const message =
        useAuthStore.getState().error?.message ??
        'Registration failed. Please try again.';
      setErrors({ phone: message });
      void hapticError();
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    relationship !== null && trustedContactPhone.trim().length >= 10;

  return (
    <OnboardingContainer
      showProgress
      currentStep={4}
      totalSteps={4}
      onBackPress={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title="Add a trusted contact"
            subtitle="Your trusted contact will only be notified during serious safety situations where immediate support may be required. We will never contact them without a valid safety reason."
            centered
          />
        </Animated.View>

        <Animated.View
          style={styles.form}
          entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        >
          <DropdownSelect
            label="Select Relationship"
            placeholder="Select relationship with trusted contact"
            options={RELATIONSHIP_OPTIONS}
            value={relationship}
            onSelect={(val) => {
              void hapticLight();
              setField('relationship', val);
              if (errors.relationship) {
                setErrors((e) => ({ ...e, relationship: undefined }));
              }
            }}
          />
          {errors.relationship ? (
            <Text style={styles.fieldError}>{errors.relationship}</Text>
          ) : null}

          <Text style={styles.sectionLabel}>Enter contact detail</Text>

          <PrimaryButton
            label="Select Contact"
            onPress={handleSelectContact}
            icon={<Icon name="account-outline" size={20} color={Colors.white} />}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TextInput
            label=""
            placeholder="Enter phone number manually"
            value={trustedContactPhone}
            onChangeText={(text) => {
              setField('trustedContactPhone', text.replace(/[^0-9]/g, '').slice(0, 10));
              if (!trustedContactName) {
                setField('trustedContactName', 'Trusted Contact');
              }
              if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
            }}
            keyboardType="phone-pad"
            error={errors.phone}
            maxLength={10}
          />
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(160).duration(Motion.duration.normal)}
        >
          <PrimaryButton
            label="Complete set up"
            onPress={handleContinue}
            disabled={!isFormValid || loading}
            loading={loading}
          />
        </Animated.View>
      </View>
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  form: {
    marginTop: Spacing.md,
    flexGrow: 1,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  fieldError: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.xs,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderDefault,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginHorizontal: Spacing.md,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    width: '100%',
    paddingTop: Spacing.md,
  },
});
