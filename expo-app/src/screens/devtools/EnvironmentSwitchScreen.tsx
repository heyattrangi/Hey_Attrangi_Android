import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useDevToolsStore } from '../../store/devToolsStore';
import type { AppEnvironment } from '../../config/env';
import { env } from '../../config/env';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { hapticSelection } from '../../utils/haptics';
import { buttonA11y } from '../../utils/accessibility';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'EnvironmentSwitch'
  >;
};

const ENVIRONMENTS: AppEnvironment[] = [
  'mock',
  'development',
  'staging',
  'production',
];

export const EnvironmentSwitchScreen: React.FC<Props> = ({ navigation }) => {
  const preferredEnv = useDevToolsStore((s) => s.preferredEnv);
  const setPreferredEnv = useDevToolsStore((s) => s.setPreferredEnv);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);
  const snapshot = useDevToolsStore((s) => s.snapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Environment Switch"
        subtitle="Preferred API environment"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.hint}>
        Build env is <Text style={styles.bold}>{env.current}</Text>. Preferred
        overrides affect effective URL readout and HttpClient reset.
      </Text>
      {ENVIRONMENTS.map((item) => {
        const selected = preferredEnv === item;
        return (
          <Pressable
            key={item}
            onPress={() => {
              void hapticSelection();
              void setPreferredEnv(item);
            }}
            {...buttonA11y(item)}
          >
            <AppCard style={selected ? styles.cardSelected : styles.card}>
              <Text style={styles.label}>{item}</Text>
              <Text style={styles.desc}>
                {selected ? 'Selected' : 'Tap to prefer'}
              </Text>
            </AppCard>
          </Pressable>
        );
      })}
      <AppCard style={styles.card}>
        <Text style={styles.metaTitle}>Effective URL</Text>
        <Text style={styles.meta}>
          {snapshot?.debug.apiBaseUrl ?? env.API_BASE_URL}
        </Text>
      </AppCard>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  bold: { fontWeight: '700', color: Colors.textPrimary },
  card: { marginBottom: Spacing.sm, gap: 2 },
  cardSelected: {
    marginBottom: Spacing.sm,
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  label: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textMuted,
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
});
