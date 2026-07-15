import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useDevToolsStore } from '../../store/devToolsStore';
import { env } from '../../config/env';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'MockApiSwitch'>;
};

export const MockApiSwitchScreen: React.FC<Props> = ({ navigation }) => {
  const mockApiEnabled = useDevToolsStore((s) => s.mockApiEnabled);
  const setMockApiEnabled = useDevToolsStore((s) => s.setMockApiEnabled);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);
  const snapshot = useDevToolsStore((s) => s.snapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Mock API Switch"
        subtitle="Service DI · Mock | Real"
        onBack={() => navigation.goBack()}
      />
      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.label}>Use mock services</Text>
            <Text style={styles.desc}>
              Overrides EXPO_PUBLIC_USE_MOCK for container pickAuth / pickNonAuth
            </Text>
          </View>
          <Switch
            value={mockApiEnabled}
            onValueChange={(v) => void setMockApiEnabled(v)}
            trackColor={{
              false: Colors.borderDefault,
              true: Colors.primaryLight,
            }}
            thumbColor={mockApiEnabled ? Colors.primaryDark : Colors.textMuted}
            accessibilityLabel="Use mock services"
          />
        </View>
      </AppCard>
      <AppCard style={styles.card}>
        <Text style={styles.metaTitle}>Effective</Text>
        <Text style={styles.meta}>
          Mode · {snapshot?.debug.apiMode ?? (mockApiEnabled ? 'mock' : 'real')}
        </Text>
        <Text style={styles.meta}>
          Build USE_MOCK_SERVICES · {String(env.USE_MOCK_SERVICES)}
        </Text>
        <Text style={styles.meta}>
          API base · {snapshot?.debug.apiBaseUrl ?? env.API_BASE_URL}
        </Text>
      </AppCard>
      <View style={styles.note}>
        <Text style={styles.noteText}>
          Real* facades may still delegate to mocks until HTTP endpoints exist.
          HttpClient resets on toggle.
        </Text>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md, gap: Spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  copy: { flex: 1, gap: 4 },
  label: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  metaTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  note: {
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.large,
    padding: Spacing.md,
  },
  noteText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
