import { ApiResponse } from '../../types/api';
import { Session } from '../../types/domain';

export interface ISessionService {
  listSessions(): Promise<ApiResponse<Session[]>>;
  refreshSessions(): Promise<ApiResponse<Session[]>>;
  getUpcomingSessions(): Promise<ApiResponse<Session[]>>;
  getPastSessions(): Promise<ApiResponse<Session[]>>;
  getSession(id: string): Promise<ApiResponse<Session | null>>;
}
