import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeServiceError } from '../api/client';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { getChatService } from '../services/container';
import { chatErrorMessage } from '../services/chat/chatMappers';
import { RequestStatus } from '../types/api';
import {
  AiContextCard,
  AiFeedbackKind,
  AiFollowUpSuggestion,
  AiMemoryItem,
  AiPersonalityProfile,
  AiStreamEvent,
  AiSuggestedAction,
  AiThinkingStage,
  AiTimelineEvent,
  ChatConversation,
  ChatMessage,
  ConversationContextChip,
  ConversationExportFormat,
  ConversationExportResult,
  ConversationSearchHit,
  ConversationTemplate,
  EscalationAssessment,
  AiChatMode,
  SuggestedPrompt,
} from '../types/domain';
import { AppError, UnknownError } from '../types/errors';
import { resolveFetchError, resolveListStatus } from '../utils/asyncStatus';
import { useAuthStore } from './authStore';
import { useProfileStore } from './profileStore';
import { useNetworkStore } from './networkStore';
import { usePreferencesStore } from './preferencesStore';

interface ChatState {
  modes: AiChatMode[];
  messages: ChatMessage[];
  conversations: ChatConversation[];
  activeConversationId: string | null;
  activeModeId: string | null;
  suggestedPrompts: SuggestedPrompt[];
  contextChips: ConversationContextChip[];
  contextCards: AiContextCard[];
  followUps: AiFollowUpSuggestion[];
  suggestedActions: AiSuggestedAction[];
  thinkingStage: AiThinkingStage | null;
  streamingMessageId: string | null;
  escalation: EscalationAssessment | null;
  memoryItems: AiMemoryItem[];
  timeline: AiTimelineEvent[];
  templates: ConversationTemplate[];
  personalities: AiPersonalityProfile[];
  searchHits: ConversationSearchHit[];
  lastExport: ConversationExportResult | null;
  status: RequestStatus;
  sendStatus: RequestStatus;
  intelStatus: RequestStatus;
  error: AppError | null;
  fetchModes: () => Promise<void>;
  loadConversation: (modeId: string) => Promise<void>;
  openConversation: (conversationId: string) => Promise<void>;
  fetchInitialMessages: () => Promise<void>;
  fetchSuggestedPrompts: (modeId: string) => Promise<void>;
  fetchHistory: () => Promise<void>;
  sendMessage: (text: string, modeId: string) => Promise<void>;
  regenerateLastAi: () => Promise<void>;
  continueConversation: () => Promise<void>;
  submitAiFeedback: (messageId: string, kind: AiFeedbackKind) => Promise<void>;
  pinConversation: (conversationId: string, pinned: boolean) => Promise<void>;
  searchConversations: (query: string) => Promise<void>;
  exportConversation: (
    conversationId: string,
    format: ConversationExportFormat,
  ) => Promise<ConversationExportResult | null>;
  loadIntelligenceSurfaces: () => Promise<void>;
  loadTemplates: () => Promise<void>;
  startFromTemplate: (templateId: string) => Promise<void>;
  dismissEscalation: () => void;
  deleteConversation: (conversationId: string) => Promise<void>;
  syncServiceState: () => void;
}

const resolveActionError = (error: unknown): { status: RequestStatus; error: AppError } => {
  const appError = normalizeServiceError(error);
  const friendlyMessage = chatErrorMessage(appError);
  const resolvedError =
    friendlyMessage !== appError.message ? new UnknownError(friendlyMessage) : appError;

  const isOffline = !useNetworkStore.getState().isConnected;
  if (isOffline || resolvedError.code === 'NETWORK_ERROR') {
    return { status: 'offline', error: resolvedError };
  }
  return { status: 'error', error: resolvedError };
};

const getUserId = () => {
  const email = useProfileStore.getState().savedPersonalInfo.email.trim().toLowerCase();
  if (email) {
    return email.replace(/[^a-z0-9]/g, '_');
  }
  const token = useAuthStore.getState().accessToken;
  return token ? token.slice(-16) : 'guest';
};

function applyStreamEvent(
  get: () => ChatState,
  set: (partial: Partial<ChatState> | ((s: ChatState) => Partial<ChatState>)) => void,
  event: AiStreamEvent,
) {
  const messageId = event.messageId;
  if (event.type === 'thinking' && event.thinkingStage) {
    set({ thinkingStage: event.thinkingStage, streamingMessageId: messageId ?? null });
  }
  if (event.type === 'context' && event.contextChips) {
    set({ contextChips: event.contextChips });
  }
  if (event.type === 'escalation' && event.escalation) {
    const enabled = usePreferencesStore.getState().companion.crisisEscalationEnabled;
    if (enabled && event.escalation.level !== 'none') {
      set({ escalation: event.escalation });
    }
  }
  if (event.type === 'follow_ups' && event.followUps) {
    set({ followUps: event.followUps });
  }
  if (event.type === 'suggested_actions' && event.suggestedActions) {
    set({ suggestedActions: event.suggestedActions });
  }
  if (!messageId) return;

  if (event.type === 'token' && event.token) {
    set((state) => {
      const exists = state.messages.some((m) => m.id === messageId);
      if (!exists) {
        return {
          streamingMessageId: messageId,
          thinkingStage: 'composing',
          messages: [
            ...state.messages,
            {
              id: messageId,
              text: event.token!,
              sender: 'ai' as const,
              isStreaming: true,
              thinkingStage: 'composing',
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return {
        messages: state.messages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                text: m.text + event.token!,
                isStreaming: true,
                thinkingStage: 'composing',
              }
            : m,
        ),
      };
    });
  }

  if (event.type === 'emotion' && event.emotion) {
    const emotionOn = usePreferencesStore.getState().companion.emotionDetectionEnabled;
    if (!emotionOn) return;
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, emotionDetection: event.emotion } : m,
      ),
    }));
  }

  if (event.type === 'quick_replies' && event.quickReplies) {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, quickReplies: event.quickReplies } : m,
      ),
    }));
  }

  if (event.type === 'card' && event.card) {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId
          ? { ...m, cards: [...(m.cards ?? []), event.card!] }
          : m,
      ),
    }));
  }

  if (event.type === 'done') {
    set((state) => ({
      thinkingStage: null,
      streamingMessageId: null,
      messages: state.messages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              isStreaming: false,
              thinkingStage: 'done',
              canRegenerate: true,
              followUps: get().followUps.length ? get().followUps : m.followUps,
              suggestedActions: get().suggestedActions.length
                ? get().suggestedActions
                : m.suggestedActions,
            }
          : m,
      ),
    }));
  }
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      modes: [],
      messages: [],
      conversations: [],
      activeConversationId: null,
      activeModeId: null,
      suggestedPrompts: [],
      contextChips: [],
      contextCards: [],
      followUps: [],
      suggestedActions: [],
      thinkingStage: null,
      streamingMessageId: null,
      escalation: null,
      memoryItems: [],
      timeline: [],
      templates: [],
      personalities: [],
      searchHits: [],
      lastExport: null,
      status: 'idle',
      sendStatus: 'idle',
      intelStatus: 'idle',
      error: null,

      syncServiceState: () => {
        getChatService().hydrate(get().conversations);
      },

      fetchModes: async () => {
        set({ status: 'loading', error: null });
        get().syncServiceState();

        try {
          const response = await getChatService().getModes();
          if (!response.success) {
            throw response.error ?? new Error('Failed to load chat modes');
          }
          const items = response.data;
          set({
            modes: items,
            status: resolveListStatus(items, null),
            error: null,
          });
        } catch (error) {
          const cached = get().modes;
          const resolved = resolveFetchError(error, cached);
          set({
            status: cached.length > 0 ? 'success' : resolved.status,
            error: resolved.error,
          });
        }
      },

      loadConversation: async (modeId) => {
        set({ status: 'loading', error: null, activeModeId: modeId, escalation: null });
        get().syncServiceState();

        const userId = getUserId();
        const existing = get().conversations.find(
          (conversation) => conversation.modeId === modeId && !conversation.endedAt,
        );

        try {
          let conversation = existing;
          if (!conversation) {
            const response = await getChatService().createConversation(modeId, userId);
            if (!response.success) {
              throw response.error ?? new Error('Failed to create conversation');
            }
            conversation = response.data;
          } else {
            const response = await getChatService().getConversation(conversation.id);
            if (response.success) {
              conversation = response.data;
            }
          }

          const nextConversations = existing
            ? get().conversations.map((item) =>
                item.id === conversation!.id ? conversation! : item,
              )
            : [...get().conversations, conversation!];

          set({
            conversations: nextConversations,
            activeConversationId: conversation!.id,
            messages: [...conversation!.messages],
            status: conversation!.messages.length === 0 ? 'empty' : 'success',
            error: null,
          });
          get().syncServiceState();
          void get().loadIntelligenceSurfaces();
        } catch (error) {
          const cached = existing?.messages ?? [];
          const resolved = resolveFetchError(error, cached);
          set({
            messages: cached,
            status: cached.length > 0 ? 'success' : resolved.status,
            error: resolved.error,
          });
        }
      },

      openConversation: async (conversationId) => {
        set({ status: 'loading', error: null, escalation: null });
        get().syncServiceState();
        try {
          const response = await getChatService().getConversation(conversationId);
          if (!response.success) {
            throw response.error ?? new Error('Conversation not found');
          }
          const conversation = response.data;
          set((state) => ({
            conversations: state.conversations.some((c) => c.id === conversation.id)
              ? state.conversations.map((c) =>
                  c.id === conversation.id ? conversation : c,
                )
              : [...state.conversations, conversation],
            activeConversationId: conversation.id,
            activeModeId: conversation.modeId,
            messages: [...conversation.messages],
            status: conversation.messages.length === 0 ? 'empty' : 'success',
            error: null,
          }));
          get().syncServiceState();
          void get().loadIntelligenceSurfaces();
        } catch (error) {
          const resolved = resolveFetchError(error, []);
          set({ status: resolved.status, error: resolved.error });
        }
      },

      fetchInitialMessages: async () => {
        const modeId = get().activeModeId;
        if (!modeId) {
          set({ status: 'idle', messages: [] });
          return;
        }
        await get().loadConversation(modeId);
      },

      fetchSuggestedPrompts: async (modeId) => {
        try {
          const response = await getChatService().getSuggestedPrompts(modeId);
          if (!response.success) {
            throw response.error ?? new Error('Failed to load suggested prompts');
          }
          set({ suggestedPrompts: response.data });
        } catch {
          set({ suggestedPrompts: [] });
        }
      },

      fetchHistory: async () => {
        get().syncServiceState();
        try {
          const response = await getChatService().getConversationHistory();
          if (!response.success) {
            throw response.error ?? new Error('Failed to load history');
          }
          set({ conversations: response.data, status: 'success' });
        } catch (error) {
          const resolved = resolveFetchError(error, get().conversations);
          set({ error: resolved.error });
        }
      },

      sendMessage: async (text, modeId) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        get().syncServiceState();
        const streamingOn = usePreferencesStore.getState().companion.streamingEnabled;

        let conversation =
          get().conversations.find((item) => item.id === get().activeConversationId) ??
          get().conversations.find((item) => item.modeId === modeId);

        if (!conversation) {
          const created = await getChatService().createConversation(modeId, getUserId());
          if (!created.success) {
            throw created.error ?? new Error('Failed to start conversation');
          }
          conversation = created.data;
          set((state) => ({
            conversations: [...state.conversations, conversation!],
            activeConversationId: conversation!.id,
            activeModeId: modeId,
          }));
        }

        const userMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          text: trimmed,
          sender: 'user',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, userMessage],
          sendStatus: 'loading',
          thinkingStage: 'analyzing',
          followUps: [],
          suggestedActions: [],
          error: null,
        }));

        if (!useNetworkStore.getState().isConnected) {
          const offlineError = normalizeServiceError(new Error('You are offline.'));
          set({ sendStatus: 'offline', error: offlineError, thinkingStage: null });
          throw offlineError;
        }

        try {
          const onEvent = (event: AiStreamEvent) => applyStreamEvent(get, set, event);

          const response = streamingOn
            ? await getChatService().streamMessage(
                trimmed,
                modeId,
                conversation.sessionId,
                onEvent,
              )
            : await getChatService().sendMessage(trimmed, modeId, conversation.sessionId);

          if (!response.success) {
            throw response.error ?? new Error('Failed to send message');
          }

          // Non-streaming path: append final AI message if not already streamed
          if (!streamingOn) {
            set((state) => ({
              messages: [...state.messages, response.data],
            }));
          }

          const historyResponse = await getChatService().getConversation(conversation.id);
          if (historyResponse.success) {
            const updated = historyResponse.data;
            set((state) => ({
              messages: [...updated.messages],
              conversations: state.conversations.map((item) =>
                item.id === updated.id ? updated : item,
              ),
              sendStatus: 'success',
              thinkingStage: null,
              streamingMessageId: null,
              error: null,
            }));
          } else {
            set({
              sendStatus: 'success',
              thinkingStage: null,
              streamingMessageId: null,
              error: null,
            });
          }
          get().syncServiceState();
        } catch (error) {
          const resolved = resolveActionError(error);
          set({
            sendStatus: resolved.status,
            error: resolved.error,
            thinkingStage: null,
            streamingMessageId: null,
          });
          throw resolved.error;
        }
      },

      regenerateLastAi: async () => {
        const conversationId = get().activeConversationId;
        if (!conversationId) return;
        const lastAi = [...get().messages].reverse().find((m) => m.sender === 'ai');
        if (!lastAi) return;

        set({ sendStatus: 'loading', thinkingStage: 'composing', error: null });
        try {
          const response = await getChatService().regenerateMessage(
            conversationId,
            lastAi.id,
            (event) => applyStreamEvent(get, set, event),
          );
          if (!response.success) {
            throw response.error ?? new Error('Failed to regenerate');
          }
          const refreshed = await getChatService().getConversation(conversationId);
          if (refreshed.success) {
            set({
              messages: [...refreshed.data.messages],
              conversations: get().conversations.map((c) =>
                c.id === conversationId ? refreshed.data : c,
              ),
              sendStatus: 'success',
              thinkingStage: null,
            });
          } else {
            set({ sendStatus: 'success', thinkingStage: null });
          }
          get().syncServiceState();
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ sendStatus: resolved.status, error: resolved.error, thinkingStage: null });
        }
      },

      continueConversation: async () => {
        const conversationId = get().activeConversationId;
        if (!conversationId) return;
        set({ sendStatus: 'loading', thinkingStage: 'composing', error: null });
        try {
          const response = await getChatService().continueConversation(
            conversationId,
            (event) => applyStreamEvent(get, set, event),
          );
          if (!response.success) {
            throw response.error ?? new Error('Failed to continue');
          }
          const refreshed = await getChatService().getConversation(conversationId);
          if (refreshed.success) {
            set({
              messages: [...refreshed.data.messages],
              conversations: get().conversations.map((c) =>
                c.id === conversationId ? refreshed.data : c,
              ),
              sendStatus: 'success',
              thinkingStage: null,
            });
          } else {
            set({ sendStatus: 'success', thinkingStage: null });
          }
          get().syncServiceState();
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ sendStatus: resolved.status, error: resolved.error, thinkingStage: null });
        }
      },

      submitAiFeedback: async (messageId, kind) => {
        try {
          await getChatService().submitMessageFeedback({ messageId, kind });
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === messageId ? { ...m, aiFeedback: kind } : m,
            ),
          }));
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ error: resolved.error });
        }
      },

      pinConversation: async (conversationId, pinned) => {
        try {
          const response = await getChatService().pinConversation(conversationId, pinned);
          if (!response.success) throw response.error ?? new Error('Pin failed');
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === conversationId ? response.data : c,
            ),
          }));
          get().syncServiceState();
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ error: resolved.error });
        }
      },

      searchConversations: async (query) => {
        try {
          const response = await getChatService().searchConversations(query);
          if (!response.success) throw response.error ?? new Error('Search failed');
          set({ searchHits: response.data });
        } catch {
          set({ searchHits: [] });
        }
      },

      exportConversation: async (conversationId, format) => {
        try {
          const response = await getChatService().exportConversation(conversationId, format);
          if (!response.success) throw response.error ?? new Error('Export failed');
          set({ lastExport: response.data });
          return response.data;
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ error: resolved.error });
          return null;
        }
      },

      loadIntelligenceSurfaces: async () => {
        const conversationId = get().activeConversationId;
        set({ intelStatus: 'loading' });
        try {
          const [memory, timeline, personalities, chips, cards, followUps, actions] =
            await Promise.all([
              getChatService().getAiMemory(),
              getChatService().getAiTimeline(),
              getChatService().getPersonalityProfiles(),
              conversationId
                ? getChatService().getContextChips(conversationId)
                : Promise.resolve(null),
              conversationId
                ? getChatService().getContextCards(conversationId)
                : Promise.resolve(null),
              conversationId
                ? getChatService().getFollowUpSuggestions(conversationId)
                : Promise.resolve(null),
              conversationId
                ? getChatService().getSuggestedActions(conversationId)
                : Promise.resolve(null),
            ]);
          set({
            memoryItems: memory.success ? memory.data : [],
            timeline: timeline.success ? timeline.data : [],
            personalities: personalities.success ? personalities.data : [],
            contextChips: chips?.success ? chips.data : get().contextChips,
            contextCards: cards?.success ? cards.data : [],
            followUps: followUps?.success ? followUps.data : get().followUps,
            suggestedActions: actions?.success ? actions.data : get().suggestedActions,
            intelStatus: 'success',
          });
        } catch {
          set({ intelStatus: 'error' });
        }
      },

      loadTemplates: async () => {
        try {
          const response = await getChatService().getConversationTemplates();
          if (response.success) set({ templates: response.data });
        } catch {
          set({ templates: [] });
        }
      },

      startFromTemplate: async (templateId) => {
        set({ status: 'loading', error: null });
        try {
          const response = await getChatService().startFromTemplate(templateId, getUserId());
          if (!response.success) {
            throw response.error ?? new Error('Failed to start template');
          }
          const conversation = response.data;
          set((state) => ({
            conversations: [...state.conversations.filter((c) => c.id !== conversation.id), conversation],
            activeConversationId: conversation.id,
            activeModeId: conversation.modeId,
            messages: [],
            status: 'empty',
            error: null,
          }));
          get().syncServiceState();
          // Kick off with template starter via send after empty greeting UX
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ status: resolved.status, error: resolved.error });
        }
      },

      dismissEscalation: () => set({ escalation: null }),

      deleteConversation: async (conversationId) => {
        try {
          await getChatService().deleteConversation(conversationId);
          set((state) => ({
            conversations: state.conversations.filter((item) => item.id !== conversationId),
            messages: state.activeConversationId === conversationId ? [] : state.messages,
            activeConversationId:
              state.activeConversationId === conversationId ? null : state.activeConversationId,
          }));
          get().syncServiceState();
        } catch (error) {
          const resolved = resolveActionError(error);
          set({ error: resolved.error });
          throw resolved.error;
        }
      },
    }),
    {
      name: STORAGE_KEYS.chat,
      storage: asyncStorage,
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        activeModeId: state.activeModeId,
        modes: state.modes,
      }),
      onRehydrateStorage: () => (state) => {
        state?.syncServiceState();
      },
    },
  ),
);

export const waitForChatHydration = () =>
  new Promise<void>((resolve) => {
    if (useChatStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useChatStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
