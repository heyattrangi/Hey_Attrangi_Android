import { mockDelay, successResponse } from '../../api/client';
import {
  mockDiscoveryBlocks,
  mockPopularCategories,
  mockSuggestedSearches,
  mockTrendingTopics,
} from '../../mocks/mockSearch';
import { searchAllDomains } from '../../search/registry';
import { SearchSuggestion } from '../../search/types';
import { ISearchService } from './ISearchService';

export class MockSearchService implements ISearchService {
  async search(query: string) {
    const data = await searchAllDomains(query);
    return mockDelay(successResponse(data), 280);
  }

  async suggest(query: string) {
    const q = query.trim().toLowerCase();
    const base: SearchSuggestion[] = [
      ...mockTrendingTopics,
      ...mockPopularCategories,
      ...mockSuggestedSearches.map((label, i) => ({
        id: `sug-${i}`,
        label,
        kind: 'popular' as const,
      })),
    ];
    const filtered = q
      ? base.filter((s) => s.label.toLowerCase().includes(q))
      : base.slice(0, 8);
    return mockDelay(successResponse(filtered), 120);
  }

  async getDiscovery() {
    return mockDelay(successResponse(mockDiscoveryBlocks.map((b) => ({ ...b }))));
  }

  async getTrending() {
    return mockDelay(successResponse(mockTrendingTopics.map((t) => ({ ...t }))));
  }

  async getPopular() {
    return mockDelay(
      successResponse(mockPopularCategories.map((t) => ({ ...t }))),
    );
  }
}

export const mockSearchService = new MockSearchService();
