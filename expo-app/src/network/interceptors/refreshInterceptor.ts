import { UnauthorizedError } from '../../types/errors';
import { SessionManager } from '../../auth/SessionManager';
import { HttpClient, HttpRequestConfig, HttpResponse } from '../types';

/**
 * On 401, attempt one refresh + retry.
 * Wired as a client-level wrapper (not a pure response interceptor)
 * so it can re-issue the original request.
 */
export function withRefreshRetry(
  client: HttpClient,
  sessions: SessionManager,
): HttpClient {
  const wrap = async <T>(
    config: HttpRequestConfig,
    exec: () => Promise<HttpResponse<T>>,
  ): Promise<HttpResponse<T>> => {
    try {
      return await exec();
    } catch (error) {
      if (
        !(error instanceof UnauthorizedError) ||
        config.skipAuth ||
        config.skipRefresh
      ) {
        throw error;
      }
      const refreshed = await sessions.refreshSession();
      if (!refreshed) throw error;
      return exec();
    }
  };

  return {
    request: (config) =>
      wrap(config, () => client.request(config)),
    get: (path, config) =>
      wrap(
        { method: 'GET', path, ...config },
        () => client.get(path, config),
      ),
    post: (path, body, config) =>
      wrap(
        { method: 'POST', path, body, ...config },
        () => client.post(path, body, config),
      ),
    patch: (path, body, config) =>
      wrap(
        { method: 'PATCH', path, body, ...config },
        () => client.patch(path, body, config),
      ),
    put: (path, body, config) =>
      wrap(
        { method: 'PUT', path, body, ...config },
        () => client.put(path, body, config),
      ),
    delete: (path, config) =>
      wrap(
        { method: 'DELETE', path, ...config },
        () => client.delete(path, config),
      ),
  };
}
