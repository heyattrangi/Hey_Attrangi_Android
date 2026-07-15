import { mockDelay, successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { enrichSessionForJourney } from '../../mocks/mockSessionExperience';
import { mockSessions } from '../../mocks/mockSessions';
import {
  Session,
  SessionChatMessage,
  SessionFeedbackDraft,
  VideoRoomCredentials,
} from '../../types/domain';
import { IVideoSessionService } from './IVideoSessionService';

const chatBySession = new Map<string, SessionChatMessage[]>();

export class MockVideoSessionService implements IVideoSessionService {
  async getSessionContext(sessionId: string) {
    const found = mockSessions.find((s) => s.id === sessionId);
    if (!found) {
      return failureResponse<Session>(
        normalizeServiceError(new Error('Session not found')),
      );
    }
    return mockDelay(successResponse(enrichSessionForJourney(found)));
  }

  async joinRoom(sessionId: string) {
    const credentials: VideoRoomCredentials = {
      provider: 'mock',
      roomUrl: `mock://room/${sessionId}`,
      token: `mock-token-${sessionId}`,
      channelName: `ha-${sessionId}`,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    };
    return mockDelay(successResponse(credentials), 900);
  }

  async leaveRoom(_sessionId: string) {
    return mockDelay(successResponse({ left: true }));
  }

  async getChat(sessionId: string) {
    const list = chatBySession.get(sessionId) ?? [
      {
        id: 'sys1',
        sender: 'system' as const,
        body: 'In-session chat is ready. Messages stay private to this session.',
        createdAt: new Date().toISOString(),
      },
    ];
    chatBySession.set(sessionId, list);
    return mockDelay(successResponse(list.map((m) => ({ ...m }))));
  }

  async sendChat(sessionId: string, body: string) {
    const msg: SessionChatMessage = {
      id: `c-${Date.now()}`,
      sender: 'self',
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };
    const list = chatBySession.get(sessionId) ?? [];
    list.push(msg);
    chatBySession.set(sessionId, list);
    return mockDelay(successResponse(msg));
  }

  async submitFeedback(_sessionId: string, _feedback: SessionFeedbackDraft) {
    return mockDelay(successResponse({ saved: true }));
  }
}

export const mockVideoSessionService = new MockVideoSessionService();
