import { env } from '../config/env';
import { memoryCache } from '../cache';
import {
  NetworkError,
  NetworkTimeoutError,
  RateLimitError,
  toAppError,
} from '../types/errors';
import {
  createInterceptorChain,
  runErrorInterceptors,
  runRequestInterceptors,
  runResponseInterceptors,
} from './interceptors/composeInterceptors';
import { httpStatusToError } from './interceptors/errorNormalizer';
import {
  HttpClient,
  HttpRequestConfig,
  HttpResponse,
  InterceptorChain,
} from './types';

function buildUrl(
  baseUrl: string,
  path: string,
  query?: HttpRequestConfig['query'],
): string {
  const base = baseUrl.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${normalized}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

function cacheKeyFor(config: HttpRequestConfig): string | null {
  if (config.cacheKey === null) return null;
  if (config.method !== 'GET') return null;
  if (config.cacheKey) return config.cacheKey;
  const q = config.query
    ? JSON.stringify(config.query)
    : '';
  return `GET:${config.path}:${q}`;
}

export interface FetchHttpClientOptions {
  baseUrl?: string;
  interceptors?: Partial<InterceptorChain>;
  defaultTimeoutMs?: number;
}

/**
 * Production-ready fetch HttpClient.
 * Not used while `API_BASE_URL` is `mock://` — see MockHttpAdapter.
 */
export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly interceptors: InterceptorChain;
  private readonly defaultTimeoutMs: number;

  constructor(options: FetchHttpClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? env.API_BASE_URL;
    this.interceptors = createInterceptorChain(options.interceptors);
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? env.API_TIMEOUT_MS;
  }

  async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const prepared = await runRequestInterceptors(config, this.interceptors.request);

    const key = cacheKeyFor(prepared);
    if (key && (prepared.cacheTtlMs ?? 0) > 0) {
      const cached = memoryCache.get<HttpResponse<T>>(key);
      if (cached) return cached;
    }

    const controller = new AbortController();
    const timeout = prepared.timeoutMs ?? this.defaultTimeoutMs;
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const url = buildUrl(this.baseUrl, prepared.path, prepared.query);
      if (prepared.path.includes('/auth') || prepared.path.includes('/onboarding')) {
        console.log(`[COOKIE-TRANSPORT] endpoint=${prepared.path} credentialsInclude=true`);
      }
      const isFormData =
        prepared.body != null &&
        ((typeof FormData !== 'undefined' && prepared.body instanceof FormData) ||
          typeof (prepared.body as { append?: unknown }).append === 'function' ||
          Object.prototype.toString.call(prepared.body) === '[object FormData]');
      const requestHeaders: Record<string, string> = {
        Accept: 'application/json',
        ...prepared.headers,
      };
      if (!isFormData && !requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: prepared.method,
        credentials: 'include',
        redirect: prepared.redirect ?? 'follow',
        headers: requestHeaders,
        body: isFormData
          ? (prepared.body as FormData)
          : prepared.body === undefined
          ? undefined
          : JSON.stringify(prepared.body),
        signal: prepared.signal ?? controller.signal,
      });

      const text = await response.text();
      let data: unknown = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      const isAccepted =
        response.ok || (prepared.acceptStatuses?.includes(response.status) ?? false);
      if (!isAccepted) {
        const message =
          typeof data === 'object' && data
            ? (data as any).message || (data as any).error || (data as any).detail || (data as any).code || (data as any).msg
            : typeof data === 'string'
            ? data
            : undefined;

        const resetInSeconds =
          typeof data === 'object' && data && typeof (data as any).resetInSeconds === 'number'
            ? (data as any).resetInSeconds
            : undefined;

        const requiresLogin =
          typeof data === 'object' && data ? Boolean((data as any).requiresLogin) : false;

        const lowerMsg = typeof message === 'string' ? message.toLowerCase() : '';
        const isLimitError =
          response.status === 427 ||
          response.status === 429 ||
          requiresLogin ||
          lowerMsg.includes('limit') ||
          lowerMsg.includes('quota') ||
          lowerMsg.includes('exceeded') ||
          lowerMsg.includes('too many') ||
          lowerMsg.includes('requireslogin');

        if (isLimitError) {
          throw new RateLimitError(
            typeof message === 'string' && message.length > 0
              ? message
              : 'Usage limit reached. Upgrade to Premium for higher limits.',
            resetInSeconds,
          );
        }

        throw httpStatusToError(
          response.status,
          typeof message === 'string' ? message : undefined,
          resetInSeconds,
        );
      }

      const headers: Record<string, string> = {};
      response.headers.forEach((value, name) => {
        headers[name] = value;
      });

      let httpResponse: HttpResponse<T> = {
        data: data as T,
        status: response.status,
        headers,
      };

      httpResponse = await runResponseInterceptors(
        httpResponse,
        prepared,
        this.interceptors.response,
      );

      if (key && (prepared.cacheTtlMs ?? 0) > 0) {
        memoryCache.set(key, httpResponse, prepared.cacheTtlMs!);
      }

      return httpResponse;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new NetworkTimeoutError();
        throw await runErrorInterceptors(
          timeoutError,
          prepared,
          this.interceptors.error,
        );
      }
      const appError =
        error instanceof NetworkError || error instanceof NetworkTimeoutError
          ? error
          : toAppError(error);
      throw await runErrorInterceptors(appError, prepared, this.interceptors.error);
    } finally {
      clearTimeout(timer);
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
