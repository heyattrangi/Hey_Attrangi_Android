/**
 * Runtime overrides for Sprint 23 DX tools.
 * Kept module-level so `container` can read without Zustand circular deps.
 * Preferences persist via `devToolsStore` which syncs here on boot/toggle.
 */
import { env, AppEnvironment } from './env';

let mockServicesOverride: boolean | null = null;
let preferredEnvOverride: AppEnvironment | null = null;

export function getMockServicesOverride(): boolean | null {
  return mockServicesOverride;
}

export function setMockServicesOverride(value: boolean | null): void {
  mockServicesOverride = value;
}

export function getPreferredEnvOverride(): AppEnvironment | null {
  return preferredEnvOverride;
}

export function setPreferredEnvOverride(value: AppEnvironment | null): void {
  preferredEnvOverride = value;
}

/** Effective mock flag: runtime override → build-time env */
export function getEffectiveUseMockServices(): boolean {
  if (mockServicesOverride !== null) return mockServicesOverride;
  return env.USE_MOCK_SERVICES;
}

export function getEffectiveUseMockNonAuth(): boolean {
  if (mockServicesOverride !== null) return mockServicesOverride;
  return env.USE_MOCK_SERVICES || env.USE_MOCK_NON_AUTH_MODULES;
}

export function getEffectiveAppEnv(): AppEnvironment {
  return preferredEnvOverride ?? env.current;
}

const ENV_URLS: Record<AppEnvironment, string> = {
  mock: 'mock://local',
  development: 'https://dev-api.heyattrangi.app',
  staging: 'https://staging-api.heyattrangi.app',
  production: 'https://api.heyattrangi.app',
};

export function getEffectiveApiBaseUrl(): string {
  if (preferredEnvOverride) return ENV_URLS[preferredEnvOverride];
  return env.API_BASE_URL;
}
