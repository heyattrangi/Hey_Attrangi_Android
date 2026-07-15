import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface GallerySectionProps {
  title: string;
  children: React.ReactNode;
}

export const GallerySection = memo<GallerySectionProps>(({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.title} accessibilityRole="header">
      {title}
    </Text>
    {children}
  </View>
));

GallerySection.displayName = 'GallerySection';

export interface DevMenuRowProps {
  label: string;
  subtitle: string;
  onPress: () => void;
}

export const DevMenuRow = memo<DevMenuRowProps>(
  ({ label, subtitle, onPress }) => (
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress();
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
      {...buttonA11y(label, { hint: subtitle })}
    >
      <AppCard style={styles.card}>
        <Text style={styles.label} maxFontSizeMultiplier={1.3}>
          {label}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </AppCard>
    </Pressable>
  ),
);

DevMenuRow.displayName = 'DevMenuRow';

export interface TokenSwatchProps {
  token: string;
  hex: string;
}

export const TokenSwatch = memo<TokenSwatchProps>(({ token, hex }) => (
  <View style={styles.swatchRow} accessibilityLabel={`${token} ${hex}`}>
    <View style={[styles.swatch, { backgroundColor: hex }]} />
    <View style={styles.swatchCopy}>
      <Text style={styles.label}>{token}</Text>
      <Text style={styles.subtitle}>{hex}</Text>
    </View>
  </View>
));

TokenSwatch.displayName = 'TokenSwatch';

export interface PerfMetricRowProps {
  label: string;
  value: string;
  hint?: string;
  status?: 'ok' | 'warn' | 'info';
}

export const PerfMetricRow = memo<PerfMetricRowProps>(
  ({ label, value, hint, status = 'info' }) => (
    <AppCard style={styles.card}>
      <View style={styles.metricTop}>
        <Text style={styles.label}>{label}</Text>
        <Text
          style={[
            styles.metricValue,
            status === 'ok' && styles.ok,
            status === 'warn' && styles.warn,
          ]}
        >
          {value}
        </Text>
      </View>
      {hint ? <Text style={styles.subtitle}>{hint}</Text> : null}
    </AppCard>
  ),
);

PerfMetricRow.displayName = 'PerfMetricRow';

export interface NetworkLogRowProps {
  method: string;
  path: string;
  status: number | 'mock';
  durationMs: number;
  source: string;
}

export const NetworkLogRow = memo<NetworkLogRowProps>(
  ({ method, path, status, durationMs, source }) => (
    <AppCard style={styles.card}>
      <Text style={styles.label}>
        {method} {path}
      </Text>
      <Text style={styles.subtitle}>
        {String(status)} · {durationMs}ms · {source}
      </Text>
    </AppCard>
  ),
);

NetworkLogRow.displayName = 'NetworkLogRow';

export interface ShowcaseChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export const ShowcaseChip = memo<ShowcaseChipProps>(
  ({ label, selected, onPress }) => (
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress();
      }}
      style={[styles.chip, selected && styles.chipSelected]}
      {...buttonA11y(label)}
      accessibilityState={{ selected: Boolean(selected) }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  ),
);

ShowcaseChip.displayName = 'ShowcaseChip';

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.lg },
  title: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  pressed: { opacity: 0.92 },
  card: { marginBottom: Spacing.sm, gap: 4 },
  label: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  swatchCopy: { flex: 1, gap: 2 },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  metricValue: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ok: { color: Colors.success },
  warn: { color: Colors.warning },
  chip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chipSelected: { backgroundColor: Colors.primaryDark },
  chipText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  chipTextSelected: { color: Colors.textWhite },
});
