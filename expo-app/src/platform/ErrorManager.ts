import { create } from 'zustand';
import {
  AppError,
  AppErrorCode,
  NetworkError,
  NetworkTimeoutError,
  PermissionDeniedError,
  UnauthorizedError,
  ValidationError,
  UnknownError,
  toAppError,
} from '../types/errors';
import { handleGlobalError } from '../services/errors/globalErrorHandler';
import { NetworkManager } from './NetworkManager';
import { analytics } from '../services/analytics/AnalyticsService';
import { logger } from '../utils/logger';

export type ErrorCategory =
  | 'authentication'
  | 'permission'
  | 'network'
  | 'timeout'
  | 'validation'
  | 'maintenance'
  | 'server'
  | 'unknown'
  | 'crash';

export interface GlobalErrorRecord {
  id: string;
  category: ErrorCategory;
  title: string;
  message: string;
  retryable: boolean;
  code: AppErrorCode | 'MAINTENANCE' | 'SERVER_UNAVAILABLE' | 'CRASH';
  createdAt: number;
  onRetry?: () => void;
}

interface ErrorManagerState {
  active: GlobalErrorRecord | null;
  present: (record: GlobalErrorRecord) => void;
  dismiss: () => void;
  retry: () => void;
}

export const useErrorManagerStore = create<ErrorManagerState>((set, get) => ({
  active: null,
  present: (record) => set({ active: record }),
  dismiss: () => set({ active: null }),
  retry: () => {
    const active = get().active;
    get().dismiss();
    active?.onRetry?.();
  },
}));

function categorize(error: AppError): ErrorCategory {
  if (error instanceof UnauthorizedError) return 'authentication';
  if (error instanceof PermissionDeniedError) return 'permission';
  if (error instanceof NetworkTimeoutError) return 'timeout';
  if (error instanceof NetworkError) return 'network';
  if (error instanceof ValidationError) return 'validation';
  if (error.code === 'NETWORK_ERROR') return 'network';
  if (error.statusCode === 503) return 'maintenance';
  if (error.statusCode && error.statusCode >= 500) return 'server';
  return 'unknown';
}

function titleFor(category: ErrorCategory): string {
  switch (category) {
    case 'authentication':
      return 'Sign in required';
    case 'permission':
      return 'Permission needed';
    case 'network':
      return 'Connection issue';
    case 'timeout':
      return 'Request timed out';
    case 'validation':
      return 'Check your input';
    case 'maintenance':
      return 'Under maintenance';
    case 'server':
      return 'Server unavailable';
    case 'crash':
      return 'Something went wrong';
    default:
      return 'Something went wrong';
  }
}

/**
 * Global Error Manager — maps AppError → toast/banner/modal + recovery.
 */
export const ErrorManager = {
  handle(
    error: unknown,
    options: {
      presentation?: 'toast' | 'banner' | 'modal' | 'silent' | 'session';
      onRetry?: () => void;
      context?: Record<string, unknown>;
    } = {},
  ): AppError {
    const appError = toAppError(error);
    const category = categorize(appError);

    if (category === 'server') {
      NetworkManager.markServerUnavailable(true);
    }
    if (category === 'maintenance' || appError.statusCode === 503) {
      NetworkManager.markMaintenance(true);
    }

    logger.warn('[ErrorManager]', category, appError.code, appError.message);

    if (options.presentation === 'modal') {
      useErrorManagerStore.getState().present({
        id: `err_${Date.now()}`,
        category,
        title: titleFor(category),
        message: appError.message,
        retryable: appError.retryable,
        code: appError.code,
        createdAt: Date.now(),
        onRetry: options.onRetry,
      });
      analytics.track('error_shown', {
        code: appError.code,
        presentation: 'modal',
        category,
      });
      return appError;
    }

    return handleGlobalError(appError, {
      presentation:
        options.presentation === 'session'
          ? 'session'
          : options.presentation === 'silent'
            ? 'silent'
            : options.presentation === 'banner'
              ? 'banner'
              : 'toast',
      onRetry: options.onRetry,
      context: options.context,
    });
  },

  presentCrash(message: string, onRetry?: () => void): void {
    useErrorManagerStore.getState().present({
      id: `crash_${Date.now()}`,
      category: 'crash',
      title: 'Something went wrong',
      message,
      retryable: true,
      code: 'CRASH',
      createdAt: Date.now(),
      onRetry,
    });
  },

  dismiss(): void {
    useErrorManagerStore.getState().dismiss();
  },
};

export { UnknownError };
