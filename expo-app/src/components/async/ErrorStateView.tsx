import React from 'react';
import { AppError } from '../../types/errors';
import { ErrorState, OfflineState, resolveErrorVariant } from '../ui/states';

export interface ErrorStateViewProps {
  error?: AppError | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Design: Server Error / Something went wrong / Session expired / No Internet */
export const ErrorStateView: React.FC<ErrorStateViewProps> = ({
  error,
  onRetry,
}) => {
  if (error?.code === 'NETWORK_ERROR') {
    return <OfflineState onRetry={onRetry} />;
  }
  return (
    <ErrorState
      variant={resolveErrorVariant(error)}
      error={error}
      onRetry={onRetry}
    />
  );
};
