/**
 * Environment configuration for the Expo frontend.
 * All backend URLs are placeholders — services use local mocks by default.
 */
import { DEFAULT_FEATURE_FLAGS } from './featureFlags';

export type AppEnvironment = 'development' | 'staging' | 'production' | 'mock';

/**
 * Resolve environment:
 * 1. Explicit EXPO_PUBLIC_APP_ENV when present
 * 2. `mock` when USE_MOCK defaults (dev tooling)
 * 3. __DEV__ → development else production
 */
function resolveEnv(): AppEnvironment {
  const fromPublic =
    typeof process !== 'undefined' &&
    process.env?.EXPO_PUBLIC_APP_ENV?.toLowerCase();
  if (
    fromPublic === 'development' ||
    fromPublic === 'staging' ||
    fromPublic === 'production' ||
    fromPublic === 'mock'
  ) {
    return fromPublic;
  }
  if (__DEV__) return 'mock';
  return 'production';
}

const ENV: AppEnvironment = resolveEnv();

type EnvShape = {
  API_BASE_URL: string;
  IMAGE_BASE_URL: string;
  SOCKET_URL: string;
  AGORA_APP_ID: string;
  AGORA_APP_CERTIFICATE: string;
  ENABLE_REQUEST_LOGGING: boolean;
  ENABLE_DEBUG_LOGS: boolean;
  GOOGLE_CLIENT_ID: string;
  MIN_SUPPORTED_VERSION: string;
  LATEST_VERSION: string;
  STORE_URL_IOS: string;
  STORE_URL_ANDROID: string;
};

const ENV_CONFIG: Record<AppEnvironment, EnvShape> = {
  mock: {
    API_BASE_URL: 'mock://local',
    IMAGE_BASE_URL: '',
    SOCKET_URL: '',
    AGORA_APP_ID: '',
    AGORA_APP_CERTIFICATE: '',
    ENABLE_REQUEST_LOGGING: true,
    ENABLE_DEBUG_LOGS: true,
    GOOGLE_CLIENT_ID: '',
    MIN_SUPPORTED_VERSION: '1.0.0',
    LATEST_VERSION: '1.0.0',
    STORE_URL_IOS: '',
    STORE_URL_ANDROID: '',
  },
  development: {
    API_BASE_URL: 'https://dev-api.heyattrangi.app', // future
    IMAGE_BASE_URL: '',
    SOCKET_URL: '',
    AGORA_APP_ID: '',
    AGORA_APP_CERTIFICATE: '',
    ENABLE_REQUEST_LOGGING: true,
    ENABLE_DEBUG_LOGS: true,
    GOOGLE_CLIENT_ID: '',
    MIN_SUPPORTED_VERSION: '1.0.0',
    LATEST_VERSION: '1.0.0',
    STORE_URL_IOS: '',
    STORE_URL_ANDROID: '',
  },
  staging: {
    API_BASE_URL: 'https://staging-api.heyattrangi.app', // future
    IMAGE_BASE_URL: '',
    SOCKET_URL: '',
    AGORA_APP_ID: '',
    AGORA_APP_CERTIFICATE: '',
    ENABLE_REQUEST_LOGGING: true,
    ENABLE_DEBUG_LOGS: false,
    GOOGLE_CLIENT_ID: '',
    MIN_SUPPORTED_VERSION: '1.0.0',
    LATEST_VERSION: '1.0.0',
    STORE_URL_IOS: '',
    STORE_URL_ANDROID: '',
  },
  production: {
    API_BASE_URL: 'https://api.heyattrangi.app', // future
    IMAGE_BASE_URL: '',
    SOCKET_URL: '',
    AGORA_APP_ID: '',
    AGORA_APP_CERTIFICATE: '',
    ENABLE_REQUEST_LOGGING: false,
    ENABLE_DEBUG_LOGS: false,
    GOOGLE_CLIENT_ID: '',
    MIN_SUPPORTED_VERSION: '1.0.0',
    LATEST_VERSION: '1.0.0',
    STORE_URL_IOS: '',
    STORE_URL_ANDROID: '',
  },
};

const active = ENV_CONFIG[ENV];

export const env = {
  current: ENV,
  ...active,
  API_TIMEOUT_MS: 30000,
  /**
   * Data source switches (container reads these).
   * Stay mock-on by default. Set EXPO_PUBLIC_USE_MOCK=false when real APIs are ready.
   */
  USE_MOCK_NON_AUTH_MODULES: process.env?.EXPO_PUBLIC_USE_MOCK !== 'false',
  USE_MOCK_SERVICES: process.env?.EXPO_PUBLIC_USE_MOCK !== 'false',
  DEEP_LINK_SCHEME: 'heyattrangi',
  DEEP_LINK_PREFIXES: ['heyattrangi://', 'https://heyattrangi.app'] as const,
  SUPPORT_EMAIL: 'care@heyattrangi.app',
  SUPPORT_URL: 'https://heyattrangi.app/help',
  /** Hosted legal — replace with counsel-approved URLs before public store */
  PRIVACY_POLICY_URL:
    process.env?.EXPO_PUBLIC_PRIVACY_URL ?? 'https://heyattrangi.app/privacy',
  TERMS_OF_SERVICE_URL:
    process.env?.EXPO_PUBLIC_TERMS_URL ?? 'https://heyattrangi.app/terms',
  STORE_URL_IOS:
    process.env?.EXPO_PUBLIC_STORE_URL_IOS ??
    'https://apps.apple.com/app/hey-attrangi/id0000000000',
  STORE_URL_ANDROID:
    process.env?.EXPO_PUBLIC_STORE_URL_ANDROID ??
    'https://play.google.com/store/apps/details?id=com.heyaatrangi.expo',
};

/** @deprecated Import from `config/featureFlags` */
export const featureFlags = DEFAULT_FEATURE_FLAGS;
