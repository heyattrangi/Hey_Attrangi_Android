import { BaseRepository } from './base/BaseRepository';
import { guestTokenManager } from '../auth/GuestTokenManager';

export interface PragyaChatResponse {
  reply?: string;
  expression?: string;
  suggestions?: string[];
  action?: {
    type: string;
    title: string;
    url: string;
  };
  requiresLogin?: boolean;
  error?: string;
}

export interface PragyaHistoryResponse {
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface PragyaSuggestionsResponse {
  suggestions?: string[];
}

export class ChatRepository extends BaseRepository {
  async initGuestSession(): Promise<{ conversationId?: string; guestToken?: string }> {
    let existingToken = await guestTokenManager.getGuestToken();
    const headers: Record<string, string> = {};
    if (existingToken) {
      headers.Cookie = `pragya_guest_token=${existingToken}`;
    }

    const res = await this.http.post<{ conversationId?: string; requiresLogin?: boolean }>(
      '/api/pragya/session',
      {},
      { skipAuth: true, headers },
    );

    const setCookie = res.headers?.['set-cookie'] || res.headers?.['Set-Cookie'];
    if (setCookie) {
      const match = setCookie.match(/pragya_guest_token=([^;]+)/);
      if (match && match[1]) {
        await guestTokenManager.setGuestToken(match[1]);
        existingToken = match[1];
      }
    }

    return {
      conversationId: res.data?.conversationId,
      guestToken: existingToken ?? undefined,
    };
  }

  async sendGuestMessage(message: string): Promise<PragyaChatResponse> {
    let guestToken = await guestTokenManager.getGuestToken();
    if (!guestToken) {
      const session = await this.initGuestSession();
      guestToken = session.guestToken ?? null;
    }

    const headers: Record<string, string> = {};
    if (guestToken) {
      headers.Cookie = `pragya_guest_token=${guestToken}`;
    }

    const res = await this.http.post<PragyaChatResponse>(
      '/api/pragya/chat',
      {
        message,
        generate_suggestions: true,
        client_time: new Date().toISOString(),
      },
      { skipAuth: true, headers },
    );

    const setCookie = res.headers?.['set-cookie'] || res.headers?.['Set-Cookie'];
    if (setCookie) {
      const match = setCookie.match(/pragya_guest_token=([^;]+)/);
      if (match && match[1]) {
        await guestTokenManager.setGuestToken(match[1]);
      }
    }

    return res.data;
  }

  async sendMessage(
    message: string,
    sessionId?: string,
  ): Promise<PragyaChatResponse> {
    const { data } = await this.http.post<PragyaChatResponse>('/api/pragya/chat', {
      message,
      session_id: sessionId,
      generate_suggestions: false,
    });
    return data;
  }

  async getHistory(): Promise<PragyaHistoryResponse> {
    const { data } = await this.http.get<PragyaHistoryResponse>('/api/pragya/history');
    return data;
  }

  async getSuggestions(sessionId?: string): Promise<PragyaSuggestionsResponse> {
    const { data } = await this.http.post<PragyaSuggestionsResponse>('/api/pragya/suggestions', {
      session_id: sessionId,
    });
    return data;
  }
}

export const chatRepository = new ChatRepository();
