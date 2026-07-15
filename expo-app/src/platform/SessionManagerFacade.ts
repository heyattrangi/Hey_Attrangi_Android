import { sessionManager, SessionSnapshot } from '../auth/SessionManager';
import { tokenManager } from '../auth/TokenManager';
import { useAuthStore } from '../store/authStore';
import { registerSessionExpiredHandler } from '../services/errors/globalErrorHandler';
import { analytics } from '../services/analytics/AnalyticsService';
import { logger } from '../utils/logger';
import { create } from 'zustand';

/**
 * Multi-device detection is placeholder until backend device sessions API.
 */
interface SessionPlatformState {
  loginRequired: boolean;
  multiDeviceDetected: boolean;
  lastRefreshAt: number | null;
  setLoginRequired: (v: boolean) => void;
  setMultiDeviceDetected: (v: boolean) => void;
}

export const useSessionPlatformStore = create<SessionPlatformState>((set) => ({
  loginRequired: false,
  multiDeviceDetected: false,
  lastRefreshAt: null,
  setLoginRequired: (v) => set({ loginRequired: v }),
  setMultiDeviceDetected: (v) => set({ multiDeviceDetected: v }),
}));

/**
 * Session Manager facade for app-wide session UX.
 * Wraps SessionManager + authStore — no backend yet.
 */
export const SessionManagerFacade = {
  async snapshot(): Promise<SessionSnapshot> {
    return sessionManager.getSnapshot();
  },

  async refresh(): Promise<boolean> {
    const ok = await sessionManager.refreshSession();
    if (ok) {
      useSessionPlatformStore.setState({ lastRefreshAt: Date.now() });
    }
    return ok;
  },

  async logout(): Promise<void> {
    await useAuthStore.getState().logout();
    analytics.track('auth_sign_out');
    useSessionPlatformStore.getState().setLoginRequired(false);
  },

  requireLogin(): void {
    useSessionPlatformStore.getState().setLoginRequired(true);
    logger.info('[Session] Login required');
  },

  clearLoginRequired(): void {
    useSessionPlatformStore.getState().setLoginRequired(false);
  },

  /**
   * Future: compare device session list from API.
   * Frontend placeholder — QA can flip this.
   */
  markMultiDevice(detected: boolean): void {
    useSessionPlatformStore.getState().setMultiDeviceDetected(detected);
  },

  wireSessionExpired(onExpired: () => void): void {
    sessionManager.setSessionExpiredHandler(() => {
      useSessionPlatformStore.getState().setLoginRequired(true);
      onExpired();
    });
    registerSessionExpiredHandler(() => {
      useSessionPlatformStore.getState().setLoginRequired(true);
      onExpired();
    });
  },

  async hasStoredTokens(): Promise<boolean> {
    await tokenManager.hydrate();
    const access = await tokenManager.getAccessToken();
    return Boolean(access);
  },
};
