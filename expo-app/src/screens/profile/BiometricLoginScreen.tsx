import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { BiometricSetupDialog } from '../../components/ui/dialogs';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Spacing, Typography } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'BiometricLogin'>;
};

export const BiometricLoginScreen: React.FC<Props> = ({ navigation }) => {
  const enabled = usePreferencesStore((s) => s.biometricLoginEnabled);
  const setBiometricLoginEnabled = usePreferencesStore(
    (s) => s.setBiometricLoginEnabled,
  );
  const showToast = useUiStore((s) => s.showToast);
  const [setupVisible, setSetupVisible] = useState(false);

  const onToggle = (next: boolean) => {
    if (next && !enabled) {
      setSetupVisible(true);
      return;
    }
    setBiometricLoginEnabled(false);
    showToast('Biometric login disabled');
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Biometric Login"
        subtitle="Unlock faster (UI only)"
        onBack={() => navigation.goBack()}
      />

      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.label}>Use Face ID / fingerprint</Text>
            <Text style={styles.desc}>
              Frontend preference only — device APIs will connect later.
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={onToggle}
            trackColor={{ false: Colors.borderDefault, true: Colors.primaryLight }}
            thumbColor={enabled ? Colors.primary : Colors.white}
            accessibilityLabel="Biometric login"
          />
        </View>
      </AppCard>

      <BiometricSetupDialog
        visible={setupVisible}
        onCancel={() => setSetupVisible(false)}
        onConfirm={() => {
          setSetupVisible(false);
          setBiometricLoginEnabled(true);
          showToast('Biometric login enabled');
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
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
