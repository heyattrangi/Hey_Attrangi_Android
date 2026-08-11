import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, AppIcons } from '../../components/app/Icon';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { profileRepository } from '../../repositories/ProfileRepository';
import { MainStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  Input,
  Chip,
  Avatar,
  Divider,
  Colors,
  Typography,
  Spacing,
  Radii,
} from '../../design-system';
import { hapticLight, hapticSuccess, hapticError, hapticSelection } from '../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali'];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const logout = useAuthStore((s) => s.logout);

  const personalInfo = useProfileStore((s) => s.personalInfo);
  const updatePersonalInfo = useProfileStore((s) => s.updatePersonalInfo);
  const savePersonalInfo = useProfileStore((s) => s.savePersonalInfo);

  // Form States
  const [fullName, setFullName] = useState(personalInfo.fullName || '');
  const [email] = useState(personalInfo.email || '');
  const [phone, setPhone] = useState(personalInfo.phone || '');
  const [dob, setDob] = useState(personalInfo.dateOfBirth || '');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const [emergencyName, setEmergencyName] = useState(personalInfo.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(personalInfo.emergencyContact || '');

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingEmergency, setSavingEmergency] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await profileRepository.getMobileMe();
        if (res && res.name) {
          setFullName(res.name);
        }
      } catch {
        // Fallback
      }
    }
    void loadProfile();
  }, []);

  const handleSavePersonalInfo = async () => {
    setSaving(true);
    void hapticLight();
    try {
      updatePersonalInfo({
        fullName,
        phone,
        dateOfBirth: dob,
      });
      await savePersonalInfo();
      void hapticSuccess();
      Alert.alert('Profile Saved', 'Your personal details have been updated.');
    } catch {
      void hapticError();
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmergency = async () => {
    setSavingEmergency(true);
    void hapticLight();
    try {
      updatePersonalInfo({
        emergencyContactName: emergencyName,
        emergencyContact: emergencyPhone,
      });
      await savePersonalInfo();
      void hapticSuccess();
      Alert.alert('Saved', 'Emergency contact updated.');
    } catch {
      void hapticError();
    } finally {
      setSavingEmergency(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of Hey Attrangi?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          void hapticLight();
          logout();
        },
      },
    ]);
  };

  const canGoBack = navigation.canGoBack();

  return (
    <Screen backgroundColor={Colors.background}>
      <View style={styles.header}>
        {canGoBack ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              void hapticLight();
              navigation.goBack();
            }}
          >
            <Icon name={AppIcons.back} size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
        <Text variant="heading1" style={styles.headerTitle}>
          Profile Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Identity Card */}
        <Card variant="default" style={styles.identityCard}>
          <View style={styles.identityRow}>
            <Avatar size={64} backgroundColor={Colors.brandLight}>
              <Text variant="heading1" color={Colors.brandPrimary}>
                {(fullName || 'User').charAt(0).toUpperCase()}
              </Text>
            </Avatar>
            <View style={styles.identityMeta}>
              <Text variant="heading2" style={styles.userName}>
                {fullName || 'Patient User'}
              </Text>
              <Text variant="bodyMedium" color={Colors.textSecondary}>
                {email || 'patient@heyattrangi.app'}
              </Text>
              <View style={styles.badgeRow}>
                <Badge variant="brand" label="FREE PLAN" />
                <Badge variant="teal" label="PATIENT" />
              </View>
            </View>
          </View>
        </Card>

        {/* Personal Details Form */}
        <Card variant="default" style={styles.sectionCard}>
          <Text variant="heading3" style={styles.sectionTitle}>
            Personal Details
          </Text>

          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={fullName}
            onChangeText={setFullName}
          />

          <Input
            label="Email Address"
            placeholder="Email"
            value={email}
            editable={false}
          />

          <Input
            label="Phone Number"
            placeholder="+91 9876543210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            value={dob}
            onChangeText={setDob}
          />

          <Button
            variant="primary"
            label={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSavePersonalInfo}
            disabled={saving}
          />
        </Card>

        {/* Emergency Contact */}
        <Card variant="default" style={styles.sectionCard}>
          <Text variant="heading3" style={styles.sectionTitle}>
            Emergency Contact
          </Text>
          <Text variant="bodyMedium" color={Colors.textSecondary}>
            Trusted person to notify in case of crisis support.
          </Text>

          <Input
            label="Contact Name"
            placeholder="e.g. Spouse / Parent"
            value={emergencyName}
            onChangeText={setEmergencyName}
          />

          <Input
            label="Phone Number"
            placeholder="+91 9876543210"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            keyboardType="phone-pad"
          />

          <Button
            variant="secondary"
            label={savingEmergency ? 'Saving...' : 'Save Emergency Contact'}
            onPress={handleSaveEmergency}
            disabled={savingEmergency}
          />
        </Card>

        {/* Preferences & Language */}
        <Card variant="default" style={styles.sectionCard}>
          <Text variant="heading3" style={styles.sectionTitle}>
            App Preferences
          </Text>

          <Text variant="caption" color={Colors.textMuted} style={styles.subHeading}>
            PREFERRED LANGUAGE
          </Text>

          <View style={styles.chipGrid}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang;
              return (
                <Chip
                  key={lang}
                  label={lang}
                  selected={isSelected}
                  onPress={() => {
                    void hapticSelection();
                    setSelectedLanguage(lang);
                  }}
                />
              );
            })}
          </View>

          <Divider />

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text variant="heading3" style={styles.switchLabel}>
                Push Notifications
              </Text>

              <Text variant="bodyMedium" color={Colors.textSecondary}>
                Daily wellness check-ins & reflection reminders
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={(val) => {
                void hapticLight();
                setNotificationsEnabled(val);
              }}
              trackColor={{ false: Colors.borderDefault, true: Colors.brandLight }}
              thumbColor={notificationsEnabled ? Colors.brandPrimary : Colors.surface}
            />
          </View>
        </Card>

        {/* Sign Out CTA */}
        <Button
          variant="secondary"
          label="Sign Out"
          onPress={handleSignOut}
          style={styles.signOutBtn}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  identityCard: {
    padding: Spacing.lg,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  identityMeta: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  sectionCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  subHeading: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextCol: {
    flex: 1,
    gap: 2,
    marginRight: Spacing.md,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  signOutBtn: {
    marginTop: Spacing.sm,
    borderColor: Colors.error,
  },
});
