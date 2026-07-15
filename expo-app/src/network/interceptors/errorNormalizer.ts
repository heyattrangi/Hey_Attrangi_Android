import {
  AppError,
  NetworkError,
  NetworkTimeoutError,
  PermissionDeniedError,
  UnauthorizedError,
  UnknownError,
  ValidationError,
  toAppError,
} from '../../types/errors';
import { ErrorInterceptor } from '../types';

/** Maps transport / status failures into typed AppError */
export const errorNormalizerInterceptor: ErrorInterceptor = (error) => {
  if (error instanceof AppError) return error;
  return toAppError(error);
};

export function httpStatusToError(status: number, message?: string): AppError {
  const msg = message ?? `Request failed (${status})`;
  if (status === 401) return new UnauthorizedError(msg);
  if (status === 403) return new PermissionDeniedError(msg);
  if (status === 408) return new NetworkTimeoutError(msg);
  if (status === 422 || status === 400) return new ValidationError(msg);
  if (status === 0 || status >= 500) return new NetworkError(msg);
  return new UnknownError(msg);
}
