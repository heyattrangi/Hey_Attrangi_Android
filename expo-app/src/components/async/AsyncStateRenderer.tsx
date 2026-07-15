import React from 'react';
import { RequestStatus } from '../../types/api';
import { AppError } from '../../types/errors';
import { EmptyKind, LoadingDomain } from '../../app/ui-states';
import { UiStateManager } from '../ui-states/UiStateManager';
import { EmptyStateViewProps } from './EmptyStateView';

export interface AsyncStateRendererProps {
  status: RequestStatus;
  error?: AppError | null;
  onRetry?: () => void;
  /** @deprecated Prefer emptyKind — Design states are resolved automatically */
  loading?: React.ReactNode;
  /** @deprecated Prefer emptyKind */
  empty?: React.ReactNode | EmptyStateViewProps;
  /** @deprecated Prefer automatic error resolution via UiStateManager */
  errorView?: React.ReactNode;
  /** @deprecated Prefer automatic offline resolution */
  offline?: React.ReactNode;
  hasCachedData?: boolean;
  children: React.ReactNode;
  animateContent?: boolean;
  /** Design empty state kind — drives which Design PNG empty view is shown */
  emptyKind?: EmptyKind;
  loadingDomain?: LoadingDomain;
  searchActive?: boolean;
  preferSkeleton?: boolean;
  onEmptyAction?: () => void;
  /** Enables Zustand screen-state overrides for QA / demos */
  screenId?: string;
}

/**
 * Screen-level async boundary.
 * Delegates to UiStateManager → components/ui/states (Loading/Empty/Error/Offline/Success).
 */
export const AsyncStateRenderer: React.FC<AsyncStateRendererProps> = ({
  status,
  error,
  onRetry,
  loading,
  empty,
  errorView,
  offline,
  hasCachedData = false,
  children,
  animateContent = true,
  emptyKind,
  loadingDomain = 'default',
  searchActive = false,
  preferSkeleton = Boolean(loading),
  onEmptyAction,
  screenId,
}) => {
  if (status === 'offline' && !hasCachedData && offline) {
    return <>{offline}</>;
  }
  if (status === 'error' && !hasCachedData && errorView) {
    return <>{errorView}</>;
  }
  if (status === 'empty' && React.isValidElement(empty)) {
    return <>{empty}</>;
  }

  const emptyAction =
    onEmptyAction ??
    (empty && !React.isValidElement(empty)
      ? (empty as EmptyStateViewProps).onAction
      : undefined);

  return (
    <UiStateManager
      screenId={screenId}
      status={status}
      error={error}
      emptyKind={emptyKind}
      loadingDomain={loadingDomain}
      searchActive={searchActive}
      hasCachedData={hasCachedData}
      preferSkeleton={preferSkeleton}
      onRetry={onRetry}
      onPrimaryAction={status === 'empty' ? emptyAction : undefined}
      loadingFallback={loading}
      skeletonFallback={preferSkeleton ? loading : undefined}
      animateContent={animateContent}
    >
      {children}
    </UiStateManager>
  );
};
