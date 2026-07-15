import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import { StateCanvas } from './StateCanvas';
import { SUCCESS_VARIANTS, SuccessVariant } from './variants';

export interface SuccessStateProps {
  variant?: SuccessVariant;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

/** Design: Booking Confirmed / Payment Successful / Mood Saved / etc. */
export const SuccessState = memo<SuccessStateProps>(({
  variant = 'payment',
  title,
  message,
  actionLabel,
  onAction,
  children,
  style,
}) => {
  const config = SUCCESS_VARIANTS[variant];
  return (
    <StateCanvas
      illustration={config.illustration}
      title={title ?? config.title}
      message={message ?? config.message}
      titleAccent={config.titleAccent}
      primaryActionLabel={actionLabel ?? config.primaryActionLabel}
      showArrow={config.showArrow}
      onPrimaryAction={onAction}
      style={style}
    >
      {children}
    </StateCanvas>
  );
});

SuccessState.displayName = 'SuccessState';
