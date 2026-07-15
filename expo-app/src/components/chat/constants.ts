import {
  ChatQuickReply,
  ConversationContextChip,
  EmotionReactionOption,
  SuggestedPrompt,
} from '../../types/domain';

/** Spec conversation starters for empty companion state */
export const CONVERSATION_STARTERS: SuggestedPrompt[] = [
  { id: 'starter-1', text: 'I had a difficult day.' },
  { id: 'starter-2', text: 'I feel anxious.' },
  { id: 'starter-3', text: "I can't sleep." },
  { id: 'starter-4', text: 'I feel lonely.' },
  { id: 'starter-5', text: 'Help me reflect.' },
];

/** Default engine suggestion chips (backend will replace) */
export const DEFAULT_SUGGESTIONS: ChatQuickReply[] = [
  { id: 'sug-1', label: 'Tell me more' },
  { id: 'sug-2', label: 'Yes' },
  { id: 'sug-3', label: 'Not exactly' },
  { id: 'sug-4', label: 'Help me calm down' },
  { id: 'sug-5', label: "I don't know" },
];

export const EMOTION_REACTIONS: EmotionReactionOption[] = [
  { kind: 'helpful', label: 'Helpful', emoji: '😊' },
  { kind: 'resonated', label: 'Resonated', emoji: '❤️' },
  { kind: 'didnt_help', label: "Didn't help", emoji: '😔' },
];

/** Demo personalization chips — backend-ready placeholders */
export const DEMO_CONTEXT_CHIPS: ConversationContextChip[] = [
  { id: 'ctx-mood', kind: 'mood', label: 'Yesterday: anxious' },
  { id: 'ctx-journal', kind: 'journal', label: 'Journal: morning pages' },
  { id: 'ctx-session', kind: 'session', label: 'Session reminder' },
  { id: 'ctx-therapist', kind: 'therapist', label: 'Dr. Ananya · upcoming' },
];
