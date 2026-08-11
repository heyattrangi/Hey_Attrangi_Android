import * as SecureStore from 'expo-secure-store';

const GUEST_TOKEN_KEY = 'pragya_guest_token';

export class GuestTokenManager {
  private memoryToken: string | null = null;

  async getGuestToken(): Promise<string | null> {
    if (this.memoryToken) return this.memoryToken;
    try {
      const stored = await SecureStore.getItemAsync(GUEST_TOKEN_KEY);
      if (stored) {
        this.memoryToken = stored;
        return stored;
      }
    } catch {
      // SecureStore error fallback to memory
    }
    return null;
  }

  async setGuestToken(token: string): Promise<void> {
    this.memoryToken = token;
    try {
      await SecureStore.setItemAsync(GUEST_TOKEN_KEY, token);
    } catch {
      // Best-effort
    }
  }

  async clearGuestToken(): Promise<void> {
    this.memoryToken = null;
    try {
      await SecureStore.deleteItemAsync(GUEST_TOKEN_KEY);
    } catch {
      // Best-effort
    }
  }
}

export const guestTokenManager = new GuestTokenManager();
