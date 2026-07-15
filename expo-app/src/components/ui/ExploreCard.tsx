import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Radius, Shadows, Spacing } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';

interface ExploreCardProps {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  onPress: () => void;
}

export const ExploreCard = memo<ExploreCardProps>(({
  title,
  subtitle,
  icon,
  iconColor,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.exploreCard}
    onPress={onPress}
    activeOpacity={0.85}
    {...buttonA11y(title, { hint: subtitle })}
  >
    <Icon name={icon} size={28} color={iconColor} />
    <Text style={styles.exploreTitle} maxFontSizeMultiplier={1.3}>
      {title}
    </Text>
    <Text style={styles.exploreSubtitle} maxFontSizeMultiplier={1.3}>
      {subtitle}
    </Text>
  </TouchableOpacity>
));

ExploreCard.displayName = 'ExploreCard';

const styles = StyleSheet.create({
  exploreCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.md,
    marginHorizontal: 4,
    minHeight: 120,
    justifyContent: 'flex-start',
    ...Shadows.low,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  exploreTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  exploreSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
