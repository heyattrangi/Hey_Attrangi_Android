import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from '../types';

export const loggingRequestInterceptor: RequestInterceptor = (config) => {
  if (env.ENABLE_REQUEST_LOGGING || __DEV__) {
    logger.debug('[http:req]', config.method, config.path, {
      skipAuth: config.skipAuth,
    });
  }
  return config;
};

export const loggingResponseInterceptor: ResponseInterceptor = (response, config) => {
  if (env.ENABLE_REQUEST_LOGGING || __DEV__) {
    logger.debug('[http:res]', config.method, config.path, response.status);
  }
  return response;
};

export const loggingErrorInterceptor: ErrorInterceptor = (error, config) => {
  logger.warn('[http:err]', config.method, config.path, error.code, error.message);
  return error;
};
