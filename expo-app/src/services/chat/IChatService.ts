import { ApiResponse } from '../../types/api';
import {
  AiChatMode,
  AiContextCard,
  AiFollowUpSuggestion,
  AiMemoryItem,
  AiMessageFeedback,
  AiPersonalityProfile,
  AiStreamEvent,
  AiSuggestedAction,
  AiTimelineEvent,
  ChatConversation,
  ChatMessage,
  ConversationContextChip,
  ConversationExportFormat,
  ConversationExportResult,
  ConversationSearchHit,
  ConversationTemplate,
  EscalationAssessment,
  SuggestedPrompt,
} from '../../types/domain';

export type AiStreamListener = (event: AiStreamEvent) => void;

/**
 * Conversation + AI intelligence contract.
 * Mock implements full UI flows; Real binds HTTP when the AI backend ships.
 */
export interface IChatService {
  getModes(): Promise<ApiResponse<AiChatMode[]>>;
  getSuggestedPrompts(modeId: string): Promise<ApiResponse<SuggestedPrompt[]>>;
  createConversation(modeId: string, userId: string): Promise<ApiResponse<ChatConversation>>;
  getConversation(conversationId: string): Promise<ApiResponse<ChatConversation>>;
  getConversationHistory(): Promise<ApiResponse<ChatConversation[]>>;
  deleteConversation(conversationId: string): Promise<ApiResponse<{ deleted: boolean }>>;
  getInitialMessages(conversationId: string): Promise<ApiResponse<ChatMessage[]>>;
  sendMessage(
    text: string,
    modeId: string,
    sessionId: string,
  ): Promise<ApiResponse<ChatMessage>>;
  /** Token streaming — frontend-ready protocol for future models */
  streamMessage(
    text: string,
    modeId: string,
    sessionId: string,
    onEvent: AiStreamListener,
  ): Promise<ApiResponse<ChatMessage>>;
  regenerateMessage(
    conversationId: string,
    messageId: string,
    onEvent?: AiStreamListener,
  ): Promise<ApiResponse<ChatMessage>>;
  continueConversation(
    conversationId: string,
    onEvent?: AiStreamListener,
  ): Promise<ApiResponse<ChatMessage>>;
  submitMessageFeedback(
    feedback: Omit<AiMessageFeedback, 'createdAt'> & { createdAt?: string },
  ): Promise<ApiResponse<{ ok: boolean }>>;
  pinConversation(
    conversationId: string,
    pinned: boolean,
  ): Promise<ApiResponse<ChatConversation>>;
  searchConversations(query: string): Promise<ApiResponse<ConversationSearchHit[]>>;
  exportConversation(
    conversationId: string,
    format: ConversationExportFormat,
  ): Promise<ApiResponse<ConversationExportResult>>;
  getAiMemory(): Promise<ApiResponse<AiMemoryItem[]>>;
  getAiTimeline(): Promise<ApiResponse<AiTimelineEvent[]>>;
  getConversationTemplates(): Promise<ApiResponse<ConversationTemplate[]>>;
  startFromTemplate(
    templateId: string,
    userId: string,
  ): Promise<ApiResponse<ChatConversation>>;
  getPersonalityProfiles(): Promise<ApiResponse<AiPersonalityProfile[]>>;
  getContextCards(conversationId: string): Promise<ApiResponse<AiContextCard[]>>;
  getContextChips(conversationId: string): Promise<ApiResponse<ConversationContextChip[]>>;
  getFollowUpSuggestions(conversationId: string): Promise<ApiResponse<AiFollowUpSuggestion[]>>;
  getSuggestedActions(conversationId: string): Promise<ApiResponse<AiSuggestedAction[]>>;
  evaluateEscalation(text: string): Promise<ApiResponse<EscalationAssessment>>;
  hydrate(conversations: ChatConversation[]): void;
}
