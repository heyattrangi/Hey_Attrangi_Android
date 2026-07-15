import { UnauthorizedError } from '../types/errors';
import { sessionManager, SessionManager } from './SessionManager';
import { tokenManager, TokenManager } from './TokenManager';

/**
 * Auth middleware for imperative checks (stores, repositories, route guards).
 */
export class AuthMiddleware {
  constructor(
    private readonly tokens: TokenManager = tokenManager,
    private readonly sessions: SessionManager = sessionManager,
  ) {}

  async requireAccessToken(): Promise<string> {
    await this.tokens.hydrate();
    const token = await this.tokens.getAccessToken();
    if (!token) {
      throw new UnauthorizedError('Authentication required.');
    }
    return token;
  }

  async isAuthenticated(): Promise<boolean> {
    const snap = await this.sessions.getSnapshot();
    return snap.isAuthenticated;
  }

  async ensureFreshSession(): Promise<boolean> {
    const ok = await this.isAuthenticated();
    if (ok) return true;
    return this.sessions.refreshSession();
  }
}

export const authMiddleware = new AuthMiddleware();
