import { successResponse, mockDelay } from '../../api/client';
import { JOURNAL_TEMPLATES, mockJournalEntries } from '../../mocks/mockJournal';
import { ApiResponse } from '../../types/api';
import {
  JournalEntry,
  JournalStats,
  JournalTemplate,
} from '../../types/domain';
import { IJournalService } from './IJournalService';

let entries: JournalEntry[] = mockJournalEntries.map((e) => ({ ...e }));

const computeStats = (list: JournalEntry[]): JournalStats => {
  const published = list.filter((e) => !e.isDraft);
  return {
    totalEntries: published.length,
    drafts: list.filter((e) => e.isDraft).length,
    writingStreak: 0,
    longestStreak: 0,
    thisWeek: published.length,
  };
};

export const mockJournalService: IJournalService = {
  async listEntries() {
    await mockDelay(null);
    return successResponse(entries.map((e) => ({ ...e })));
  },

  async saveEntry(input) {
    await mockDelay(null);
    const now = new Date().toISOString();
    if (input.id) {
      entries = entries.map((e) =>
        e.id === input.id
          ? {
              ...e,
              ...input,
              id: e.id,
              updatedAt: now,
              createdAt: e.createdAt,
              dateLabel: e.dateLabel,
            }
          : e,
      );
      return successResponse(entries.find((e) => e.id === input.id)!);
    }
    const created: JournalEntry = {
      id: `j_${Date.now()}`,
      title: input.title,
      body: input.body,
      moodId: input.moodId,
      moodLabel: input.moodLabel,
      emotionTags: input.emotionTags ?? [],
      gratitude: input.gratitude,
      highlights: input.highlights,
      challenges: input.challenges,
      lessons: input.lessons,
      templateId: input.templateId,
      isDraft: input.isDraft ?? false,
      createdAt: now,
      updatedAt: now,
      dateLabel: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
      aiReflection: input.aiReflection,
    };
    entries = [created, ...entries];
    return successResponse(created);
  },

  async deleteEntry(id) {
    await mockDelay(null);
    entries = entries.filter((e) => e.id !== id);
    return successResponse({ deleted: true });
  },

  async getTemplates(): Promise<ApiResponse<JournalTemplate[]>> {
    await mockDelay(null);
    return successResponse([...JOURNAL_TEMPLATES]);
  },

  async getStats(list) {
    await mockDelay(null);
    return successResponse(computeStats(list));
  },

  hydrate(next) {
    entries = next.map((e) => ({ ...e }));
  },
};
