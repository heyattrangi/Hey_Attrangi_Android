import { ApiResponse } from '../types/api';
import { AppError, UnknownError, toAppError } from '../types/errors';

/**
 * Legacy token helpers + mock utilities.
 * Prefer `auth/TokenManager` for new code — TokenManager keeps this in sync.
 */
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const normalizeServiceError = (error: unknown): AppError => toAppError(error);

const MOCK_DELAY_MS = 400;

export const mockDelay = <T>(value: T, ms = MOCK_DELAY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const failureResponse = <T>(
  error: AppError,
): Promise<{ success: false; data: T; error: AppError }> =>
  Promise.resolve({ success: false as const, data: null as T, error });

// Keep UnknownError import used for callers expecting prior shape
export { UnknownError };
