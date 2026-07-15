import { JournalEntry } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export class JournalRepository extends BaseRepository {
  async list(): Promise<JournalEntry[]> {
    const { data } = await this.http.get<{ items: JournalEntry[] }>(
      '/journal/entries',
    );
    return data.items ?? [];
  }

  async save(entry: Partial<JournalEntry>): Promise<JournalEntry> {
    const { data } = await this.http.post<JournalEntry>('/journal/entries', entry);
    return data;
  }
}

export const journalRepository = new JournalRepository();
