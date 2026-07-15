import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { AsyncStateRenderer, SkeletonList, EmptyStateView } from '../../components/async';
import { useProfileStore } from '../../store/profileStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Icons } from '../../theme/icons';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Devices'>;
};

export const DevicesScreen: React.FC<Props> = ({ navigation }) => {
  const devices = useProfileStore((s) => s.devices);
  const status = useProfileStore((s) => s.status);
  const error = useProfileStore((s) => s.error);
  const initialize = useProfileStore((s) => s.initialize);
  const removeDevice = useProfileStore((s) => s.removeDevice);
  const renameDevice = useProfileStore((s) => s.renameDevice);
  const showToast = useUiStore((s) => s.showToast);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleRemove = (id: string, name: string, current: boolean) => {
    if (current) {
      Alert.alert('Cannot Remove', 'You cannot remove your current device.');
      return;
    }
    Alert.alert('Remove Device', `Remove ${name} from your account?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeDevice(id);
            showToast(`${name} removed`);
          } catch {
            showToast('Failed to remove device', 'error');
          }
        },
      },
    ]);
  };

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
  };

  const confirmRename = async (id: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      showToast('Device name cannot be empty', 'error');
      return;
    }
    try {
      await renameDevice(id, trimmed);
      setRenamingId(null);
      showToast('Device renamed');
    } catch {
      showToast('Failed to rename device', 'error');
    }
  };

  const displayStatus =
    status === 'success' && devices.length === 0 ? 'empty' : status;

  return (
    <AppScreen includeBottomInset gradient="none">
      <AppHeader title="Devices" onBack={() => navigation.goBack()} />
      <Text style={styles.subtitle}>Manage devices connected to your account</Text>

      <AsyncStateRenderer
        screenId="devices"
        status={displayStatus}
        error={error}
        onRetry={initialize}
        hasCachedData={devices.length > 0}
        loading={<SkeletonList count={2} />}
        empty={
          <EmptyStateView
            title="No devices connected"
            message="Devices signed into your account will show up here."
            icon="cellphone"
          />
        }
      >
        {devices.map((device) => (
          <AppCard key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceRow}>
              <Icon name={Icons.phone} size={24} color={Colors.textPrimary} />
              <View style={styles.deviceInfo}>
                {renamingId === device.id ? (
                  <TextInput
                    style={styles.renameInput}
                    value={renameValue}
                    onChangeText={setRenameValue}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.deviceName}>{device.name}</Text>
                )}
                <Text style={styles.deviceLocation}>{device.location}</Text>
              </View>
              {device.current ? (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentText}>Current</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.actions}>
              {renamingId === device.id ? (
                <>
                  <TouchableOpacity onPress={() => confirmRename(device.id)}>
                    <Text style={styles.actionText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRenamingId(null)}>
                    <Text style={styles.actionTextMuted}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => startRename(device.id, device.name)}>
                    <Text style={styles.actionText}>Rename</Text>
                  </TouchableOpacity>
                  {!device.current ? (
                    <TouchableOpacity
                      onPress={() => handleRemove(device.id, device.name, device.current)}
                    >
                      <Text style={styles.actionTextDanger}>Remove</Text>
                    </TouchableOpacity>
                  ) : null}
                </>
              )}
            </View>
          </AppCard>
        ))}
      </AsyncStateRenderer>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  empty: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  deviceCard: {
    marginBottom: Spacing.sm,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  deviceName: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  deviceLocation: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: Colors.badgeGreen,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  currentText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderDefault,
  },
  actionText: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionTextMuted: {
    ...Typography.label,
    color: Colors.textMuted,
  },
  actionTextDanger: {
    ...Typography.label,
    color: Colors.error,
    fontWeight: '600',
  },
  renameInput: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    ...Typography.body,
    color: Colors.textPrimary,
  },
});
