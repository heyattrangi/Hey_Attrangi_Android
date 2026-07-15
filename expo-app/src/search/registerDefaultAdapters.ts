import { registerSearchAdapter } from './registry';
import { SearchResultItem } from './types';
import {
  buildAiSearchItems,
  buildJournalSearchItems,
  buildNotificationSearchItems,
  buildSessionSearchItems,
  buildTherapistSearchItems,
  mockMoodSearchItems,
  mockWellnessSearchItems,
} from '../mocks/mockSearch';

const filterLocal = (items: SearchResultItem[], query: string) => {
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.meta?.toLowerCase().includes(q),
  );
};

/**
 * Local adapters — swap bodies for API-backed search without UI changes.
 */
export function registerDefaultSearchAdapters(): void {
  registerSearchAdapter({
    domain: 'settings',
    label: 'Settings',
    search: async (query) => {
      const catalog: SearchResultItem[] = [
        {
          id: 'settings',
          domain: 'settings',
          title: 'Settings',
          subtitle: 'App preferences',
          route: 'Settings',
          icon: 'cog-outline',
        },
        {
          id: 'notifications-prefs',
          domain: 'settings',
          title: 'Notification Preferences',
          route: 'Notifications',
          icon: 'bell-outline',
        },
        {
          id: 'notification-center',
          domain: 'settings',
          title: 'Notification Center',
          route: 'NotificationCenter',
          icon: 'bell-ring-outline',
        },
        {
          id: 'appearance',
          domain: 'settings',
          title: 'Appearance',
          route: 'Appearance',
          icon: 'palette-outline',
        },
        {
          id: 'language',
          domain: 'settings',
          title: 'Language',
          route: 'Language',
          icon: 'translate',
        },
        {
          id: 'privacy',
          domain: 'settings',
          title: 'Privacy & Security',
          route: 'PrivacySecurity',
          icon: 'shield-outline',
        },
        {
          id: 'ai-companion',
          domain: 'settings',
          title: 'AI Companion Settings',
          route: 'AiCompanionSettings',
          icon: 'robot-outline',
        },
        {
          id: 'billing',
          domain: 'settings',
          title: 'Billing & Subscription',
          route: 'BillingInvoices',
          icon: 'credit-card-outline',
        },
        {
          id: 'care-credits',
          domain: 'settings',
          title: 'Care Credits',
          route: 'CareCredits',
          icon: 'wallet-outline',
        },
        {
          id: 'help',
          domain: 'settings',
          title: 'Help Center',
          route: 'HelpCenter',
          icon: 'help-circle-outline',
        },
      ];
      return filterLocal(catalog, query);
    },
  });

  registerSearchAdapter({
    domain: 'therapists',
    label: 'Therapists',
    search: async (query) => filterLocal(buildTherapistSearchItems(), query),
  });

  registerSearchAdapter({
    domain: 'journal',
    label: 'Journal',
    search: async (query) => filterLocal(buildJournalSearchItems(), query),
  });

  registerSearchAdapter({
    domain: 'mood',
    label: 'Mood',
    search: async (query) => filterLocal(mockMoodSearchItems, query),
  });

  registerSearchAdapter({
    domain: 'sessions',
    label: 'Sessions',
    search: async (query) => filterLocal(buildSessionSearchItems(), query),
  });

  registerSearchAdapter({
    domain: 'ai',
    label: 'AI Conversations',
    search: async (query) => filterLocal(buildAiSearchItems(), query),
  });

  registerSearchAdapter({
    domain: 'aiHistory',
    label: 'AI History',
    search: async (query) => filterLocal(buildAiSearchItems(), query),
  });

  registerSearchAdapter({
    domain: 'notifications',
    label: 'Notifications',
    search: async (query) =>
      filterLocal(buildNotificationSearchItems(), query),
  });

  registerSearchAdapter({
    domain: 'wellness',
    label: 'Wellness',
    search: async (query) => filterLocal(mockWellnessSearchItems, query),
  });

  // Future domains — registered, empty until APIs exist
  (['community', 'articles', 'courses', 'institutions'] as const).forEach(
    (domain) => {
      registerSearchAdapter({
        domain,
        label: domain.charAt(0).toUpperCase() + domain.slice(1),
        comingSoon: true,
        search: async () => [],
      });
    },
  );
}
