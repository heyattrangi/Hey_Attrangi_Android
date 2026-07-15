import { ISearchService } from './ISearchService';
import { mockSearchService } from './MockSearchService';

/**
 * Real search — delegates to mock until /search APIs exist.
 */
export class RealSearchService implements ISearchService {
  search = mockSearchService.search.bind(mockSearchService);
  suggest = mockSearchService.suggest.bind(mockSearchService);
  getDiscovery = mockSearchService.getDiscovery.bind(mockSearchService);
  getTrending = mockSearchService.getTrending.bind(mockSearchService);
  getPopular = mockSearchService.getPopular.bind(mockSearchService);
}

export const realSearchService = new RealSearchService();
