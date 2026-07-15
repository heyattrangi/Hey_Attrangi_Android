import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { PerfMetricRow } from '../../components/devtools';
import { useDevToolsStore } from '../../store/devToolsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'PerformanceMonitor'
  >;
};

export const PerformanceMonitorScreen: React.FC<Props> = ({ navigation }) => {
  const perfMetrics = useDevToolsStore((s) => s.perfMetrics);
  const refreshPerf = useDevToolsStore((s) => s.refreshPerf);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);
  const [tick, setTick] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  useEffect(() => {
    mounted.current = true;
    const id = setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        void refreshPerf(next);
        return next;
      });
    }, 1500);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [refreshPerf]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Performance Monitor"
        subtitle="Lightweight heuristics"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.hint}>
        Sample tick #{tick}. Not a replacement for Flipper / Instruments.
      </Text>
      {perfMetrics.map((m) => (
        <PerfMetricRow
          key={m.id}
          label={m.label}
          value={m.value}
          hint={m.hint}
          status={m.status}
        />
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
});
