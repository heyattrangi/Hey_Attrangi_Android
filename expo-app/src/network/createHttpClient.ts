import { env } from '../config/env';
import { tokenManager } from '../auth/TokenManager';
import { sessionManager } from '../auth/SessionManager';
import { FetchHttpClient } from './FetchHttpClient';
import { MockHttpAdapter } from './MockHttpAdapter';
import { registerMockRoutes } from './registerMockRoutes';
import { createAuthInterceptor } from './interceptors/authInterceptor';
import {
  loggingErrorInterceptor,
  loggingRequestInterceptor,
  loggingResponseInterceptor,
} from './interceptors/loggingInterceptor';
import { errorNormalizerInterceptor } from './interceptors/errorNormalizer';
import { withRefreshRetry } from './interceptors/refreshInterceptor';
import { HttpClient } from './types';

let singleton: HttpClient | null = null;

function isMockBaseUrl(url: string): boolean {
  return url.startsWith('mock://') || url === '' || url.includes('localhost-mock');
}

/**
 * Builds the shared HttpClient.
 *
 * Swap path:
 * 1. Keep repositories + Real*Service
 * 2. Set `env.API_BASE_URL` to your API host (not `mock://`)
 * 3. Set `env.USE_MOCK_SERVICES = false` in container
 */
export function createHttpClient(): HttpClient {
  const interceptors = {
    request: [loggingRequestInterceptor, createAuthInterceptor(tokenManager)],
    response: [loggingResponseInterceptor],
    error: [loggingErrorInterceptor, errorNormalizerInterceptor],
  };

  const base = isMockBaseUrl(env.API_BASE_URL)
    ? registerMockRoutes(new MockHttpAdapter(interceptors))
    : new FetchHttpClient({
        baseUrl: env.API_BASE_URL,
        interceptors,
      });

  // Register refresh executor once (uses raw client without refresh wrapper)
  sessionManager.setRefreshExecutor(async (refreshToken) => {
    const res = await base.post<{
      accessToken: string;
      refreshToken?: string;
    }>('/auth/refresh', { refreshToken }, { skipAuth: true, skipRefresh: true });
    return res.data;
  });

  return withRefreshRetry(base, sessionManager);
}

export function getHttpClient(): HttpClient {
  if (!singleton) {
    singleton = createHttpClient();
  }
  return singleton;
}

/** Test / hot-reload helper */
export function resetHttpClient(): void {
  singleton = null;
}
