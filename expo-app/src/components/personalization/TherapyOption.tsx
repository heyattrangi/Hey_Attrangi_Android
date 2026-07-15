import React, { memo } from 'react';
import { SelectionCard } from './SelectionCard';

interface TherapyOptionProps {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}

/** Therapy option — thin wrapper around shared SelectionCard. */
export const TherapyOption = memo<TherapyOptionProps>(({
  title,
  subtitle,
  selected,
  onPress,
}) => (
  <SelectionCard
    title={title}
    subtitle={subtitle}
    selected={selected}
    onPress={onPress}
    variant="block"
    accessibilityHint={subtitle}
  />
));

TherapyOption.displayName = 'TherapyOption';
