import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaymentSummaryLine } from '../../types/domain';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';
import { AppCard } from '../app';

export interface PaymentSummaryCardProps {
  lines: PaymentSummaryLine[];
  title?: string;
}

export const PaymentSummaryCard = memo<PaymentSummaryCardProps>(({
  lines,
  title = 'Payment summary',
}) => (
  <AppCard style={styles.card} accessibilityLabel={title}>
    <Text style={styles.title}>{title}</Text>
    {lines.map((line) => (
      <View key={line.label} style={styles.row}>
        <Text
          style={[
            styles.label,
            line.muted && styles.muted,
            line.emphasize && styles.emphasizeLabel,
          ]}
        >
          {line.label}
        </Text>
        <Text
          style={[
            styles.amount,
            line.muted && styles.muted,
            line.emphasize && styles.emphasizeAmount,
          ]}
        >
          {line.amount}
        </Text>
      </View>
    ))}
  </AppCard>
));

PaymentSummaryCard.displayName = 'PaymentSummaryCard';

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    borderRadius: Radius.large,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  amount: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  muted: { color: Colors.textMuted },
  emphasizeLabel: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  emphasizeAmount: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
