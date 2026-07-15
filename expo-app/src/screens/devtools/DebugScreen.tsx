import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { GallerySection } from '../../components/devtools';
import { useDevToolsStore } from '../../store/devToolsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'DebugScreen'>;
};

export const DebugScreen: React.FC<Props> = ({ navigation }) => {
  const snapshot = useDevToolsStore((s) => s.snapshot);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);
  const debug = snapshot?.debug;

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const rows: Array<[string, string]> = [
    ['App version', debug?.appVersion ?? '—'],
    ['Bundle hint', debug?.bundleIdHint ?? '—'],
    ['JS engine', debug?.jsEngineHint ?? '—'],
    ['Platform', debug?.platform ?? '—'],
    ['__DEV__', String(debug?.isDev ?? __DEV__)],
    ['API mode', debug?.apiMode ?? '—'],
    ['Env', debug?.envCurrent ?? '—'],
    ['API URL', debug?.apiBaseUrl ?? '—'],
    [
      'Flags on',
      debug
        ? `${debug.flagsEnabledCount} / ${debug.flagsTotal}`
        : '—',
    ],
  ];

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Debug Screen"
        subtitle="Build & runtime info"
        onBack={() => navigation.goBack()}
      />
      <GallerySection title="Snapshot">
        {rows.map(([label, value]) => (
          <AppCard key={label} style={styles.card}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value} selectable>
              {value}
            </Text>
          </AppCard>
        ))}
      </GallerySection>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm, gap: 2 },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
});
