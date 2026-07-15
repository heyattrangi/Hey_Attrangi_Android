import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard, Icon, AppIcons } from '../../components/app';
import { SkeletonSettings } from '../../components/profile';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { APP_VERSION } from '../../constants/appMeta';
import { useNetworkStore } from '../../store/networkStore';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useScreenLifecycle } from '../../hooks/useScreenLifecycle';
import { useOfflineQueueStore } from '../../store/offlineQueueStore';
import { useUiStore } from '../../store/uiStore';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Settings'>;
};

const SECTIONS: Array<{
  title: string;
  items: Array<{
    label: string;
    screen: keyof MainStackParamList;
    params?: object;
  }>;
}> = [
  {
    title: 'Find',
    items: [{ label: 'Search', screen: 'AppSearch' }],
  },
  {
    title: 'Personalization',
    items: [
      { label: 'AI Companion Settings', screen: 'AiCompanionSettings' },
      { label: 'Trusted Circle', screen: 'TrustedCircle' },
      { label: 'Community', screen: 'CommunityHome' },
      { label: 'Therapist Portal', screen: 'TherapistDashboard' },
      { label: 'Developer Menu', screen: 'DevToolsMenu' },
      { label: 'Wellness Reports', screen: 'WellnessReportsHub' },
      { label: 'Conversation History', screen: 'ConversationHistory' },
      { label: 'AI Memory', screen: 'AiMemoryViewer' },
      { label: 'Conversation Templates', screen: 'ConversationTemplates' },
      { label: 'Appearance', screen: 'Appearance' },
      { label: 'Language', screen: 'Language' },
      { label: 'Notification Center', screen: 'NotificationCenter' },
      { label: 'Notification Preferences', screen: 'Notifications' },
      { label: 'Activity Timeline', screen: 'ActivityTimeline' },
    ],
  },
  {
    title: 'Privacy & security',
    items: [
      { label: 'Privacy & Security', screen: 'PrivacySecurity' },
      { label: 'Email & Security', screen: 'EmailSecurity' },
      { label: 'Devices & Sessions', screen: 'Devices' },
      { label: 'Permissions', screen: 'Permissions' },
      { label: 'Biometric Login', screen: 'BiometricLogin' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Personal Information', screen: 'PersonalInformation' },
      { label: 'Account Management', screen: 'AccountManagement' },
      { label: 'Billing & Invoices', screen: 'BillingInvoices' },
      { label: 'Billing History', screen: 'BillingHistory' },
      { label: 'Care Credits', screen: 'CareCredits' },
      { label: 'Wallet', screen: 'Wallet' },
      { label: 'Refunds', screen: 'Refunds' },
    ],
  },
  {
    title: 'Help',
    items: [
      { label: 'Help Center', screen: 'HelpCenter' },
      {
        label: 'Privacy Policy',
        screen: 'HelpArticle',
        params: { slug: 'privacy', title: 'Privacy Policy' },
      },
      {
        label: 'Terms & Conditions',
        screen: 'HelpArticle',
        params: { slug: 'terms', title: 'Terms & Conditions' },
      },
      { label: 'UI States (QA)', screen: 'UiStatesDemo' },
      { label: 'Developer Menu', screen: 'DevToolsMenu' },
    ],
  },
];

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [booting] = useState(false);
  const simulateOfflineFlag = useFeatureFlag('enableSimulateOffline');
  const forcedOffline = useNetworkStore((s) => s.forcedOffline);
  const setForcedOffline = useNetworkStore((s) => s.setForcedOffline);
  const pending = useNetworkStore((s) => s.pendingQueueCount);
  const enqueue = useOfflineQueueStore((s) => s.enqueue);
  const showToast = useUiStore((s) => s.showToast);

  useScreenLifecycle({ screenName: 'Settings' });

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Settings"
        subtitle="Customize your Hey Attrangi experience"
        onBack={() => navigation.goBack()}
      />

      {booting ? (
        <SkeletonSettings />
      ) : (
        <>
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <AppCard
                  key={item.label}
                  style={styles.card}
                  onPress={() => {
                    if (item.params) {
                      navigation.navigate(
                        item.screen as 'HelpArticle',
                        item.params as { slug: string; title: string },
                      );
                      return;
                    }
                    navigation.navigate(item.screen as never);
                  }}
                >
                  <View style={styles.row}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Icon
                      name={AppIcons.chevronRight}
                      size={22}
                      color={Colors.textMuted}
                    />
                  </View>
                </AppCard>
              ))}
            </View>
          ))}

          {simulateOfflineFlag ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Developer</Text>
              <AppCard style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.copy}>
                    <Text style={styles.label}>Simulate offline</Text>
                    <Text style={styles.desc}>
                      Test offline banner, queue, and sync UI
                    </Text>
                  </View>
                  <Switch
                    value={forcedOffline}
                    onValueChange={(v) => {
                      setForcedOffline(v);
                      showToast(
                        v ? 'Offline mode enabled' : 'Back online',
                        v ? 'warning' : 'success',
                      );
                    }}
                    trackColor={{
                      false: Colors.borderDefault,
                      true: Colors.primaryLight,
                    }}
                    thumbColor={forcedOffline ? Colors.primary : Colors.white}
                    accessibilityLabel="Simulate offline"
                  />
                </View>
              </AppCard>
              <AppCard
                style={styles.card}
                onPress={() => {
                  enqueue('generic', { note: 'QA queued action' });
                  showToast('Queued a sample offline action', 'info');
                }}
              >
                <View style={styles.row}>
                  <Text style={styles.label}>
                    Queue test action{pending ? ` (${pending} pending)` : ''}
                  </Text>
                  <Icon
                    name={AppIcons.chevronRight}
                    size={22}
                    color={Colors.textMuted}
                  />
                </View>
              </AppCard>
            </View>
          ) : null}
        </>
      )}

      <Text style={styles.version}>Hey Attrangi v{APP_VERSION}</Text>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  card: { marginBottom: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: { flex: 1, marginRight: Spacing.md },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  version: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
});
