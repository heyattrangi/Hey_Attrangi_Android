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
      if (remote.length) {
        const mapped: JournalEntry[] = remote.map((t) => ({
          id: t.id,
          title: t.title || 'Journal Entry',
          body: t.content,
          emotionTags: t.tags || [],
          isDraft: false,
          createdAt: t.createdAt,
          updatedAt: t.createdAt,
          dateLabel: new Date(t.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        }));
        return successResponse(mapped);
      }
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
