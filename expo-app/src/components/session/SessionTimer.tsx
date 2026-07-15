import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';

const format = (totalSeconds: number) => {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
};

export interface SessionTimerProps {
  elapsedSeconds: number;
  durationMinutes: number;
}

export const SessionTimer = memo<SessionTimerProps>(({
  elapsedSeconds,
  durationMinutes,
}) => {
  const total = durationMinutes * 60;
  const remaining = Math.max(0, total - elapsedSeconds);
  const progress = Math.min(1, elapsedSeconds / Math.max(1, total));

  const a11y = useMemo(
    () =>
      `Elapsed ${format(elapsedSeconds)}, remaining ${format(remaining)}`,
    [elapsedSeconds, remaining],
  );

  return (
    <View style={styles.wrap} accessibilityLabel={a11y}>
      <View style={styles.row}>
        <Text style={styles.label}>Elapsed</Text>
        <Text style={styles.value}>{format(elapsedSeconds)}</Text>
        <Text style={styles.sep}>·</Text>
        <Text style={styles.label}>Left</Text>
        <Text style={styles.value}>{format(remaining)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
});

SessionTimer.displayName = 'SessionTimer';

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  value: {
    ...Typography.caption,
    color: Colors.textWhite,
    fontWeight: '700',
  },
  sep: { color: Colors.textMuted },
  track: {
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
  },
});
