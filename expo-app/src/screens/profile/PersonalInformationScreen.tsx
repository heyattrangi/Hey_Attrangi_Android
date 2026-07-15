import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Text,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { AppHeader } from '../../components/app';
import { AppInput } from '../../components/app';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { FormScreen } from '../../components/ui/FormScreen';
import { DiscardChangesDialog } from '../../components/ui/dialogs';
import { Icon } from '../../components/app/Icon';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useProfileStore, AvatarKey } from '../../store/profileStore';
import { useUiStore } from '../../store/uiStore';
import { ageFromDateOfBirth } from '../../services/profile/profileMappers';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';
import { Icons } from '../../theme/icons';
import { getAvatarImage } from '../../assets';
import {
  isRequired,
  isValidEmail,
  isValidPhone,
  isValidDateOfBirth,
} from '../../utils/validation';
import { buttonA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'PersonalInformation'>;
};

export const PersonalInformationScreen: React.FC<Props> = ({ navigation }) => {
  const onboardingName = useOnboardingStore((s) => s.name);
  const onboardingPhone = useOnboardingStore((s) => s.phone);
  const personalInfo = useProfileStore((s) => s.personalInfo);
  const savedPersonalInfo = useProfileStore((s) => s.savedPersonalInfo);
  const updatePersonalInfo = useProfileStore((s) => s.updatePersonalInfo);
  const savePersonalInfo = useProfileStore((s) => s.savePersonalInfo);
  const profileStatus = useProfileStore((s) => s.status);
  const resetPersonalInfoDraft = useProfileStore((s) => s.resetPersonalInfoDraft);
  const showToast = useUiStore((s) => s.showToast);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);
  const [discardVisible, setDiscardVisible] = useState(false);

  useEffect(() => {
    if (!initialized && !savedPersonalInfo.fullName && onboardingName) {
      updatePersonalInfo({
        fullName: onboardingName,
        phone: onboardingPhone.replace(/\D/g, '').slice(-10),
      });
      setInitialized(true);
    }
  }, [initialized, onboardingName, onboardingPhone, savedPersonalInfo.fullName, updatePersonalInfo]);

  const isDirty =
    JSON.stringify(personalInfo) !== JSON.stringify(savedPersonalInfo);

  const handleBack = useCallback(() => {
    if (isDirty) {
      setDiscardVisible(true);
      return true;
    }
    return false;
  }, [isDirty]);

  useFocusEffect(
    useCallback(() => {
      const unsub = navigation.addListener('beforeRemove', (e) => {
        if (!isDirty) return;
        e.preventDefault();
        handleBack();
      });
      return unsub;
    }, [navigation, isDirty, handleBack]),
  );

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!isRequired(personalInfo.fullName)) next.fullName = 'Full name is required';
    if (personalInfo.username && personalInfo.username.trim().length < 3) {
      next.username = 'Username must be at least 3 characters';
    }
    if (!isValidPhone(personalInfo.phone)) next.phone = 'Enter a valid 10-digit phone number';
    if (personalInfo.email && !isValidEmail(personalInfo.email)) {
      next.email = 'Enter a valid email address';
    }
    if (personalInfo.dateOfBirth && !isValidDateOfBirth(personalInfo.dateOfBirth)) {
      next.dateOfBirth = 'Use format YYYY-MM-DD';
    }
    if (personalInfo.emergencyContact && !isValidPhone(personalInfo.emergencyContact)) {
      next.emergencyContact = 'Enter a valid emergency contact number';
    }
    if (
      personalInfo.trustedContactPhone &&
      !isValidPhone(personalInfo.trustedContactPhone)
    ) {
      next.trustedContactPhone = 'Enter a valid phone number';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast('Please fix the errors below', 'error');
      return;
    }
    const derivedAge = ageFromDateOfBirth(personalInfo.dateOfBirth);
    if (derivedAge) {
      updatePersonalInfo({ age: String(derivedAge) });
    }
    try {
      await savePersonalInfo();
      showToast('Personal information saved successfully');
      navigation.goBack();
    } catch {
      const message =
        useProfileStore.getState().error?.message ??
        'Failed to save personal information';
      showToast(message, 'error');
    }
  };

  const pickAvatar = () => {
    Alert.alert('Update Profile Photo', 'Choose a placeholder avatar', [
      { text: 'Default', onPress: () => updatePersonalInfo({ avatarKey: 'logo' as AvatarKey }) },
      {
        text: 'AI Companion',
        onPress: () => updatePersonalInfo({ avatarKey: 'ai-companion' as AvatarKey }),
      },
      {
        text: 'Therapist',
        onPress: () => updatePersonalInfo({ avatarKey: 'therapist' as AvatarKey }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  };

  const isValid =
    isRequired(personalInfo.fullName) &&
    isValidPhone(personalInfo.phone) &&
    (!personalInfo.email || isValidEmail(personalInfo.email)) &&
    (!personalInfo.dateOfBirth || isValidDateOfBirth(personalInfo.dateOfBirth));

  return (
    <FormScreen>
      <AppHeader
        title="Personal Information"
        onBack={() => (handleBack() ? undefined : navigation.goBack())}
      />

      <View style={styles.avatarSection}>
        {getAvatarImage(personalInfo.avatarKey) ? (
          <Image source={getAvatarImage(personalInfo.avatarKey)!} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
            <Icon name={Icons.profile} size={36} color={Colors.primary} />
          </View>
        )}
        <TouchableOpacity
          style={styles.cameraBtn}
          activeOpacity={0.8}
          onPress={pickAvatar}
          {...buttonA11y('Update profile photo')}
        >
          <Icon name={Icons.camera} size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>Basics</Text>
      <AppInput
        label="Full Name"
        placeholder="Enter your full name"
        value={personalInfo.fullName}
        onChangeText={(t) => {
          updatePersonalInfo({ fullName: t });
          clearError('fullName');
        }}
        error={errors.fullName}
      />
      <AppInput
        label="Username"
        placeholder="Choose a username"
        value={personalInfo.username ?? ''}
        onChangeText={(t) => {
          updatePersonalInfo({
            username: t.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase().slice(0, 24),
          });
          clearError('username');
        }}
        autoCapitalize="none"
        error={errors.username}
      />
      <AppInput
        label="Email"
        placeholder="Enter your email"
        value={personalInfo.email}
        onChangeText={(t) => {
          updatePersonalInfo({ email: t });
          clearError('email');
        }}
        keyboardType="email-address"
        error={errors.email}
      />
      <AppInput
        label="Phone Number"
        placeholder="10-digit mobile number"
        value={personalInfo.phone}
        onChangeText={(t) => {
          updatePersonalInfo({ phone: t.replace(/\D/g, '').slice(0, 10) });
          clearError('phone');
        }}
        keyboardType="phone-pad"
        error={errors.phone}
      />

      <Text style={styles.sectionLabel}>Details</Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <AppInput
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            value={personalInfo.dateOfBirth}
            onChangeText={(t) => {
              const age = ageFromDateOfBirth(t);
              updatePersonalInfo({
                dateOfBirth: t,
                age: age ? String(age) : personalInfo.age,
              });
              clearError('dateOfBirth');
            }}
            error={errors.dateOfBirth}
          />
        </View>
        <View style={styles.half}>
          <AppInput
            label="Gender"
            placeholder="Gender"
            value={personalInfo.gender}
            onChangeText={(t) => updatePersonalInfo({ gender: t })}
          />
        </View>
      </View>
      <AppInput
        label="Institution"
        placeholder="School, college, or workplace"
        value={personalInfo.institution ?? ''}
        onChangeText={(t) => updatePersonalInfo({ institution: t })}
      />
      <AppInput
        label="Bio (optional)"
        placeholder="A short note about you"
        value={personalInfo.bio ?? ''}
        onChangeText={(t) => updatePersonalInfo({ bio: t.slice(0, 160) })}
        multiline
        numberOfLines={3}
      />
      <AppInput
        label="Address"
        placeholder="Enter your address"
        value={personalInfo.address}
        onChangeText={(t) => updatePersonalInfo({ address: t })}
        multiline
        numberOfLines={2}
      />

      <Text style={styles.sectionLabel}>Emergency contact</Text>
      <AppInput
        label="Contact Name"
        placeholder="Emergency contact name"
        value={personalInfo.emergencyContactName ?? ''}
        onChangeText={(t) => updatePersonalInfo({ emergencyContactName: t })}
      />
      <AppInput
        label="Contact Number"
        placeholder="Emergency contact phone"
        value={personalInfo.emergencyContact}
        onChangeText={(t) => {
          updatePersonalInfo({ emergencyContact: t.replace(/\D/g, '').slice(0, 10) });
          clearError('emergencyContact');
        }}
        keyboardType="phone-pad"
        error={errors.emergencyContact}
      />

      <Text style={styles.sectionLabel}>Trusted contact</Text>
      <AppInput
        label="Name"
        placeholder="Trusted contact name"
        value={personalInfo.trustedContactName ?? ''}
        onChangeText={(t) => updatePersonalInfo({ trustedContactName: t })}
      />
      <AppInput
        label="Phone"
        placeholder="Trusted contact phone"
        value={personalInfo.trustedContactPhone ?? ''}
        onChangeText={(t) => {
          updatePersonalInfo({
            trustedContactPhone: t.replace(/\D/g, '').slice(0, 10),
          });
          clearError('trustedContactPhone');
        }}
        keyboardType="phone-pad"
        error={errors.trustedContactPhone}
      />
      <AppInput
        label="Relation"
        placeholder="e.g. Parent, Friend"
        value={personalInfo.trustedContactRelation ?? ''}
        onChangeText={(t) => updatePersonalInfo({ trustedContactRelation: t })}
      />

      {isDirty ? <Text style={styles.unsavedHint}>You have unsaved changes</Text> : null}

      <PrimaryButton
        label="Save Changes"
        onPress={handleSave}
        disabled={!isValid || !isDirty || profileStatus === 'loading'}
        loading={profileStatus === 'loading'}
      />
      {isDirty ? (
        <SecondaryButton label="Discard Changes" onPress={() => setDiscardVisible(true)} />
      ) : null}

      <DiscardChangesDialog
        visible={discardVisible}
        onCancel={() => setDiscardVisible(false)}
        onConfirm={() => {
          setDiscardVisible(false);
          resetPersonalInfoDraft();
          navigation.goBack();
        }}
      />
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
    width: 100,
    alignSelf: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.calendarInactive,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.peachMuted,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  half: {
    flex: 1,
  },
  unsavedHint: {
    ...Typography.caption,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
