import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard, Icon, AppIcons } from '../../components/app';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'PrivacySecurity'>;
};

const LINKS: Array<{
  label: string;
  description: string;
  screen: keyof MainStackParamList;
}> = [
  {
    label: 'Privacy',
    description: 'How we handle your data',
    screen: 'HelpArticle',
  },
  {
    label: 'Security',
    description: 'Password, email, and 2FA',
    screen: 'EmailSecurity',
  },
  {
    label: 'Permissions',
    description: 'Microphone, notifications, biometrics',
    screen: 'Permissions',
  },
  {
    label: 'Trusted Circle',
    description: 'Family, caregivers, and invites',
    screen: 'TrustedCircle',
  },
  {
    label: 'Trusted Contacts',
    description: 'People who can support you',
    screen: 'TrustedContacts',
  },
  {
    label: 'Emergency Contacts',
    description: 'Reach someone quickly when needed',
    screen: 'EmergencyContacts',
  },
  {
    label: 'Emergency Sharing',
    description: 'Crisis alerts for your circle',
    screen: 'EmergencySharing',
  },
  {
    label: 'Wellness Sharing',
    description: 'Consented wellness summaries',
    screen: 'WellnessSharing',
  },
  {
    label: 'Biometric Login',
    description: 'Face ID / fingerprint unlock',
    screen: 'BiometricLogin',
  },
  {
    label: 'Password Change',
    description: 'Update your password',
    screen: 'EmailSecurity',
  },
  {
    label: 'Session Management',
    description: 'Devices signed into your account',
    screen: 'Devices',
  },
  {
    label: 'Delete Account',
    description: 'Permanently remove your account',
    screen: 'AccountManagement',
  },
];

export const PrivacySecurityScreen: React.FC<Props> = ({ navigation }) => (
  <AppScreen includeBottomInset gradient="topRightWarm">
    <AppHeader
      title="Privacy & Security"
      subtitle="Stay safe and in control"
      onBack={() => navigation.goBack()}
    />

    {LINKS.map((item) => (
      <AppCard
        key={item.label}
        style={styles.card}
        onPress={() => {
          if (item.screen === 'HelpArticle') {
            navigation.navigate('HelpArticle', {
              slug: 'privacy',
              title: 'Privacy Policy',
            });
            return;
          }
          navigation.navigate(item.screen as never);
        }}
      >
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
          <Icon name={AppIcons.chevronRight} size={22} color={Colors.textMuted} />
        </View>
      </AppCard>
    ))}
  </AppScreen>
);

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  copy: { flex: 1, marginRight: Spacing.md },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
