import { AppError } from '../../types/errors';
import {
  ErrorInterceptor,
  HttpRequestConfig,
  HttpResponse,
  InterceptorChain,
  RequestInterceptor,
  ResponseInterceptor,
} from '../types';

export function createInterceptorChain(
  partial?: Partial<InterceptorChain>,
): InterceptorChain {
  return {
    request: partial?.request ?? [],
    response: partial?.response ?? [],
    error: partial?.error ?? [],
  };
}

export async function runRequestInterceptors(
  config: HttpRequestConfig,
  interceptors: RequestInterceptor[],
): Promise<HttpRequestConfig> {
  let next = config;
  for (const interceptor of interceptors) {
    next = await interceptor(next);
  }
  return next;
}

export async function runResponseInterceptors<T>(
  response: HttpResponse<T>,
  config: HttpRequestConfig,
  interceptors: ResponseInterceptor[],
): Promise<HttpResponse<T>> {
  let next = response;
  for (const interceptor of interceptors) {
    next = await interceptor(next, config);
  }
  return next;
}

export async function runErrorInterceptors(
  error: AppError,
  config: HttpRequestConfig,
  interceptors: ErrorInterceptor[],
): Promise<AppError> {
  let next = error;
  for (const interceptor of interceptors) {
    next = await interceptor(next, config);
  }
  return next;
}
