/**
 * Runtime overrides for Sprint 23 DX tools.
 * Kept module-level so `container` can read without Zustand circular deps.
 * Preferences persist via `devToolsStore` which syncs here on boot/toggle.
 */
import { env, AppEnvironment } from './env';

let mockServicesOverride: boolean | null = null;
let preferredEnvOverride: AppEnvironment | null = null;
// Defaults to true (bypass disabled) so real auth/onboarding always controls
// navigation, including in dev builds. The instant-MainTabs shortcut in
// bootstrapAuthSession() only exists for quick UI iteration on screens deep
// in the app; flip this via Dev Tools -> Environment when you explicitly
// want that shortcut. It can never affect release builds (gated on __DEV__,
// stripped at build time), and must stay `true` here for real E2E validation.
let forceRealAuthFlowOverride = true;

/**
 * When true, RootNavigator ignores the __DEV__ MainTabs shortcut and routes
 * purely off real auth/onboarding state, even in a dev build. Exists so the
 * production auth/onboarding path can actually be exercised and verified
 * during development instead of always being masked by the dev bypass.
 */
export function getForceRealAuthFlowOverride(): boolean {
  return forceRealAuthFlowOverride;
}

export function setForceRealAuthFlowOverride(value: boolean): void {
  forceRealAuthFlowOverride = value;
}

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
  return env.USE_MOCK_SERVICES;
}

export function getEffectiveAppEnv(): AppEnvironment {
  return preferredEnvOverride ?? env.current;
}

const ENV_URLS: Record<AppEnvironment, string> = {
  mock: 'mock://local',
  development: process.env?.EXPO_PUBLIC_API_BASE_URL ?? 'https://dev-api.heyattrangi.app',
  staging: process.env?.EXPO_PUBLIC_API_BASE_URL ?? 'https://staging-api.heyattrangi.app',
  production: process.env?.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.heyattrangi.app',
};

export function getEffectiveApiBaseUrl(): string {
  if (preferredEnvOverride) return ENV_URLS[preferredEnvOverride];
  return env.API_BASE_URL;
}
