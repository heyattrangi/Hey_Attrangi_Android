import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { ShowcaseChip } from '../../components/devtools';
import {
  LogoutDialog,
  CancelSessionDialog,
  DiscardChangesDialog,
  DeleteAccountDialog,
  PermissionRequiredDialog,
  BiometricSetupDialog,
  SessionExpiredDialog,
  RescheduleSessionDialog,
} from '../../components/ui/dialogs';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'DialogGallery'>;
};

type DialogKey =
  | 'logout'
  | 'cancel'
  | 'discard'
  | 'delete'
  | 'permission'
  | 'biometric'
  | 'session'
  | 'reschedule';

const DIALOGS: Array<{ key: DialogKey; label: string }> = [
  { key: 'logout', label: 'Logout' },
  { key: 'cancel', label: 'Cancel session' },
  { key: 'discard', label: 'Discard' },
  { key: 'delete', label: 'Delete account' },
  { key: 'permission', label: 'Permission' },
  { key: 'biometric', label: 'Biometric' },
  { key: 'session', label: 'Session expired' },
  { key: 'reschedule', label: 'Reschedule' },
];

export const DialogGalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [open, setOpen] = useState<DialogKey | null>(null);
  const close = () => setOpen(null);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Dialog Gallery"
        subtitle="Design dialogs"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.hint}>Tap a chip to open the dialog.</Text>
      <View style={styles.chips}>
        {DIALOGS.map((d) => (
          <ShowcaseChip
            key={d.key}
            label={d.label}
            selected={open === d.key}
            onPress={() => setOpen(d.key)}
          />
        ))}
      </View>

      <LogoutDialog
        visible={open === 'logout'}
        onConfirm={close}
        onCancel={close}
      />
      <CancelSessionDialog
        visible={open === 'cancel'}
        onCancelSession={close}
        onReschedule={close}
        onDismiss={close}
      />
      <DiscardChangesDialog
        visible={open === 'discard'}
        onConfirm={close}
        onCancel={close}
      />
      <DeleteAccountDialog
        visible={open === 'delete'}
        onConfirm={close}
        onCancel={close}
      />
      <PermissionRequiredDialog
        visible={open === 'permission'}
        onOpenSettings={close}
        onCancel={close}
      />
      <BiometricSetupDialog
        visible={open === 'biometric'}
        onConfirm={close}
        onCancel={close}
      />
      <SessionExpiredDialog
        visible={open === 'session'}
        onSignIn={close}
      />
      <RescheduleSessionDialog
        visible={open === 'reschedule'}
        onReschedule={close}
        onDismiss={close}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
