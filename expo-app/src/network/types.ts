import { AppError } from '../types/errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestConfig {
  method: HttpMethod;
  /** Path relative to base URL, e.g. `/auth/login` */
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  /** Skip Authorization header */
  skipAuth?: boolean;
  /** Skip refresh-on-401 retry */
  skipRefresh?: boolean;
  timeoutMs?: number;
  /** Cache key override; null disables cache for this call */
  cacheKey?: string | null;
  cacheTtlMs?: number;
  signal?: AbortSignal;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface HttpClient {
  request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
  get<T>(path: string, config?: Omit<HttpRequestConfig, 'method' | 'path'>): Promise<HttpResponse<T>>;
  post<T>(
    path: string,
    body?: unknown,
    config?: Omit<HttpRequestConfig, 'method' | 'path' | 'body'>,
  ): Promise<HttpResponse<T>>;
  patch<T>(
    path: string,
    body?: unknown,
    config?: Omit<HttpRequestConfig, 'method' | 'path' | 'body'>,
  ): Promise<HttpResponse<T>>;
  put<T>(
    path: string,
    body?: unknown,
    config?: Omit<HttpRequestConfig, 'method' | 'path' | 'body'>,
  ): Promise<HttpResponse<T>>;
  delete<T>(
    path: string,
    config?: Omit<HttpRequestConfig, 'method' | 'path'>,
  ): Promise<HttpResponse<T>>;
}

export type RequestInterceptor = (
  config: HttpRequestConfig,
) => HttpRequestConfig | Promise<HttpRequestConfig>;

export type ResponseInterceptor = <T>(
  response: HttpResponse<T>,
  config: HttpRequestConfig,
) => HttpResponse<T> | Promise<HttpResponse<T>>;

export type ErrorInterceptor = (
  error: AppError,
  config: HttpRequestConfig,
) => AppError | Promise<AppError>;

export interface InterceptorChain {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
  error: ErrorInterceptor[];
}
