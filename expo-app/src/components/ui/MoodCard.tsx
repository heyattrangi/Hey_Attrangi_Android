import React, { memo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, Spacing, Shadows, Motion } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { toggleA11y } from '../../utils/accessibility';

export interface MoodCardProps {
  label: string;
  /** MaterialCommunityIcons name, or emoji string when iconName omitted */
  iconName?: string;
  emoji?: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const MoodCard = memo<MoodCardProps>(({
  label,
  iconName,
  emoji,
  selected = false,
  onPress,
  style,
}) => (
  <TouchableOpacity
    style={[styles.card, selected && styles.cardSelected, style]}
    onPress={onPress}
    activeOpacity={Motion.opacity.pressed}
    {...toggleA11y(label, selected, 'Double tap to select mood')}
  >
    <View style={styles.iconWrap}>
      {iconName ? (
        <Icon
          name={iconName}
          size={28}
          color={selected ? Colors.primary : Colors.textSecondary}
        />
      ) : emoji ? (
        <Text style={styles.emoji}>{emoji}</Text>
      ) : (
        <Icon name="emoticon-outline" size={28} color={Colors.textSecondary} />
      )}
    </View>
    <Text
      style={[styles.label, selected && styles.labelSelected]}
      numberOfLines={1}
      maxFontSizeMultiplier={1.3}
    >
      {label}
    </Text>
  </TouchableOpacity>
));

MoodCard.displayName = 'MoodCard';

const styles = StyleSheet.create({
  card: {
    minWidth: 72,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.xlarge,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.low,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  iconWrap: {
    marginBottom: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  labelSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
