import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard, Icon, AppIcons } from '../../components/app';
import {
  DeleteAccountDialog,
  LogoutDialog,
} from '../../components/ui/dialogs';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AccountManagement'>;
};

export const AccountManagementScreen: React.FC<Props> = ({ navigation }) => {
  const logout = useAuthStore((s) => s.logout);
  const showToast = useUiStore((s) => s.showToast);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const rows: Array<{
    label: string;
    description: string;
    danger?: boolean;
    onPress: () => void;
  }> = [
    {
      label: 'Export My Data',
      description: 'Prepare a copy of your journal, mood, and profile',
      onPress: () =>
        showToast('Export queued — backend will deliver your archive later'),
    },
    {
      label: 'Download Reports',
      description: 'Mood and wellness reports (placeholder)',
      onPress: () =>
        Alert.alert(
          'Download Reports',
          'Report downloads will be available when analytics export is connected.',
        ),
    },
    {
      label: 'Deactivate Account',
      description: 'Pause your account without deleting data',
      onPress: () =>
        Alert.alert(
          'Deactivate Account',
          'Deactivation will pause access until you sign in again. Backend wiring comes later.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Deactivate',
              style: 'destructive',
              onPress: () => showToast('Deactivation prepared (frontend only)'),
            },
          ],
        ),
    },
    {
      label: 'Delete Account',
      description: 'Permanently remove your Hey Attrangi account',
      danger: true,
      onPress: () => setDeleteVisible(true),
    },
    {
      label: 'Log Out',
      description: 'Sign out on this device',
      danger: true,
      onPress: () => setLogoutVisible(true),
    },
  ];

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Account Management"
        subtitle="Data, pause, and leave"
        onBack={() => navigation.goBack()}
      />

      {rows.map((row) => (
        <AppCard key={row.label} style={styles.card} onPress={row.onPress}>
          <View style={styles.row}>
            <View style={styles.copy}>
              <Text style={[styles.label, row.danger && styles.danger]}>
                {row.label}
              </Text>
              <Text style={styles.desc}>{row.description}</Text>
            </View>
            <Icon name={AppIcons.chevronRight} size={22} color={Colors.textMuted} />
          </View>
        </AppCard>
      ))}

      <LogoutDialog
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={() => {
          setLogoutVisible(false);
          void logout();
        }}
      />

      <DeleteAccountDialog
        visible={deleteVisible}
        onCancel={() => setDeleteVisible(false)}
        onConfirm={() => {
          setDeleteVisible(false);
          showToast('Account deletion prepared (frontend only)', 'error');
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
  danger: {
    color: Colors.error,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
