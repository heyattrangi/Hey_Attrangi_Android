export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'NETWORK_TIMEOUT'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'PERMISSION_DENIED'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly statusCode?: number;
  readonly details?: Record<string, string>;
  readonly retryable: boolean;
  readonly resetInSeconds?: number;

  constructor(
    code: AppErrorCode,
    message: string,
    options?: {
      statusCode?: number;
      details?: Record<string, string>;
      retryable?: boolean;
      resetInSeconds?: number;
    },
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = options?.statusCode;
    this.details = options?.details;
    this.retryable = options?.retryable ?? false;
    this.resetInSeconds = options?.resetInSeconds;
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Usage limit exceeded. Upgrade to Premium for higher limits.', resetInSeconds?: number) {
    super('RATE_LIMIT', message, { statusCode: 429, retryable: false, resetInSeconds });
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed. Please check your connection.') {
    super('NETWORK_ERROR', message, { retryable: true });
    this.name = 'NetworkError';
  }
}

export class NetworkTimeoutError extends AppError {
  constructor(message = 'The request timed out. Please try again.') {
    super('NETWORK_TIMEOUT', message, { retryable: true, statusCode: 408 });
    this.name = 'NetworkTimeoutError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: Record<string, string>) {
    super('VALIDATION_ERROR', message, { details, retryable: false });
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Your session has expired. Please sign in again.') {
    super('UNAUTHORIZED', message, { statusCode: 401, retryable: false });
    this.name = 'UnauthorizedError';
  }
}

export class PermissionDeniedError extends AppError {
  constructor(message = 'Permission denied. Enable access in Settings to continue.') {
    super('PERMISSION_DENIED', message, { statusCode: 403, retryable: false });
    this.name = 'PermissionDeniedError';
  }
}

export class ServerError extends AppError {
  constructor(message = 'Server internal error. Please try again later.') {
    super('SERVER_ERROR', message, { statusCode: 500, retryable: true });
    this.name = 'ServerError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Pragya is temporarily unavailable. Please try again.') {
    super('SERVICE_UNAVAILABLE', message, { statusCode: 503, retryable: true });
    this.name = 'ServiceUnavailableError';
  }
}

export class UnknownError extends AppError {
  constructor(message = 'Something went wrong. Please try again.') {
    super('UNKNOWN', message, { retryable: true });
    this.name = 'UnknownError';
  }
}

/** Normalize unknown thrown values into AppError */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return new NetworkTimeoutError(error.message);
    }
    if (msg.includes('network') || msg.includes('offline') || msg.includes('fetch')) {
      return new NetworkError(error.message);
    }
    if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('session')) {
      return new UnauthorizedError(error.message);
    }
    if (msg.includes('429') || msg.includes('427') || msg.includes('limit_exceeded') || msg.includes('rate limit') || msg.includes('too many')) {
      return new RateLimitError(error.message);
    }
    if (msg.includes('permission') || msg.includes('denied')) {
      return new PermissionDeniedError(error.message);
    }
    return new UnknownError(error.message);
  }
  return new UnknownError();
}

/** Converts any error into a clean, sanitized, user-friendly string (NEVER exposing status codes or raw tech exceptions) */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const appErr = toAppError(error);

  switch (appErr.code) {
    case 'RATE_LIMIT':
      return "You've reached your limit. Upgrade to Premium to continue.";
    case 'UNAUTHORIZED':
      return 'Your session has expired. Please sign in again.';
    case 'PERMISSION_DENIED':
      return 'Permission denied. Please check your app settings to continue.';
    case 'NETWORK_ERROR':
    case 'NETWORK_TIMEOUT':
      return "We're having trouble connecting right now. Please check your internet connection and try again.";
    case 'SERVER_ERROR':
    case 'SERVICE_UNAVAILABLE':
      return "We're experiencing a temporary server issue. Please try again in a moment.";
    case 'VALIDATION_ERROR':
      if (appErr.message && !appErr.message.includes('HTTP') && !appErr.message.includes('422') && !appErr.message.includes('400') && !appErr.message.includes('Request failed')) {
        return appErr.message;
      }
      return 'Please check the information you entered and try again.';
    case 'UNKNOWN':
    default:
      if (appErr.message && !appErr.message.includes('HTTP') && !appErr.message.includes('status') && !appErr.message.includes('Request failed') && !appErr.message.includes('Axios') && !appErr.message.includes('UNKNOWN')) {
        return appErr.message;
      }
      return 'Something went wrong. Please try again.';
  }
}
