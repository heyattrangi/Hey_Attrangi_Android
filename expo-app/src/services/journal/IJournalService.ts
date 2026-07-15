import { ApiResponse } from '../../types/api';
import { JournalEntry, JournalStats, JournalTemplate } from '../../types/domain';

export interface IJournalService {
  listEntries(): Promise<ApiResponse<JournalEntry[]>>;
  saveEntry(
    entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'dateLabel'> & {
      id?: string;
    },
  ): Promise<ApiResponse<JournalEntry>>;
  deleteEntry(id: string): Promise<ApiResponse<{ deleted: boolean }>>;
  getTemplates(): Promise<ApiResponse<JournalTemplate[]>>;
  getStats(entries: JournalEntry[]): Promise<ApiResponse<JournalStats>>;
  hydrate(entries: JournalEntry[]): void;
}
