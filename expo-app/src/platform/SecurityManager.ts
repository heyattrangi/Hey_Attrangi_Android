import * as SecureStore from 'expo-secure-store';
import { tokenManager } from '../auth/TokenManager';
import { usePreferencesStore } from '../store/preferencesStore';
import { useAppConfigStore } from '../store/appConfigStore';
import { logger } from '../utils/logger';

/**
 * Security preparation — token + biometric preference surfaces.
 * Device biometrics APIs (expo-local-authentication) wire later.
 */
export const SecurityManager = {
  async storeSecret(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async readSecret(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },

  async clearSecret(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  async clearSessionTokens(): Promise<void> {
    await tokenManager.clear();
  },

  isBiometricPreferred(): boolean {
    return (
      useAppConfigStore.getState().isFlagEnabled('enableBiometricLogin') &&
      usePreferencesStore.getState().biometricLoginEnabled
    );
  },

  /**
   * Soft session timeout placeholder (ms). Backend/token TTL will own this later.
   */
  sessionTimeoutMs: 1000 * 60 * 60 * 12,

  logSecurityEvent(event: string, detail?: Record<string, unknown>): void {
    logger.info('[Security]', event, detail);
  },
};
