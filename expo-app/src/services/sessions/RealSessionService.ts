import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { sessionRepository } from '../../repositories';
import { ApiResponse } from '../../types/api';
import { Session } from '../../types/domain';
import { ISessionService } from './ISessionService';
import { mockSessionService } from './MockSessionService';

export class RealSessionService implements ISessionService {
  async listSessions(): Promise<ApiResponse<Session[]>> {
    try {
      return successResponse(await sessionRepository.list());
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  refreshSessions() {
    return this.listSessions();
  }

  getUpcomingSessions = mockSessionService.getUpcomingSessions.bind(mockSessionService);
  getPastSessions = mockSessionService.getPastSessions.bind(mockSessionService);
  getSession = mockSessionService.getSession.bind(mockSessionService);
}

export const realSessionService = new RealSessionService();
