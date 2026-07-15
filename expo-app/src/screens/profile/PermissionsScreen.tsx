import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PermissionRequiredDialog } from '../../components/ui/dialogs';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';
import {
  DevicePermissionKind,
  PermissionManager,
  usePermissionStore,
} from '../../platform/PermissionManager';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Permissions'>;
};

const PERMS: Array<{
  id: DevicePermissionKind;
  label: string;
  description: string;
}> = [
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Reminders and companion updates',
  },
  {
    id: 'microphone',
    label: 'Microphone',
    description: 'Voice messages with your companion',
  },
  {
    id: 'camera',
    label: 'Camera',
    description: 'Profile photo and video sessions',
  },
  {
    id: 'photos',
    label: 'Photos',
    description: 'Choose a profile photo from your library',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    description: 'Trusted contacts for care circle (optional)',
  },
  {
    id: 'location',
    label: 'Location',
    description: 'Campus resources near you (optional)',
  },
];

export const PermissionsScreen: React.FC<Props> = ({ navigation }) => {
  const statuses = usePermissionStore((s) => s.statuses);
  const [dialogFor, setDialogFor] = useState<DevicePermissionKind | null>(null);

  const values = useMemo(() => {
    const map: Record<DevicePermissionKind, boolean> = {
      notifications: statuses.notifications.status === 'granted',
      microphone: statuses.microphone.status === 'granted',
      camera: statuses.camera.status === 'granted',
      photos: statuses.photos.status === 'granted',
      contacts: statuses.contacts.status === 'granted',
      location: statuses.location.status === 'granted',
    };
    return map;
  }, [statuses]);

  const toggle = (id: DevicePermissionKind, next: boolean) => {
    if (next && !values[id]) {
      setDialogFor(id);
      return;
    }
    if (!next) PermissionManager.deny(id);
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Permissions"
        subtitle="Allow · Deny · Open Settings · Retry"
        onBack={() => navigation.goBack()}
      />

      {PERMS.map((item) => (
        <AppCard key={item.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.copy}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.status}>
                Status · {statuses[item.id]?.status ?? 'unknown'}
              </Text>
            </View>
            <Switch
              value={values[item.id]}
              onValueChange={(v) => toggle(item.id, v)}
              trackColor={{
                false: Colors.borderDefault,
                true: Colors.primaryLight,
              }}
              thumbColor={values[item.id] ? Colors.primary : Colors.white}
              accessibilityLabel={item.label}
            />
          </View>
          {statuses[item.id]?.status === 'denied' ||
          statuses[item.id]?.status === 'blocked' ? (
            <SecondaryButton
              label="Retry / Open Settings"
              onPress={() => void PermissionManager.retry(item.id)}
              style={styles.retry}
            />
          ) : null}
        </AppCard>
      ))}

      <PermissionRequiredDialog
        visible={dialogFor != null}
        title={
          dialogFor
            ? `${PERMS.find((p) => p.id === dialogFor)?.label} permission`
            : undefined
        }
        onCancel={() => {
          if (dialogFor) PermissionManager.deny(dialogFor);
          setDialogFor(null);
        }}
        onOpenSettings={() => {
          if (dialogFor) {
            PermissionManager.allow(dialogFor);
          }
          setDialogFor(null);
          void PermissionManager.openSettings();
        }}
      />
    </AppScreen>
  );
};

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
  status: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
    fontSize: 11,
  },
  retry: { marginTop: Spacing.sm },
});
