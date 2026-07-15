import React, { useState } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SessionPermissionDialog } from '../../components/session';
import { useSessionExperienceStore } from '../../store/sessionExperienceStore';
import { SessionPermissionKind } from '../../types/domain';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { TouchableOpacity } from 'react-native';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'SessionPermissions'>;
  route: RouteProp<MainStackParamList, 'SessionPermissions'>;
};

const ITEMS: Array<{
  id: SessionPermissionKind;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'camera',
    label: 'Camera',
    description: 'So your therapist can see you during the session',
    icon: 'video-outline',
  },
  {
    id: 'microphone',
    label: 'Microphone',
    description: 'For clear conversation audio',
    icon: 'microphone',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Session reminders and connection alerts',
    icon: 'bell-outline',
  },
  {
    id: 'network',
    label: 'Network',
    description: 'Stable connection recommended for video',
    icon: 'wifi',
  },
];

export const SessionPermissionsScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const devices = useSessionExperienceStore((s) => s.devices);
  const setPermission = useSessionExperienceStore((s) => s.setPermission);
  const setPhase = useSessionExperienceStore((s) => s.setPhase);
  const [dialog, setDialog] = useState<SessionPermissionKind | null>(null);

  const allReady =
    devices.camera === 'granted' &&
    devices.microphone === 'granted' &&
    devices.network === 'granted';

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Device permissions"
        subtitle="Allow access before you join"
        onBack={() => navigation.goBack()}
      />

      {ITEMS.map((item) => {
        const state = devices[item.id];
        return (
          <AppCard key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Icon name={item.icon} size={24} color={Colors.primary} />
              <View style={styles.copy}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.state}>
                  {state === 'granted'
                    ? 'Allowed'
                    : state === 'denied'
                      ? 'Denied'
                      : 'Not set'}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setDialog(item.id)}
                {...buttonA11y(`Allow ${item.label}`)}
              >
                <Text style={styles.btnText}>Allow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnGhost]}
                onPress={() => setPermission(item.id, 'denied')}
                {...buttonA11y(`Deny ${item.label}`)}
              >
                <Text style={styles.btnGhostText}>Deny</Text>
              </TouchableOpacity>
            </View>
          </AppCard>
        );
      })}

      <TouchableOpacity
        style={styles.settings}
        onPress={() => Linking.openSettings().catch(() => undefined)}
        {...buttonA11y('Open system settings')}
      >
        <Text style={styles.settingsText}>Open Settings</Text>
      </TouchableOpacity>

      <PrimaryButton
        label={allReady ? 'Continue to preview' : 'Continue anyway'}
        showArrow
        onPress={() => {
          setPhase('preview');
          navigation.navigate('CameraPreview', {
            sessionId: route.params.sessionId,
            therapistName: route.params.therapistName,
          });
        }}
      />

      <SessionPermissionDialog
        visible={Boolean(dialog)}
        kind={dialog ? ITEMS.find((i) => i.id === dialog)?.label ?? 'Permission' : ''}
        onAllow={() => {
          if (dialog) setPermission(dialog, 'granted');
          setDialog(null);
        }}
        onDeny={() => {
          if (dialog) setPermission(dialog, 'denied');
          setDialog(null);
        }}
        onOpenSettings={() => {
          setDialog(null);
          Linking.openSettings().catch(() => undefined);
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.md },
  copy: { flex: 1 },
  label: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  state: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  btn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.medium,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
  btnGhost: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  btnGhostText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  settings: {
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingsText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
});
