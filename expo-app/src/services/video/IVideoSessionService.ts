import { ApiResponse } from '../../types/api';
import {
  Session,
  SessionChatMessage,
  SessionFeedbackDraft,
  VideoRoomCredentials,
} from '../../types/domain';

/**
 * Video therapy facade — UI talks only to this interface.
 * Real adapters will create Daily / LiveKit / Agora rooms using `joinRoom`.
 */
export interface IVideoSessionService {
  getSessionContext(sessionId: string): Promise<ApiResponse<Session>>;
  /** Allocate room credentials (mock today; SDK later). */
  joinRoom(sessionId: string): Promise<ApiResponse<VideoRoomCredentials>>;
  leaveRoom(sessionId: string): Promise<ApiResponse<{ left: boolean }>>;
  getChat(sessionId: string): Promise<ApiResponse<SessionChatMessage[]>>;
  sendChat(
    sessionId: string,
    body: string,
  ): Promise<ApiResponse<SessionChatMessage>>;
  submitFeedback(
    sessionId: string,
    feedback: SessionFeedbackDraft,
  ): Promise<ApiResponse<{ saved: boolean }>>;
}
