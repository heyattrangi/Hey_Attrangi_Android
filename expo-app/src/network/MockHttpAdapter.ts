import { mockDelay } from '../api/client';
import {
  createInterceptorChain,
  runErrorInterceptors,
  runRequestInterceptors,
  runResponseInterceptors,
} from './interceptors/composeInterceptors';
import { httpStatusToError } from './interceptors/errorNormalizer';
import {
  HttpClient,
  HttpMethod,
  HttpRequestConfig,
  HttpResponse,
  InterceptorChain,
} from './types';
import { UnknownError, toAppError } from '../types/errors';
import { memoryCache } from '../cache';

export type MockRouteHandler = (
  config: HttpRequestConfig,
) => Promise<{ status?: number; data: unknown } | unknown>;

type RouteKey = `${HttpMethod} ${string}`;

/**
 * In-process HTTP adapter for `mock://` base URLs.
 * Register handlers that return DTO shapes — repositories stay identical
 * when swapping to a real FetchHttpClient.
 */
export class MockHttpAdapter implements HttpClient {
  private routes = new Map<RouteKey, MockRouteHandler>();
  private readonly interceptors: InterceptorChain;

  constructor(interceptors?: Partial<InterceptorChain>) {
    this.interceptors = createInterceptorChain(interceptors);
  }

  on(method: HttpMethod, path: string, handler: MockRouteHandler): this {
    this.routes.set(`${method} ${path}`, handler);
    return this;
  }

  /** Match exact path or `:param` segments */
  private resolve(
    method: HttpMethod,
    path: string,
  ): { handler: MockRouteHandler; params: Record<string, string> } | null {
    const exact = this.routes.get(`${method} ${path}`);
    if (exact) return { handler: exact, params: {} };

    for (const [key, handler] of this.routes.entries()) {
      const [m, pattern] = key.split(' ');
      if (m !== method) continue;
      const params = matchPath(pattern, path);
      if (params) return { handler, params };
    }
    return null;
  }

  async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const prepared = await runRequestInterceptors(config, this.interceptors.request);

    const key =
      prepared.method === 'GET' && prepared.cacheKey !== null
        ? prepared.cacheKey ?? `GET:${prepared.path}`
        : null;
    if (key && (prepared.cacheTtlMs ?? 0) > 0) {
      const cached = memoryCache.get<HttpResponse<T>>(key);
      if (cached) return cached;
    }

    const matched = this.resolve(prepared.method, prepared.path);
    if (!matched) {
      const err = new UnknownError(
        `Mock route not registered: ${prepared.method} ${prepared.path}`,
      );
      throw await runErrorInterceptors(err, prepared, this.interceptors.error);
    }

    try {
      const raw = await mockDelay(
        await matched.handler({
          ...prepared,
          // expose path params for handlers that need them
          headers: {
            ...prepared.headers,
            'x-mock-params': JSON.stringify(matched.params),
          },
        }),
      );

      const status =
        raw &&
        typeof raw === 'object' &&
        'status' in raw &&
        typeof (raw as { status: unknown }).status === 'number'
          ? (raw as { status: number }).status
          : 200;
      const data =
        raw &&
        typeof raw === 'object' &&
        'data' in raw &&
        'status' in raw
          ? (raw as { data: unknown }).data
          : raw;

      if (status >= 400) {
        throw httpStatusToError(status);
      }

      let response: HttpResponse<T> = {
        data: data as T,
        status,
        headers: { 'x-mock': '1' },
      };
      response = await runResponseInterceptors(
        response,
        prepared,
        this.interceptors.response,
      );

      if (key && (prepared.cacheTtlMs ?? 0) > 0) {
        memoryCache.set(key, response, prepared.cacheTtlMs!);
      }
      return response;
    } catch (error) {
      throw await runErrorInterceptors(
        toAppError(error),
        prepared,
        this.interceptors.error,
      );
    }
  }

  get<T>(path: string, config?: Omit<HttpRequestConfig, 'method' | 'path'>) {
    return this.request<T>({ ...config, method: 'GET', path });
  }

  post<T>(
    path: string,
    body?: unknown,
    config?: Omit<HttpRequestConfig, 'method' | 'path' | 'body'>,
  ) {
    return this.request<T>({ ...config, method: 'POST', path, body });
  }

  patch<T>(
    path: string,
    body?: unknown,
    config?: Omit<HttpRequestConfig, 'method' | 'path' | 'body'>,
  ) {
    return this.request<T>({ ...config, method: 'PATCH', path, body });
  }

  put<T>(
    path: string,
    body?: unknown,
    config?: Omit<HttpRequestConfig, 'method' | 'path' | 'body'>,
  ) {
    return this.request<T>({ ...config, method: 'PUT', path, body });
  }

  delete<T>(path: string, config?: Omit<HttpRequestConfig, 'method' | 'path'>) {
    return this.request<T>({ ...config, method: 'DELETE', path });
  }
}

function matchPath(
  pattern: string,
  path: string,
): Record<string, string> | null {
  const pp = pattern.split('/').filter(Boolean);
  const tp = path.split('/').filter(Boolean);
  if (pp.length !== tp.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i += 1) {
    if (pp[i].startsWith(':')) {
      params[pp[i].slice(1)] = decodeURIComponent(tp[i]);
    } else if (pp[i] !== tp[i]) {
      return null;
    }
  }
  return params;
}
