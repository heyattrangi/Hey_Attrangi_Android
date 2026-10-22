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
  console.log(
    `[ENV_DEBUG] environment=${env.current} apiBaseUrl=${env.API_BASE_URL} mockEnabled=${env.USE_MOCK_SERVICES} productionBackend=https://app-heyattrangi.vercel.app`,
  );

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

  // NextAuth's JWT session strategy has no refresh-token endpoint (verified:
  // no /api/auth/refresh route exists on the backend) - a session cookie is
  // valid until it expires, and there is nothing to exchange it for. When
  // one does expire, the correct behavior is the same as on web: the next
  // authenticated call gets a 401 and the user has to sign in again. This
  // executor exists only to satisfy SessionManager's interface.
  sessionManager.setRefreshExecutor(async () => null);

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
