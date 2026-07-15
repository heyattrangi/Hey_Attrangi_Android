import { IVideoSessionService } from './IVideoSessionService';
import { mockVideoSessionService } from './MockVideoSessionService';

/**
 * Real video service — delegates to mock until Daily/LiveKit/Agora routes exist.
 * Replace method bodies with VideoSessionRepository + SDK adapter.
 */
export class RealVideoSessionService implements IVideoSessionService {
  getSessionContext = mockVideoSessionService.getSessionContext.bind(
    mockVideoSessionService,
  );
  joinRoom = mockVideoSessionService.joinRoom.bind(mockVideoSessionService);
  leaveRoom = mockVideoSessionService.leaveRoom.bind(mockVideoSessionService);
  getChat = mockVideoSessionService.getChat.bind(mockVideoSessionService);
  sendChat = mockVideoSessionService.sendChat.bind(mockVideoSessionService);
  submitFeedback = mockVideoSessionService.submitFeedback.bind(
    mockVideoSessionService,
  );
}

export const realVideoSessionService = new RealVideoSessionService();
