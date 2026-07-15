import { setAuthToken, getAuthToken } from '../api/client';
import {
  clearAllTokensSecure,
  getAuthTokenSecure,
  getRefreshTokenSecure,
  saveAuthTokenSecure,
  saveRefreshTokenSecure,
} from '../persistence/tokenStorage';

export interface TokenPair {
  accessToken: string;
  refreshToken?: string | null;
}

/**
 * Single source of truth for access + refresh tokens.
 * Keeps in-memory `api/client` token in sync for legacy callers.
 */
export class TokenManager {
  private accessMemory: string | null = null;
  private refreshMemory: string | null = null;
  private hydrated = false;

  async hydrate(): Promise<void> {
    if (this.hydrated) return;
    const [access, refresh] = await Promise.all([
      getAuthTokenSecure(),
      getRefreshTokenSecure(),
    ]);
    this.accessMemory = access;
    this.refreshMemory = refresh;
    setAuthToken(access);
    this.hydrated = true;
  }

  async getAccessToken(): Promise<string | null> {
    await this.hydrate();
    return this.accessMemory ?? getAuthToken();
  }

  async getRefreshToken(): Promise<string | null> {
    await this.hydrate();
    return this.refreshMemory;
  }

  async setTokens(pair: TokenPair): Promise<void> {
    this.accessMemory = pair.accessToken;
    this.refreshMemory = pair.refreshToken ?? this.refreshMemory;
    setAuthToken(pair.accessToken);
    await saveAuthTokenSecure(pair.accessToken);
    if (pair.refreshToken) {
      await saveRefreshTokenSecure(pair.refreshToken);
    }
    this.hydrated = true;
  }

  async setAccessToken(token: string | null): Promise<void> {
    this.accessMemory = token;
    setAuthToken(token);
    if (token) {
      await saveAuthTokenSecure(token);
    } else {
      await clearAllTokensSecure();
      this.refreshMemory = null;
    }
  }

  async clear(): Promise<void> {
    this.accessMemory = null;
    this.refreshMemory = null;
    setAuthToken(null);
    await clearAllTokensSecure();
    this.hydrated = true;
  }

  hasAccessToken(): boolean {
    return Boolean(this.accessMemory ?? getAuthToken());
  }
}

export const tokenManager = new TokenManager();
