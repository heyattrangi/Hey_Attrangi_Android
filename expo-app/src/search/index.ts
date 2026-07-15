export type {
  SearchDomain,
  SearchResultItem,
  SearchAdapter,
  SearchSuggestion,
  SearchHistoryEntry,
  SearchFilters,
  SearchDiscoveryBlock,
  VoiceSearchPhase,
  GroupedSearchResults,
  SearchSortBy,
} from './types';

export {
  SEARCH_DOMAIN_META,
  PRIMARY_SEARCH_CHIPS,
  FUTURE_SEARCH_DOMAINS,
} from './types';

export {
  registerSearchAdapter,
  getSearchAdapter,
  listSearchAdapters,
  searchAllDomains,
  applySearchFilters,
  groupSearchResults,
  buildLiveSuggestions,
} from './registry';

export { registerDefaultSearchAdapters } from './registerDefaultAdapters';
