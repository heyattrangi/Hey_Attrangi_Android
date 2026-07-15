import { ApiResponse } from '../../types/api';
import {
  SearchDiscoveryBlock,
  SearchFilters,
  SearchHistoryEntry,
  SearchResultItem,
  SearchSuggestion,
} from '../../search/types';

/**
 * Universal search facade — Real* will call /search and /search/suggest APIs.
 */
export interface ISearchService {
  search(query: string): Promise<ApiResponse<SearchResultItem[]>>;
  suggest(query: string): Promise<ApiResponse<SearchSuggestion[]>>;
  getDiscovery(): Promise<ApiResponse<SearchDiscoveryBlock[]>>;
  getTrending(): Promise<ApiResponse<SearchSuggestion[]>>;
  getPopular(): Promise<ApiResponse<SearchSuggestion[]>>;
  /** Optional history sync — local-first for now */
  syncHistory?(entries: SearchHistoryEntry[]): Promise<ApiResponse<{ ok: boolean }>>;
}
