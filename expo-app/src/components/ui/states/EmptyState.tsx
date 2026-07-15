import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import { EmptyKind } from '../../../app/ui-states';
import { StateCanvas } from './StateCanvas';
import { EMPTY_VARIANTS, EmptyVariant } from './variants';

export interface EmptyStateProps {
  /** Preferred: Design-folder empty variant */
  variant?: EmptyVariant;
  /** Alias for variant (legacy EmptyStateView) */
  emptyKind?: EmptyKind | EmptyVariant;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/** Design-folder empty states — No chat / sessions / therapists / etc. */
export const EmptyState = memo<EmptyStateProps>(({
  variant,
  emptyKind,
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  const key = (variant ?? emptyKind ?? 'therapists') as EmptyVariant;
  const config = EMPTY_VARIANTS[key] ?? EMPTY_VARIANTS.therapists;
  return (
    <StateCanvas
      illustration={config.illustration}
      title={title ?? config.title}
      message={message ?? config.message}
      primaryActionLabel={actionLabel ?? config.primaryActionLabel}
      showArrow={config.showArrow}
      onPrimaryAction={onAction}
      style={style}
    />
  );
});

EmptyState.displayName = 'EmptyState';
