import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { toggleA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface PreferenceOptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export const PreferenceOptionCard = memo<PreferenceOptionCardProps>(({
  label,
  description,
  selected,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.card, selected && styles.cardSelected]}
    onPress={onPress}
    activeOpacity={Motion.opacity.pressed}
    {...toggleA11y(label, selected)}
  >
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected ? <View style={styles.radioDot} /> : null}
    </View>
    <View style={styles.copy}>
      <Text style={[styles.label, selected && styles.labelSelected]} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
      {description ? (
        <Text style={styles.description} maxFontSizeMultiplier={1.4}>
          {description}
        </Text>
      ) : null}
    </View>
  </TouchableOpacity>
));

PreferenceOptionCard.displayName = 'PreferenceOptionCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
    padding: Spacing.md,
    borderRadius: Radius.large,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  copy: { flex: 1 },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  labelSelected: {
    color: Colors.primary,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
