import {
  AiChatMode,
  ChatMessage,
  ChatQuickReply,
  SuggestedPrompt,
} from '../../types/domain';

const ENGINE_SUGGESTIONS: ChatQuickReply[] = [
  { id: 'sug-1', label: 'Tell me more' },
  { id: 'sug-2', label: 'Yes' },
  { id: 'sug-3', label: 'Not exactly' },
  { id: 'sug-4', label: 'Help me calm down' },
  { id: 'sug-5', label: "I don't know" },
];

/**
 * Modes remain as data for the Conversation Engine / session routing.
 * They are NOT rendered as picker buttons inside the companion UI.
 */
export const AI_CHAT_MODES: AiChatMode[] = [
  { id: 'listen', title: 'Just Listen', subtitle: "I'm here to hear you rant." },
  {
    id: 'reflect',
    title: 'Reflect',
    subtitle: "I'll help you see patterns and clarify your thoughts.",
  },
  {
    id: 'think',
    title: 'Help me think',
    subtitle: "We'll brainstorm or untangle a problem together.",
  },
  { id: 'answer', title: 'Answer directly', subtitle: 'No fluff, just straight answers.' },
];

const SUGGESTED_PROMPTS: Record<string, SuggestedPrompt[]> = {
  listen: [
    { id: 'listen-1', modeId: 'listen', text: "I've had a rough day and need to vent." },
    { id: 'listen-2', modeId: 'listen', text: 'Can you just listen while I talk this out?' },
  ],
  reflect: [
    { id: 'reflect-1', modeId: 'reflect', text: 'Help me understand why I keep feeling this way.' },
    { id: 'reflect-2', modeId: 'reflect', text: 'What patterns do you notice in what I shared?' },
  ],
  think: [
    { id: 'think-1', modeId: 'think', text: 'Help me think through a decision I need to make.' },
    { id: 'think-2', modeId: 'think', text: "I'm stuck on a problem and need help untangling it." },
  ],
  answer: [
    { id: 'answer-1', modeId: 'answer', text: 'What are some quick ways to calm anxiety?' },
    { id: 'answer-2', modeId: 'answer', text: 'Give me a direct answer on how to set boundaries.' },
  ],
};

const WELCOME_MESSAGES: Record<string, string> = {
  listen: "Hey! I'm here to hear you rant. We can start whenever you're ready :)",
  reflect: "Hi — I'll help you reflect and find clarity. What's on your mind?",
  think: "Let's think this through together. What would you like help with?",
  answer: "Ask me anything — I'll give you a straight answer.",
};

export const EMPTY_AI_REPLY =
  "I'm here with you, but I didn't receive a full response. Please try again.";

export function buildSessionId(userId: string, modeId: string): string {
  return `patient_${userId}_${modeId}`;
}

export function mapAiReply(reply: string): ChatMessage {
  const text = reply.trim() || EMPTY_AI_REPLY;
  const stamp = Date.now();
  const lower = text.toLowerCase();
  const showCalmCard =
    lower.includes('anxious') ||
    lower.includes('overwhelm') ||
    lower.includes('calm') ||
    lower.includes('stress') ||
    lower.includes('sleep');

  return {
    id: `ai-${stamp}`,
    text,
    sender: 'ai',
    createdAt: new Date().toISOString(),
    // Frontend-ready: Conversation Engine will supply these dynamically.
    quickReplies: ENGINE_SUGGESTIONS.map((s, i) => ({
      ...s,
      id: `qr-${stamp}-${i}`,
    })),
    cards: showCalmCard
      ? [
          {
            id: `card-${stamp}-breath`,
            type: 'breathing',
            title: 'Breathing Exercise',
            subtitle: 'Box breathing · 2 minutes',
            body: 'Inhale 4 · hold 4 · exhale 4 · hold 4. Repeat gently until your body softens.',
            ctaLabel: 'Start exercise',
          },
          {
            id: `card-${stamp}-ground`,
            type: 'grounding',
            title: 'Grounding Exercise',
            subtitle: '5-4-3-2-1 senses',
            body: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.',
            ctaLabel: 'Try now',
          },
        ]
      : [
          {
            id: `card-${stamp}-reflect`,
            type: 'reflection',
            title: 'Reflection',
            subtitle: 'A gentle prompt',
            body: 'What feels most important about what you shared just now?',
            ctaLabel: 'Reflect',
          },
        ],
  };
}

export function createWelcomeMessage(modeId: string): ChatMessage {
  const text = WELCOME_MESSAGES[modeId] ?? "Hi! I'm here with you. How can I support you today?";
  return {
    id: `welcome-${modeId}`,
    text,
    sender: 'ai',
    createdAt: new Date().toISOString(),
  };
}

export function getSuggestedPromptsForMode(modeId: string): SuggestedPrompt[] {
  return (SUGGESTED_PROMPTS[modeId] ?? []).map((prompt) => ({ ...prompt }));
}

export function chatErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (normalized.includes('timeout') || normalized.includes('timed out')) {
    return 'The AI took too long to respond. Please try again.';
  }
  if (normalized.includes('network') || normalized.includes('offline')) {
    return 'You appear to be offline. Reconnect to continue chatting.';
  }
  if (normalized.includes('401') || normalized.includes('unauthorized') || normalized.includes('session')) {
    return 'Your session expired. Please sign in again.';
  }
  if (normalized.includes('429') || normalized.includes('rate limit') || normalized.includes('too many')) {
    return 'Too many messages in a short time. Please wait a moment and try again.';
  }
  if (normalized.includes('502') || normalized.includes('upstream') || normalized.includes('unavailable')) {
    return 'Pragya AI is temporarily unavailable. Please try again shortly.';
  }
  if (normalized.includes('invalid payload') || normalized.includes('empty')) {
    return 'Please enter a message before sending.';
  }

  return message || 'Something went wrong while sending your message.';
}
