import { env } from '../config/env';
import { logger } from '../utils/logger';
import { UnauthorizedError } from '../types/errors';
import { TokenManager, tokenManager } from './TokenManager';

export interface SessionSnapshot {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

type RefreshExecutor = (refreshToken: string) => Promise<{
  accessToken: string;
  refreshToken?: string | null;
} | null>;

/**
 * Owns session lifecycle + refresh-token flow.
 * Refresh executor is injected so network layer can avoid circular imports.
 */
export class SessionManager {
  private refreshing: Promise<boolean> | null = null;
  private refreshExecutor: RefreshExecutor | null = null;
  private onSessionExpired: (() => void) | null = null;

  constructor(private readonly tokens: TokenManager = tokenManager) {}

  setRefreshExecutor(executor: RefreshExecutor): void {
    this.refreshExecutor = executor;
  }

  setSessionExpiredHandler(handler: () => void): void {
    this.onSessionExpired = handler;
  }

  async getSnapshot(): Promise<SessionSnapshot> {
    await this.tokens.hydrate();
    const accessToken = await this.tokens.getAccessToken();
    const refreshToken = await this.tokens.getRefreshToken();
    return {
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
    };
  }

  async establish(accessToken: string, refreshToken?: string | null): Promise<void> {
    await this.tokens.setTokens({ accessToken, refreshToken });
  }

  async clear(): Promise<void> {
    await this.tokens.clear();
  }

  /**
   * Attempts refresh. Returns true if a new access token was stored.
   * Deduplicates concurrent 401s into a single refresh call.
   */
  async refreshSession(): Promise<boolean> {
    if (this.refreshing) return this.refreshing;

    this.refreshing = (async () => {
      try {
        const refresh = await this.tokens.getRefreshToken();
        if (!refresh) {
          logger.debug('[session] No refresh token — cannot refresh');
          this.onSessionExpired?.();
          return false;
        }
        if (!this.refreshExecutor) {
          logger.warn('[session] Refresh executor not registered');
          return false;
        }
        const next = await this.refreshExecutor(refresh);
        if (!next?.accessToken) {
          await this.tokens.clear();
          this.onSessionExpired?.();
          return false;
        }
        await this.tokens.setTokens({
          accessToken: next.accessToken,
          refreshToken: next.refreshToken ?? refresh,
        });
        return true;
      } catch (error) {
        logger.warn('[session] Refresh failed', error);
        if (error instanceof UnauthorizedError || env.USE_MOCK_SERVICES === false) {
          await this.tokens.clear();
          this.onSessionExpired?.();
        }
        return false;
      } finally {
        this.refreshing = null;
      }
    })();

    return this.refreshing;
  }
}

export const sessionManager = new SessionManager();
