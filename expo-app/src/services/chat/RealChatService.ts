import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { chatRepository } from '../../repositories';
import { ApiResponse } from '../../types/api';
import { ChatMessage } from '../../types/domain';
import { IChatService } from './IChatService';
import { mockChatService } from './MockChatService';

/**
 * Real chat service — HTTP for sendMessage when API is live.
 * Intelligence surfaces (stream, memory, search, etc.) stay mock-backed
 * until the Conversation Engine endpoints ship.
 */
export class RealChatService implements IChatService {
  getModes = mockChatService.getModes.bind(mockChatService);
  getSuggestedPrompts = mockChatService.getSuggestedPrompts.bind(mockChatService);
  createConversation = mockChatService.createConversation.bind(mockChatService);
  getConversation = mockChatService.getConversation.bind(mockChatService);
  getConversationHistory = mockChatService.getConversationHistory.bind(mockChatService);
  deleteConversation = mockChatService.deleteConversation.bind(mockChatService);
  getInitialMessages = mockChatService.getInitialMessages.bind(mockChatService);
  hydrate = mockChatService.hydrate.bind(mockChatService);
  streamMessage = mockChatService.streamMessage.bind(mockChatService);
  regenerateMessage = mockChatService.regenerateMessage.bind(mockChatService);
  continueConversation = mockChatService.continueConversation.bind(mockChatService);
  submitMessageFeedback = mockChatService.submitMessageFeedback.bind(mockChatService);
  pinConversation = mockChatService.pinConversation.bind(mockChatService);
  searchConversations = mockChatService.searchConversations.bind(mockChatService);
  exportConversation = mockChatService.exportConversation.bind(mockChatService);
  getAiMemory = mockChatService.getAiMemory.bind(mockChatService);
  getAiTimeline = mockChatService.getAiTimeline.bind(mockChatService);
  getConversationTemplates = mockChatService.getConversationTemplates.bind(mockChatService);
  startFromTemplate = mockChatService.startFromTemplate.bind(mockChatService);
  getPersonalityProfiles = mockChatService.getPersonalityProfiles.bind(mockChatService);
  getContextCards = mockChatService.getContextCards.bind(mockChatService);
  getContextChips = mockChatService.getContextChips.bind(mockChatService);
  getFollowUpSuggestions = mockChatService.getFollowUpSuggestions.bind(mockChatService);
  getSuggestedActions = mockChatService.getSuggestedActions.bind(mockChatService);
  evaluateEscalation = mockChatService.evaluateEscalation.bind(mockChatService);

  async sendMessage(
    text: string,
    modeId: string,
    sessionId: string,
  ): Promise<ApiResponse<ChatMessage>> {
    try {
      return successResponse(await chatRepository.sendMessage(text, modeId, sessionId));
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }
}

export const realChatService = new RealChatService();
