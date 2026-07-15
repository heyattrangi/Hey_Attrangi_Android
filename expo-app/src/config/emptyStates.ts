import { EmptyKind } from '../app/ui-states';

/**
 * Maps feature areas → Design empty kinds.
 * Screens pass `emptyKind` into AsyncStateRenderer / UiStateManager — never hardcode copy.
 */
export const emptyKinds = {
  therapists: 'therapists' as EmptyKind,
  therapistsSearch: 'searchResults' as EmptyKind,
  sessions: 'sessions' as EmptyKind,
  moodHistory: 'moodHistory' as EmptyKind,
  invoices: 'invoices' as EmptyKind,
  chat: 'chatHistory' as EmptyKind,
  notifications: 'notifications' as EmptyKind,
  credits: 'careCredits' as EmptyKind,
  careCredits: 'careCredits' as EmptyKind,
};

/** @deprecated Use emptyKinds + UiStateManager. Kept for transitional imports. */
export const emptyStates = {
  therapists: { title: 'No therapists found' },
  therapistsInitial: { title: 'No therapists found' },
  sessions: { title: 'No sessions scheduled yet' },
  moodHistory: { title: 'No mood history found' },
  invoices: { title: 'No invoices' },
  devices: { title: 'No devices connected' },
  chat: { title: 'No chat history' },
  notifications: { title: 'No notifications' },
  credits: { title: 'No care credits' },
};
