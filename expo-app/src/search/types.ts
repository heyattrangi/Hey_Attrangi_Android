/**
 * Universal Search architecture — frontend-ready for multi-domain APIs.
 * Domains marked "future" stay registered but return empty until backend exists.
 */

export type SearchDomain =
  | 'therapists'
  | 'ai'
  | 'mood'
  | 'journal'
  | 'sessions'
  | 'notifications'
  | 'wellness'
  | 'settings'
  /** @deprecated use `ai` */
  | 'aiHistory'
  | 'community'
  | 'articles'
  | 'courses'
  | 'institutions';

export type SearchSortBy = 'newest' | 'oldest' | 'alphabetical' | 'relevant';

export type SearchCategoryFilter =
  | 'all'
  | SearchDomain;

export interface SearchResultItem {
  id: string;
  domain: SearchDomain;
  title: string;
  subtitle?: string;
  meta?: string;
  /** ISO timestamp when available — used for sort/filter */
  createdAt?: string;
  /** Navigation hint for deep links / navigate() */
  route?: string;
  params?: Record<string, unknown>;
  /** Optional icon / avatar hint for cards */
  icon?: string;
  pinned?: boolean;
}

export interface SearchAdapter {
  domain: SearchDomain;
  label: string;
  /** Future / not yet searchable in UI chips */
  comingSoon?: boolean;
  search: (query: string) => Promise<SearchResultItem[]>;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  kind: 'recent' | 'trending' | 'history' | 'popular' | 'category';
  domain?: SearchDomain;
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  createdAt: string;
  pinned?: boolean;
}

export interface SearchFilters {
  category: SearchCategoryFilter;
  sortBy: SearchSortBy;
  /** Optional free-text therapist name filter */
  therapist?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchDiscoveryBlock {
  id: string;
  title: string;
  subtitle?: string;
  items: SearchResultItem[];
}

export type VoiceSearchPhase =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'cancelled';

export interface GroupedSearchResults {
  domain: SearchDomain;
  label: string;
  items: SearchResultItem[];
}

export const SEARCH_DOMAIN_META: Record<
  SearchDomain,
  { label: string; icon: string; chip: string }
> = {
  therapists: { label: 'Therapists', icon: 'account-group-outline', chip: 'Therapists' },
  ai: { label: 'AI Conversations', icon: 'robot-outline', chip: 'AI' },
  aiHistory: { label: 'AI Conversations', icon: 'robot-outline', chip: 'AI' },
  mood: { label: 'Mood', icon: 'emoticon-outline', chip: 'Mood' },
  journal: { label: 'Journal', icon: 'notebook-outline', chip: 'Journal' },
  sessions: { label: 'Sessions', icon: 'calendar-clock', chip: 'Sessions' },
  notifications: { label: 'Notifications', icon: 'bell-outline', chip: 'Notifications' },
  wellness: { label: 'Wellness', icon: 'leaf', chip: 'Wellness' },
  settings: { label: 'Settings', icon: 'cog-outline', chip: 'Settings' },
  community: { label: 'Community', icon: 'account-multiple-outline', chip: 'Community' },
  articles: { label: 'Articles', icon: 'newspaper-variant-outline', chip: 'Articles' },
  courses: { label: 'Courses', icon: 'school-outline', chip: 'Courses' },
  institutions: { label: 'Institutions', icon: 'domain', chip: 'Institutions' },
};

/** Primary chips shown before typing / for filter row */
export const PRIMARY_SEARCH_CHIPS: SearchDomain[] = [
  'therapists',
  'mood',
  'journal',
  'ai',
  'sessions',
  'settings',
  'notifications',
  'wellness',
];

export const FUTURE_SEARCH_DOMAINS: SearchDomain[] = [
  'community',
  'articles',
  'courses',
  'institutions',
];
