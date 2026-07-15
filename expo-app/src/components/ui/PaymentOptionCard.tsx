import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BorderRadius } from '../../theme/borderRadius';
import { Shadows } from '../../theme/shadows';
import { Spacing } from '../../theme/spacing';
import { Icon } from '../app/Icon';
import { toggleA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

interface PaymentOptionCardProps {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}

export const PaymentOptionCard = memo<PaymentOptionCardProps>(({
  label,
  icon,
  selected,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.card, selected && styles.cardSelected]}
    onPress={onPress}
    activeOpacity={0.8}
    {...toggleA11y(label, selected, 'Double tap to choose payment method')}
  >
    <Icon name={icon} size={28} color={Colors.textPrimary} />
    <Text style={styles.label} maxFontSizeMultiplier={1.3}>
      {label}
    </Text>
  </TouchableOpacity>
));

PaymentOptionCard.displayName = 'PaymentOptionCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
    ...Shadows.low,
  },
  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
    fontWeight: '500',
  },
});
