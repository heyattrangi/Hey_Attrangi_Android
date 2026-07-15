import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import { AppError } from '../../../types/errors';
import { StateCanvas } from './StateCanvas';
import { ERROR_VARIANTS, ErrorVariant } from './variants';

export interface ErrorStateProps {
  variant?: ErrorVariant;
  /** Auto-pick variant from AppError when variant omitted */
  error?: AppError | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onAction?: () => void;
  style?: ViewStyle;
}

export const resolveErrorVariant = (error?: AppError | null): ErrorVariant => {
  if (!error) return 'generic';
  if (error.code === 'UNAUTHORIZED' || error.statusCode === 401) return 'sessionExpired';
  if (
    error.code === 'NETWORK_ERROR' ||
    error.code === 'NETWORK_TIMEOUT' ||
    error.statusCode === 408
  ) {
    return 'generic';
  }
  if (error.statusCode && error.statusCode >= 500) return 'server';
  return 'generic';
};

/** Design: Server Error / Something went wrong / Session expired / Booking & Payment failed */
export const ErrorState = memo<ErrorStateProps>(({
  variant,
  error,
  title,
  message,
  onRetry,
  onAction,
  style,
}) => {
  const resolved = variant ?? resolveErrorVariant(error);
  const config = ERROR_VARIANTS[resolved];
  const action = onAction ?? onRetry;

  return (
    <StateCanvas
      illustration={config.illustration}
      title={title ?? config.title}
      message={message ?? config.message}
      primaryActionLabel={config.primaryActionLabel}
      onPrimaryAction={action}
      style={style}
    />
  );
});

ErrorState.displayName = 'ErrorState';
