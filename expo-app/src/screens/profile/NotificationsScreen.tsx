import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { SkeletonNotifications } from '../../components/profile';
import { useProfileStore } from '../../store/profileStore';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationSettings } from '../../types/domain';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Typography, Spacing } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Notifications'>;
};

const DESIGN_TAGLINE =
  'Gentle reminders and supportive updates to help you stay connected with your mental wellbeing.';

const GROUPS: Array<{
  title: string;
  items: Array<{
    id: keyof NotificationSettings;
    label: string;
    description: string;
  }>;
}> = [
  {
    title: 'Reminders',
    items: [
      {
        id: 'session',
        label: 'Session reminders',
        description: 'Get notified before upcoming sessions',
      },
      {
        id: 'mood',
        label: 'Mood reminders',
        description: 'Daily reminders to log your mood',
      },
      {
        id: 'dailyCheckIn',
        label: 'Daily check-in',
        description: 'A soft daily wellness check-in',
      },
      {
        id: 'journal',
        label: 'Journal reminders',
        description: 'Gentle prompts to write in your journal',
      },
    ],
  },
  {
    title: 'AI & updates',
    items: [
      {
        id: 'aiRecommendations',
        label: 'AI suggestions',
        description: 'Recommendations from your companion',
      },
      {
        id: 'promo',
        label: 'Marketing updates',
        description: 'New features and offers',
      },
    ],
  },
  {
    title: 'Channels',
    items: [
      {
        id: 'push',
        label: 'Push notifications',
        description: 'Allow alerts on this device',
      },
      {
        id: 'email',
        label: 'Email notifications',
        description: 'Receive important updates by email',
      },
      {
        id: 'sms',
        label: 'SMS notifications',
        description: 'Text messages for critical updates',
      },
    ],
  },
];

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const notifications = useProfileStore((s) => s.notifications);
  const setNotification = useProfileStore((s) => s.setNotification);
  const syncSettingsHydration = useNotificationStore((s) => s.syncSettingsHydration);
  const showToast = useUiStore((s) => s.showToast);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    syncSettingsHydration(notifications);
    setBooting(false);
  }, [notifications, syncSettingsHydration]);

  const toggle = async (id: keyof NotificationSettings) => {
    const next = !Boolean(notifications[id]);
    try {
      await setNotification(id, next);
      const label =
        GROUPS.flatMap((g) => g.items).find((s) => s.id === id)?.label ?? 'Setting';
      showToast(`${label} ${next ? 'enabled' : 'disabled'}`);
    } catch {
      showToast('Failed to update notification setting', 'error');
    }
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Notifications"
        subtitle={DESIGN_TAGLINE}
        onBack={() => navigation.goBack()}
      />

      {booting ? (
        <SkeletonNotifications />
      ) : (
        <>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => navigation.navigate('NotificationCenter')}
            activeOpacity={Motion.opacity.pressed}
            {...buttonA11y('Open notification center')}
          >
            <Icon name="bell-outline" size={22} color={Colors.primary} />
            <View style={styles.linkCopy}>
              <Text style={styles.linkTitle}>Notification Center</Text>
              <Text style={styles.linkDesc}>Inbox, filters, and activity timeline</Text>
            </View>
            <Icon name="chevron-right" size={22} color={Colors.textMuted} />
          </TouchableOpacity>

          <Text style={styles.prefsIntro}>Push preferences</Text>
          <Text style={styles.prefsHint}>
            UI only for now — preferences are stored locally until the notifications API is ready.
          </Text>

          {GROUPS.map((group) => (
            <View key={group.title} style={styles.group}>
              <Text style={styles.section}>{group.title}</Text>
              {group.items.map((item) => {
                const value = Boolean(notifications[item.id] ?? false);
                return (
                  <AppCard key={item.id} style={styles.settingCard}>
                    <View style={styles.settingRow}>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <Text style={styles.settingDesc}>{item.description}</Text>
                      </View>
                      <Switch
                        value={value}
                        onValueChange={() => toggle(item.id)}
                        trackColor={{
                          false: Colors.calendarInactive,
                          true: Colors.primaryLight,
                        }}
                        thumbColor={value ? Colors.primary : Colors.white}
                        accessibilityLabel={item.label}
                        accessibilityRole="switch"
                        accessibilityState={{ checked: value }}
                      />
                    </View>
                  </AppCard>
                );
              })}
            </View>
          ))}
        </>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    minHeight: 64,
  },
  linkCopy: { flex: 1 },
  linkTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  linkDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  prefsIntro: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  prefsHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  group: {
    marginBottom: Spacing.md,
  },
  section: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  settingCard: {
    marginBottom: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  settingDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
