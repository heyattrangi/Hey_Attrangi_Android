import { mockDelay, successResponse } from '../../api/client';
import { mockSessions } from '../../mocks/mockSessions';
import { Session } from '../../types/domain';
import { ISessionService } from './ISessionService';
import { filterPastSessions, filterUpcomingSessions } from './sessionMappers';

let sessions: Session[] = mockSessions.map((session) => ({ ...session }));

/**
 * @deprecated Retained until full backend migration completes. Use ApiSessionService via DI.
 */
export class MockSessionService implements ISessionService {
  async listSessions() {
    return mockDelay(successResponse(sessions.map((session) => ({ ...session }))));
  }

  async refreshSessions() {
    return this.listSessions();
  }

  async getUpcomingSessions() {
    const response = await this.listSessions();
    return successResponse(filterUpcomingSessions(response.data));
  }

  async getPastSessions() {
    const response = await this.listSessions();
    return successResponse(filterPastSessions(response.data));
  }

  async getSession(id: string) {
    const session = sessions.find((item) => item.id === id) ?? null;
    return mockDelay(successResponse(session ? { ...session } : null));
  }

  hydrate(nextSessions: Session[]) {
    sessions = nextSessions.map((session) => ({ ...session }));
  }
}

/** @deprecated Use apiSessionService from the DI container. */
export const mockSessionService = new MockSessionService();
