import { AppError } from '../errors';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: AppError;
}

export interface SuccessResponse<T> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface ApiValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiValidationErrorPayload {
  code: 'VALIDATION_ERROR';
  message: string;
  details: ApiValidationErrorDetail[];
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  statusCode?: number;
}

export type RequestStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'error'
  | 'offline';

export interface AsyncState<T> {
  status: RequestStatus;
  data: T | null;
  error: AppError | null;
}

export const createIdleState = <T>(): AsyncState<T> => ({
  status: 'idle',
  data: null,
  error: null,
});

export const createLoadingState = <T>(previous?: AsyncState<T>): AsyncState<T> => ({
  status: 'loading',
  data: previous?.data ?? null,
  error: null,
});

export const createSuccessState = <T>(data: T): AsyncState<T> => ({
  status: 'success',
  data,
  error: null,
});

export const createErrorState = <T>(error: AppError, previous?: AsyncState<T>): AsyncState<T> => ({
  status: 'error',
  data: previous?.data ?? null,
  error,
});

export const createEmptyState = <T>(previous?: AsyncState<T>): AsyncState<T> => ({
  status: 'empty',
  data: previous?.data ?? null,
  error: null,
});

export const createOfflineState = <T>(error: AppError, previous?: AsyncState<T>): AsyncState<T> => ({
  status: 'offline',
  data: previous?.data ?? null,
  error,
});

export const isAsyncLoading = (status: RequestStatus) =>
  status === 'idle' || status === 'loading';

export const isAsyncFailure = (status: RequestStatus) =>
  status === 'error' || status === 'offline';
