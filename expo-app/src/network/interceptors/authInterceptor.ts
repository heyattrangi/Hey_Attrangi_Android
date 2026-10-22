import { TokenManager } from '../../auth/TokenManager';
import { RequestInterceptor } from '../types';

/**
 * Auth Interceptor
 *
 * The backend (NextAuth/Auth.js v5, JWT session strategy) authenticates
 * purely via the session cookie decoded server-side — verified against the
 * live API, it has no bearer-token consumption path anywhere. What this app
 * stores as its "access token" is actually the raw session-token cookie
 * value captured from a NextAuth sign-in response (see AuthRepository);
 * replaying it as a Cookie header here is what makes a request
 * authenticated, not an Authorization header.
 */
export function createAuthInterceptor(tokens: TokenManager): RequestInterceptor {
  return async (config) => {
    if (config.skipAuth) return config;

    const token = await tokens.getAccessToken();
    if (token) {
      const headers: Record<string, string> = { ...config.headers };

      const cookieHeader = `authjs.session-token=${token}; next-auth.session-token=${token}; __Secure-authjs.session-token=${token}; __Secure-next-auth.session-token=${token}`;

      if (!headers.Cookie && !headers.cookie) {
        headers.Cookie = cookieHeader;
      }

      return {
        ...config,
        headers,
      };
    }

    return config;
  };
}
