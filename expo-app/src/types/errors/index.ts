export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'NETWORK_TIMEOUT'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'PERMISSION_DENIED'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly statusCode?: number;
  readonly details?: Record<string, string>;
  readonly retryable: boolean;

  constructor(
    code: AppErrorCode,
    message: string,
    options?: {
      statusCode?: number;
      details?: Record<string, string>;
      retryable?: boolean;
    },
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = options?.statusCode;
    this.details = options?.details;
    this.retryable = options?.retryable ?? false;
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
    if (msg.includes('permission') || msg.includes('denied')) {
      return new PermissionDeniedError(error.message);
    }
    return new UnknownError(error.message);
  }
  return new UnknownError();
}
