import { TokenManager } from '../../auth/TokenManager';
import { RequestInterceptor } from '../types';

/** Attaches Bearer access token unless skipAuth */
export function createAuthInterceptor(tokens: TokenManager): RequestInterceptor {
  return async (config) => {
    if (config.skipAuth) return config;
    const access = await tokens.getAccessToken();
    if (!access) return config;
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${access}`,
      },
    };
  };
}
