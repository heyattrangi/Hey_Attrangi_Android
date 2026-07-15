import { normalizeServiceError } from '../api/client';
import { useNetworkStore } from '../store/networkStore';
import { RequestStatus } from '../types/api';
import { AppError } from '../types/errors';

export const resolveListStatus = (
  items: unknown[],
  error: AppError | null,
  options?: { isOffline?: boolean },
): RequestStatus => {
  const isOffline = options?.isOffline ?? !useNetworkStore.getState().isConnected;

  if (isOffline && items.length === 0) {
    return 'offline';
  }

  if (error && items.length === 0) {
    if (error.code === 'NETWORK_ERROR') {
      return 'offline';
    }
    return 'error';
  }

  if (items.length === 0) {
    return 'empty';
  }

  return 'success';
};

export const resolveFetchError = (
  error: unknown,
  cachedItems: unknown[],
): { status: RequestStatus; error: AppError } => {
  const appError = normalizeServiceError(error);
  const isOffline = !useNetworkStore.getState().isConnected;

  if ((isOffline || appError.code === 'NETWORK_ERROR') && cachedItems.length > 0) {
    return { status: 'success', error: appError };
  }

  if (isOffline || appError.code === 'NETWORK_ERROR') {
    return { status: 'offline', error: appError };
  }

  return { status: 'error', error: appError };
};

export const isLoadingStatus = (status: RequestStatus) =>
  status === 'loading' || status === 'idle';

export const isBlockingStatus = (status: RequestStatus) =>
  status === 'loading' || status === 'offline' || status === 'error';
