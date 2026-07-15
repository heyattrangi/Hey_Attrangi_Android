import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { journalRepository } from '../../repositories';
import { ApiResponse } from '../../types/api';
import { JournalEntry } from '../../types/domain';
import { IJournalService } from './IJournalService';
import { mockJournalService } from './MockJournalService';

export class RealJournalService implements IJournalService {
  async listEntries(): Promise<ApiResponse<JournalEntry[]>> {
    try {
      const remote = await journalRepository.list();
      if (remote.length) return successResponse(remote);
      return mockJournalService.listEntries();
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  saveEntry = mockJournalService.saveEntry.bind(mockJournalService);
  deleteEntry = mockJournalService.deleteEntry.bind(mockJournalService);
  getTemplates = mockJournalService.getTemplates.bind(mockJournalService);
  getStats = mockJournalService.getStats.bind(mockJournalService);
  hydrate = mockJournalService.hydrate.bind(mockJournalService);
}

export const realJournalService = new RealJournalService();
