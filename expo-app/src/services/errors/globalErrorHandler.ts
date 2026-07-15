import { analytics } from '../analytics/AnalyticsService';
import { crashReporting } from '../crash/CrashReporting';
import { useUiStore } from '../../store/uiStore';
import {
  AppError,
  PermissionDeniedError,
  UnauthorizedError,
  toAppError,
} from '../../types/errors';

export type GlobalErrorPresentation =
  | 'toast'
  | 'banner'
  | 'silent'
  | 'session';

export interface HandleGlobalErrorOptions {
  presentation?: GlobalErrorPresentation;
  /** Caller-provided retry (e.g. refetch) */
  onRetry?: () => void;
  context?: Record<string, unknown>;
}

let sessionExpiredHandler: (() => void) | null = null;

/** Wire from RootNavigator / auth layer */
export function registerSessionExpiredHandler(handler: () => void): void {
  sessionExpiredHandler = handler;
}

/**
 * Centralized error → UX mapping.
 * Screens can still render AsyncStateRenderer; this covers global/action failures.
 */
export function handleGlobalError(
  error: unknown,
  options: HandleGlobalErrorOptions = {},
): AppError {
  const appError = toAppError(error);
  const presentation = options.presentation ?? 'toast';
  const ui = useUiStore.getState();

  crashReporting.captureException(appError, options.context);
  analytics.track('error_shown', {
    code: appError.code,
    presentation,
  });

  if (appError instanceof UnauthorizedError) {
    sessionExpiredHandler?.();
    if (presentation !== 'silent') {
      ui.showBanner('warning', appError.message);
    }
    return appError;
  }

  if (appError instanceof PermissionDeniedError) {
    if (presentation !== 'silent') {
      ui.showBanner('warning', appError.message);
    }
    return appError;
  }

  if (presentation === 'silent') return appError;

  if (presentation === 'banner') {
    ui.showBanner(
      appError.retryable ? 'warning' : 'error',
      appError.message,
    );
    if (options.onRetry) {
      ui.showSnackbar({
        message: 'Something went wrong',
        actionLabel: 'Retry',
        onAction: options.onRetry,
      });
    }
    return appError;
  }

  ui.showToast(
    appError.message,
    appError.code === 'NETWORK_ERROR' || appError.code === 'NETWORK_TIMEOUT'
      ? 'warning'
      : 'error',
  );
  return appError;
}
