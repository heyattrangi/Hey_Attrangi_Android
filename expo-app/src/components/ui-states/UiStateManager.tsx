import React, { memo } from 'react';
import { RequestStatus } from '../../types/api';
import { AppError } from '../../types/errors';
import {
  EmptyKind,
  LoadingDomain,
  resolveUiStateKey,
  UiStateKey,
} from '../../app/ui-states';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineState,
  SuccessState,
} from '../ui/states';
import { Skeleton, Shimmer } from '../ui';
import { FadeInContent } from '../async/FadeInContent';
import { useUiStateStore } from '../../store/uiStateStore';
import { EmptyVariant, ErrorVariant, SuccessVariant } from '../ui/states/variants';

export interface UiStateManagerProps {
  status: RequestStatus;
  error?: AppError | null;
  emptyKind?: EmptyKind;
  loadingDomain?: LoadingDomain;
  searchActive?: boolean;
  hasCachedData?: boolean;
  preferSkeleton?: boolean;
  /** Force a specific design state (e.g. failure.booking) */
  forceState?: UiStateKey;
  /** Enables Zustand per-screen overrides via useUiStateStore */
  screenId?: string;
  onRetry?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  loadingFallback?: React.ReactNode;
  skeletonFallback?: React.ReactNode;
  children: React.ReactNode;
  animateContent?: boolean;
}

const emptyKeyToVariant = (key: UiStateKey): EmptyVariant | null => {
  const map: Partial<Record<UiStateKey, EmptyVariant>> = {
    'empty.chatHistory': 'chatHistory',
    'empty.sessions': 'sessions',
    'empty.therapists': 'therapists',
    'empty.notifications': 'notifications',
    'empty.careCredits': 'careCredits',
    'empty.moodHistory': 'moodHistory',
    'empty.invoices': 'invoices',
    'empty.searchResults': 'searchResults',
  };
  return map[key] ?? null;
};

const errorKeyToVariant = (key: UiStateKey): ErrorVariant | null => {
  const map: Partial<Record<UiStateKey, ErrorVariant>> = {
    'error.server': 'server',
    'error.generic': 'generic',
    'error.sessionExpired': 'sessionExpired',
    'failure.booking': 'booking',
    'failure.payment': 'payment',
  };
  return map[key] ?? null;
};

const successKeyToVariant = (key: UiStateKey): SuccessVariant | null => {
  const map: Partial<Record<UiStateKey, SuccessVariant>> = {
    'success.booking': 'booking',
    'success.payment': 'payment',
    'success.moodSaved': 'moodSaved',
    'success.passwordChanged': 'passwordChanged',
    'success.sessionCancelled': 'sessionCancelled',
  };
  return map[key] ?? null;
};

/**
 * Automatic UI state router driven by backend/API RequestStatus.
 * Renders reusable components from components/ui/states — never hardcodes screens.
 * Optional Zustand overrides (screenId) take priority for QA / demos.
 */
export const UiStateManager = memo<UiStateManagerProps>(({
  status,
  error,
  emptyKind,
  loadingDomain = 'default',
  searchActive = false,
  hasCachedData = false,
  preferSkeleton = false,
  forceState,
  screenId,
  onRetry,
  onPrimaryAction,
  onSecondaryAction,
  loadingFallback,
  skeletonFallback,
  children,
  animateContent = true,
}) => {
  const override = useUiStateStore((s) =>
    screenId ? s.screens[screenId] : undefined,
  );

  // Zustand override — only when explicitly forced away from content
  if (override && override.mode !== 'content') {
    if (override.mode === 'loading') {
      return <LoadingState domain={override.loadingDomain ?? loadingDomain} />;
    }
    if (override.mode === 'offline') {
      return <OfflineState onRetry={onRetry ?? onPrimaryAction} />;
    }
    if (override.mode === 'error') {
      return (
        <ErrorState
          variant={override.errorVariant ?? 'generic'}
          error={error}
          onRetry={onRetry}
          onAction={onPrimaryAction ?? onRetry}
        />
      );
    }
    if (override.mode === 'empty') {
      return (
        <EmptyState
          variant={(override.emptyKind as EmptyVariant) ?? emptyKind ?? 'therapists'}
          onAction={onPrimaryAction ?? onRetry}
        />
      );
    }
    if (override.mode === 'success') {
      return (
        <SuccessState
          variant={override.successVariant ?? 'payment'}
          onAction={onPrimaryAction ?? onSecondaryAction}
        />
      );
    }
  }

  const key =
    forceState ??
    resolveUiStateKey({
      status,
      error,
      emptyKind,
      loadingDomain,
      searchActive,
      hasCachedData,
      preferSkeleton,
    });

  if (key === 'content') {
    const content = <>{children}</>;
    return animateContent ? <FadeInContent>{content}</FadeInContent> : content;
  }

  if (key === 'skeleton') {
    return <>{skeletonFallback ?? <Skeleton variant="list" count={3} />}</>;
  }

  if (key === 'shimmer') {
    return <Shimmer height={120} />;
  }

  if (key === 'loading') {
    if (loadingFallback) return <>{loadingFallback}</>;
    return <LoadingState domain={loadingDomain} />;
  }

  if (key === 'error.internet') {
    return <OfflineState onRetry={onRetry ?? onPrimaryAction} />;
  }

  const emptyVariant = emptyKeyToVariant(key);
  if (emptyVariant) {
    return (
      <EmptyState
        variant={emptyVariant}
        onAction={onPrimaryAction ?? onRetry}
      />
    );
  }

  const errorVariant = errorKeyToVariant(key);
  if (errorVariant) {
    return (
      <ErrorState
        variant={errorVariant}
        error={error}
        onRetry={onRetry}
        onAction={onPrimaryAction ?? onRetry}
      />
    );
  }

  const successVariant = successKeyToVariant(key);
  if (successVariant) {
    return (
      <SuccessState
        variant={successVariant}
        onAction={onPrimaryAction ?? onSecondaryAction}
      />
    );
  }

  return <ErrorState variant="generic" onRetry={onRetry} />;
});

UiStateManager.displayName = 'UiStateManager';
