import {
  AppError,
  NetworkError,
  NetworkTimeoutError,
  PermissionDeniedError,
  RateLimitError,
  ServerError,
  ServiceUnavailableError,
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

export function httpStatusToError(status: number, message?: string, resetInSeconds?: number): AppError {
  const defaultMsg = status === 404 ? 'Resource not available.' : 'Something went wrong. Please try again.';
  const msg = message ?? defaultMsg;
  if (status === 401) return new UnauthorizedError('Your session has expired. Please sign in again.');
  if (status === 403) return new PermissionDeniedError('Permission denied. Check settings to continue.');
  if (status === 429 || status === 427) return new RateLimitError(message || 'Usage limit reached. Upgrade to Premium for higher limits.', resetInSeconds);
  if (status === 408) return new NetworkTimeoutError("Connection timed out. Please try again.");
  if (status === 422 || status === 400) {
    if (message && (message.toLowerCase().includes('limit') || message.toLowerCase().includes('quota') || message.toLowerCase().includes('exceeded'))) {
      return new RateLimitError(message, resetInSeconds);
    }
    return new ValidationError('Please check your input details and try again.');
  }
  if (status === 500) return new ServerError("We're experiencing a server issue. Please try again.");
  if (status === 503) return new ServiceUnavailableError('Pragya is temporarily unavailable. Please try again.');
  if (status === 0) return new NetworkError("We're having trouble connecting right now. Check your internet connection.");
  if (status >= 500) return new ServerError("We're experiencing a server issue. Please try again.");
  return new UnknownError('Something went wrong. Please try again.');
}
