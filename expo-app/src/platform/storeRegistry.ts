/**
 * Zustand store registry — Sprint 16 audit.
 * Prefer domain-scoped stores; avoid giant omni-stores.
 *
 * Auth / session: authStore, sessionExperienceStore
 * Care: moodStore, journalStore, wellnessStore, chatStore
 * Marketplace: therapistStore, bookingStore, sessionStore, paymentStore, billingStore
 * Social/comms: notificationStore
 * Identity: profileStore, onboardingStore, preferencesStore
 * Platform: networkStore, offlineQueueStore, uiStore, uiStateStore, appConfigStore
 * Discovery: searchStore
 * Personalization: personalizationStore, engagementStore, institutionStore
 * AI companion: chatStore (conversation intelligence + streaming)
 */

export const STORE_REGISTRY = [
  { name: 'authStore', domain: 'auth', path: 'store/authStore.ts' },
  { name: 'onboardingStore', domain: 'auth', path: 'store/onboardingStore.ts' },
  { name: 'profileStore', domain: 'profile', path: 'store/profileStore.ts' },
  { name: 'preferencesStore', domain: 'settings', path: 'store/preferencesStore.ts' },
  { name: 'chatStore', domain: 'chat', path: 'store/chatStore.ts' },
  { name: 'moodStore', domain: 'mood', path: 'store/moodStore.ts' },
  { name: 'journalStore', domain: 'journal', path: 'store/journalStore.ts' },
  { name: 'wellnessStore', domain: 'wellness', path: 'store/wellnessStore.ts' },
  { name: 'therapistStore', domain: 'therapist', path: 'store/therapistStore.ts' },
  { name: 'bookingStore', domain: 'therapist', path: 'store/bookingStore.ts' },
  { name: 'sessionStore', domain: 'therapist', path: 'store/sessionStore.ts' },
  { name: 'sessionExperienceStore', domain: 'therapist', path: 'store/sessionExperienceStore.ts' },
  { name: 'paymentStore', domain: 'billing', path: 'store/paymentStore.ts' },
  { name: 'billingStore', domain: 'billing', path: 'store/billingStore.ts' },
  { name: 'notificationStore', domain: 'notifications', path: 'store/notificationStore.ts' },
  { name: 'searchStore', domain: 'search', path: 'store/searchStore.ts' },
  { name: 'personalizationStore', domain: 'personalization', path: 'store/personalizationStore.ts' },
  { name: 'engagementStore', domain: 'engagement', path: 'store/engagementStore.ts' },
  { name: 'institutionStore', domain: 'institution', path: 'store/institutionStore.ts' },
  { name: 'reportsStore', domain: 'reports', path: 'store/reportsStore.ts' },
  { name: 'familyStore', domain: 'family', path: 'store/familyStore.ts' },
  { name: 'communityStore', domain: 'community', path: 'store/communityStore.ts' },
  { name: 'portalStore', domain: 'portal', path: 'store/portalStore.ts' },
  { name: 'devToolsStore', domain: 'devtools', path: 'store/devToolsStore.ts' },
  { name: 'networkStore', domain: 'platform', path: 'store/networkStore.ts' },
  { name: 'offlineQueueStore', domain: 'platform', path: 'store/offlineQueueStore.ts' },
  { name: 'uiStore', domain: 'platform', path: 'store/uiStore.ts' },
  { name: 'uiStateStore', domain: 'platform', path: 'store/uiStateStore.ts' },
  { name: 'appConfigStore', domain: 'platform', path: 'store/appConfigStore.ts' },
] as const;

export type RegisteredStoreName = (typeof STORE_REGISTRY)[number]['name'];
