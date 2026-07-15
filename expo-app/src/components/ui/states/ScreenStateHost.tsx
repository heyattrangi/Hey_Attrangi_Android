import React, { memo, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { EmptyKind, LoadingDomain } from '../../../app/ui-states';
import { useUiStateStore, ScreenUiMode } from '../../../store/uiStateStore';
import { RequestStatus } from '../../../types/api';
import { AppError } from '../../../types/errors';
import { FadeInContent } from '../../async/FadeInContent';
import { EmptyState } from './EmptyState';
import { ErrorState, resolveErrorVariant } from './ErrorState';
import { LoadingState } from './LoadingState';
import { OfflineState } from './OfflineState';
import { SuccessState } from './SuccessState';
import { EmptyVariant, ErrorVariant, SuccessVariant } from './variants';

export interface ScreenStateHostProps {
  /** Unique screen key for Zustand overrides (QA / demos) */
  screenId?: string;
  status: RequestStatus;
  error?: AppError | null;
  isEmpty?: boolean;
  emptyVariant?: EmptyVariant | EmptyKind;
  loadingDomain?: LoadingDomain;
  successVariant?: SuccessVariant;
  successTitle?: string;
  successMessage?: string;
  successActionLabel?: string;
  onRetry?: () => void;
  onEmptyAction?: () => void;
  onSuccessAction?: () => void;
  successChildren?: React.ReactNode;
  animateContent?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

const toEmptyVariant = (kind?: EmptyKind | EmptyVariant): EmptyVariant =>
  (kind as EmptyVariant) || 'therapists';

/**
 * Wires API status + Zustand overrides → Loading / Empty / Error / Offline / Success.
 * Screens render content as children; never hardcode state UI inside screens.
 */
export const ScreenStateHost = memo<ScreenStateHostProps>(({
  screenId = 'default',
  status,
  error,
  isEmpty = false,
  emptyVariant = 'therapists',
  loadingDomain = 'default',
  successVariant,
  successTitle,
  successMessage,
  successActionLabel,
  onRetry,
  onEmptyAction,
  onSuccessAction,
  successChildren,
  animateContent = true,
  style,
  children,
}) => {
  const override = useUiStateStore((s) => s.screens[screenId]);

  const resolved = useMemo(() => {
    let mode: ScreenUiMode = 'content';
    let domain: LoadingDomain = loadingDomain;
    let empty: EmptyVariant = toEmptyVariant(emptyVariant);
    let errVariant: ErrorVariant | undefined;
    let success: SuccessVariant | undefined = successVariant;

    if (override && override.mode !== 'content') {
      mode = override.mode;
      if (override.loadingDomain) domain = override.loadingDomain;
      if (override.emptyKind) empty = override.emptyKind;
      if (override.errorVariant) errVariant = override.errorVariant;
      if (override.successVariant) success = override.successVariant;
    } else if (status === 'loading') {
      mode = 'loading';
    } else if (status === 'offline') {
      mode = 'offline';
    } else if (status === 'error') {
      mode = 'error';
    } else if (status === 'empty' || (status === 'success' && isEmpty)) {
      mode = 'empty';
    }

    return { mode, domain, empty, errVariant, success };
  }, [
    override,
    status,
    isEmpty,
    loadingDomain,
    emptyVariant,
    successVariant,
  ]);

  if (resolved.mode === 'loading') {
    return <LoadingState domain={resolved.domain} style={style} />;
  }

  if (resolved.mode === 'offline') {
    return <OfflineState onRetry={onRetry} style={style} />;
  }

  if (resolved.mode === 'error') {
    return (
      <ErrorState
        variant={resolved.errVariant ?? resolveErrorVariant(error)}
        error={error}
        onRetry={onRetry}
        style={style}
      />
    );
  }

  if (resolved.mode === 'empty') {
    return (
      <EmptyState
        variant={resolved.empty}
        onAction={onEmptyAction}
        style={style}
      />
    );
  }

  if (resolved.mode === 'success') {
    return (
      <SuccessState
        variant={resolved.success ?? 'payment'}
        title={successTitle}
        message={successMessage}
        actionLabel={successActionLabel}
        onAction={onSuccessAction}
        style={style}
      >
        {successChildren}
      </SuccessState>
    );
  }

  const content = <>{children}</>;
  return animateContent ? <FadeInContent>{content}</FadeInContent> : content;
});

ScreenStateHost.displayName = 'ScreenStateHost';
