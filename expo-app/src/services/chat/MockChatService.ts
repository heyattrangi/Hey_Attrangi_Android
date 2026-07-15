import { mockDelay, successResponse } from '../../api/client';
import {
  assessEscalation,
  buildMockStreamEvents,
  detectEmotion,
  formatConversationExport,
  MOCK_AI_MEMORY,
  MOCK_AI_PERSONALITIES,
  MOCK_AI_TIMELINE,
  MOCK_CONTEXT_CARDS,
  MOCK_CONTEXT_CHIPS,
  MOCK_CONVERSATION_TEMPLATES,
  MOCK_FOLLOW_UPS,
  MOCK_SUGGESTED_ACTIONS,
  searchMockMessages,
} from '../../mocks/mockAiIntelligence';
import {
  AiMessageFeedback,
  ChatConversation,
  ChatMessage,
  ConversationExportFormat,
} from '../../types/domain';
import {
  AI_CHAT_MODES,
  buildSessionId,
  getSuggestedPromptsForMode,
  mapAiReply,
} from './chatMappers';
import { AiStreamListener, IChatService } from './IChatService';

const MOCK_AI_REPLY =
  "Thank you for sharing. I'm listening — tell me more whenever you're ready.";

const CONTINUE_REPLY =
  'Whenever you want to pick this back up, I’m here. What feels most present now?';

const REGENERATE_REPLY =
  'Let me try another angle: what you shared matters. What’s the part that still feels unfinished?';

function titleFromMessages(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.sender === 'user');
  if (!firstUser?.text) return 'New conversation';
  const t = firstUser.text.trim();
  return t.length > 42 ? `${t.slice(0, 42)}…` : t;
}

function previewFromMessages(messages: ChatMessage[]): string {
  const last = messages[messages.length - 1];
  return last?.text?.slice(0, 80) ?? '';
}

/**
 * Mock Conversation Engine — simulates thinking, token stream, memory,
 * escalation, and intelligence surfaces without a live AI backend.
 */
export class MockChatService implements IChatService {
  private conversations = new Map<string, ChatConversation>();
  private feedback: AiMessageFeedback[] = [];

  hydrate(conversations: ChatConversation[]) {
    this.conversations.clear();
    conversations.forEach((conversation) => {
      this.conversations.set(conversation.id, { ...conversation });
    });
  }

  async getModes() {
    return mockDelay(successResponse(AI_CHAT_MODES.map((mode) => ({ ...mode }))));
  }

  async getSuggestedPrompts(modeId: string) {
    return mockDelay(successResponse(getSuggestedPromptsForMode(modeId)));
  }

  async createConversation(modeId: string, userId: string) {
    const existing = [...this.conversations.values()].find(
      (conversation) => conversation.modeId === modeId && !conversation.endedAt,
    );
    if (existing) {
      return mockDelay(successResponse({ ...existing }));
    }

    const now = new Date().toISOString();
    const conversation: ChatConversation = {
      id: `conv-${modeId}-${userId}-${Date.now()}`,
      modeId,
      sessionId: buildSessionId(userId, modeId),
      messages: [],
      createdAt: now,
      updatedAt: now,
      title: 'New conversation',
      preview: '',
      pinned: false,
    };
    this.conversations.set(conversation.id, conversation);
    return mockDelay(successResponse({ ...conversation }));
  }

  async getConversation(conversationId: string) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return mockDelay(
      successResponse({ ...conversation, messages: [...conversation.messages] }),
    );
  }

  async getConversationHistory() {
    const list = [...this.conversations.values()]
      .map((conversation) => ({
        ...conversation,
        messages: [...conversation.messages],
        title: conversation.title ?? titleFromMessages(conversation.messages),
        preview: conversation.preview ?? previewFromMessages(conversation.messages),
      }))
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
    return mockDelay(successResponse(list));
  }

  async deleteConversation(conversationId: string) {
    return mockDelay(successResponse({ deleted: this.conversations.delete(conversationId) }));
  }

  async getInitialMessages(conversationId: string) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return mockDelay(successResponse([...conversation.messages]));
  }

  async sendMessage(text: string, modeId: string, sessionId: string) {
    return this.streamMessage(text, modeId, sessionId, () => undefined);
  }

  async streamMessage(
    text: string,
    _modeId: string,
    sessionId: string,
    onEvent: AiStreamListener,
  ) {
    const trimmed = text.trim();
    const messageId = `ai-${Date.now()}`;
    const base = mapAiReply(MOCK_AI_REPLY);
    const fullText = base.text;
    const events = buildMockStreamEvents(fullText, messageId, trimmed);

    let streamed = '';
    for (const event of events) {
      await new Promise((r) => setTimeout(r, event.type === 'token' ? 18 : 90));
      if (event.type === 'token' && event.token) {
        streamed += event.token;
      }
      onEvent(event);
    }

    const emotion = detectEmotion(trimmed);
    const aiMessage: ChatMessage = {
      ...base,
      id: messageId,
      text: streamed || fullText,
      isStreaming: false,
      thinkingStage: 'done',
      emotionDetection: emotion,
      followUps: MOCK_FOLLOW_UPS,
      suggestedActions: MOCK_SUGGESTED_ACTIONS,
      canRegenerate: true,
      createdAt: new Date().toISOString(),
    };

    const conversation = [...this.conversations.values()].find(
      (item) => item.sessionId === sessionId,
    );
    if (conversation) {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        text: trimmed,
        sender: 'user',
        createdAt: new Date().toISOString(),
      };
      conversation.messages = [...conversation.messages, userMessage, aiMessage];
      conversation.updatedAt = new Date().toISOString();
      conversation.title = titleFromMessages(conversation.messages);
      conversation.preview = previewFromMessages(conversation.messages);
      this.conversations.set(conversation.id, conversation);
    }

    return successResponse(aiMessage);
  }

  async regenerateMessage(
    conversationId: string,
    messageId: string,
    onEvent?: AiStreamListener,
  ) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const idx = conversation.messages.findIndex((m) => m.id === messageId);
    if (idx < 0) throw new Error('Message not found');

    const newId = `ai-regen-${Date.now()}`;
    const events = buildMockStreamEvents(REGENERATE_REPLY, newId, 'regenerate');
    let streamed = '';
    for (const event of events) {
      await new Promise((r) => setTimeout(r, event.type === 'token' ? 16 : 70));
      if (event.type === 'token' && event.token) streamed += event.token;
      onEvent?.(event);
    }

    const aiMessage: ChatMessage = {
      id: newId,
      text: streamed || REGENERATE_REPLY,
      sender: 'ai',
      createdAt: new Date().toISOString(),
      canRegenerate: true,
      followUps: MOCK_FOLLOW_UPS,
      suggestedActions: MOCK_SUGGESTED_ACTIONS,
      quickReplies: [
        { id: `qr-${newId}-1`, label: 'That helps' },
        { id: `qr-${newId}-2`, label: 'Try again' },
      ],
      cards: mapAiReply(REGENERATE_REPLY).cards,
    };

    conversation.messages = [
      ...conversation.messages.slice(0, idx),
      aiMessage,
      ...conversation.messages.slice(idx + 1),
    ];
    conversation.updatedAt = new Date().toISOString();
    this.conversations.set(conversationId, conversation);
    return successResponse(aiMessage);
  }

  async continueConversation(conversationId: string, onEvent?: AiStreamListener) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    conversation.endedAt = null;
    const newId = `ai-continue-${Date.now()}`;
    const events = buildMockStreamEvents(CONTINUE_REPLY, newId, 'continue');
    let streamed = '';
    for (const event of events) {
      await new Promise((r) => setTimeout(r, event.type === 'token' ? 16 : 60));
      if (event.type === 'token' && event.token) streamed += event.token;
      onEvent?.(event);
    }

    const aiMessage: ChatMessage = {
      id: newId,
      text: streamed || CONTINUE_REPLY,
      sender: 'ai',
      createdAt: new Date().toISOString(),
      canRegenerate: true,
      followUps: MOCK_FOLLOW_UPS,
      suggestedActions: [{ id: 'sa-cont', label: 'Keep talking', kind: 'continue' }],
      quickReplies: [
        { id: `qr-${newId}-1`, label: 'Yes, let’s continue' },
        { id: `qr-${newId}-2`, label: 'Something else' },
      ],
    };

    conversation.messages = [...conversation.messages, aiMessage];
    conversation.updatedAt = new Date().toISOString();
    conversation.preview = previewFromMessages(conversation.messages);
    this.conversations.set(conversationId, conversation);
    return successResponse(aiMessage);
  }

  async submitMessageFeedback(feedback: Omit<AiMessageFeedback, 'createdAt'> & {
    createdAt?: string;
  }) {
    this.feedback.push({
      ...feedback,
      createdAt: feedback.createdAt ?? new Date().toISOString(),
    });
    const conversation = [...this.conversations.values()].find((c) =>
      c.messages.some((m) => m.id === feedback.messageId),
    );
    if (conversation) {
      conversation.messages = conversation.messages.map((m) =>
        m.id === feedback.messageId ? { ...m, aiFeedback: feedback.kind } : m,
      );
      this.conversations.set(conversation.id, conversation);
    }
    return mockDelay(successResponse({ ok: true }), 200);
  }

  async pinConversation(conversationId: string, pinned: boolean) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');
    conversation.pinned = pinned;
    conversation.pinnedAt = pinned ? new Date().toISOString() : null;
    conversation.updatedAt = new Date().toISOString();
    this.conversations.set(conversationId, conversation);
    return mockDelay(successResponse({ ...conversation }));
  }

  async searchConversations(query: string) {
    const hits = searchMockMessages(
      [...this.conversations.values()].map((c) => ({
        id: c.id,
        title: c.title,
        updatedAt: c.updatedAt,
        messages: c.messages,
      })),
      query,
    );
    return mockDelay(successResponse(hits), 250);
  }

  async exportConversation(conversationId: string, format: ConversationExportFormat) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');
    const result = formatConversationExport(
      conversationId,
      conversation.title ?? titleFromMessages(conversation.messages),
      conversation.messages.map((m) => ({
        sender: m.sender === 'ai' ? 'Companion' : 'You',
        text: m.text,
      })),
      format,
    );
    return mockDelay(successResponse(result), 300);
  }

  async getAiMemory() {
    return mockDelay(successResponse(MOCK_AI_MEMORY.map((m) => ({ ...m }))));
  }

  async getAiTimeline() {
    return mockDelay(successResponse(MOCK_AI_TIMELINE.map((e) => ({ ...e }))));
  }

  async getConversationTemplates() {
    return mockDelay(
      successResponse(MOCK_CONVERSATION_TEMPLATES.map((t) => ({ ...t }))),
    );
  }

  async startFromTemplate(templateId: string, userId: string) {
    const template = MOCK_CONVERSATION_TEMPLATES.find((t) => t.id === templateId);
    if (!template) throw new Error('Template not found');
    const created = await this.createConversation(template.modeId, userId);
    if (!created.success) throw created.error ?? new Error('Failed to create');
    const conversation = created.data;
    conversation.templateId = template.id;
    conversation.title = template.title;
    this.conversations.set(conversation.id, conversation);
    return successResponse({ ...conversation });
  }

  async getPersonalityProfiles() {
    return mockDelay(successResponse(MOCK_AI_PERSONALITIES.map((p) => ({ ...p }))));
  }

  async getContextCards(_conversationId: string) {
    return mockDelay(successResponse(MOCK_CONTEXT_CARDS.map((c) => ({ ...c }))));
  }

  async getContextChips(_conversationId: string) {
    return mockDelay(successResponse(MOCK_CONTEXT_CHIPS.map((c) => ({ ...c }))));
  }

  async getFollowUpSuggestions(_conversationId: string) {
    return mockDelay(successResponse(MOCK_FOLLOW_UPS.map((f) => ({ ...f }))));
  }

  async getSuggestedActions(_conversationId: string) {
    return mockDelay(successResponse(MOCK_SUGGESTED_ACTIONS.map((a) => ({ ...a }))));
  }

  async evaluateEscalation(text: string) {
    return mockDelay(successResponse(assessEscalation(text)), 120);
  }
}

export const mockChatService = new MockChatService();

