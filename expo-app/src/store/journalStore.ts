import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import { JOURNAL_TEMPLATES, mockJournalEntries } from '../mocks/mockJournal';
import {
  JournalEntry,
  JournalStats,
  JournalTemplate,
  JournalTemplateId,
} from '../types/domain';

interface JournalState {
  entries: JournalEntry[];
  templates: JournalTemplate[];
  autosaveLabel: string | null;
  getStats: () => JournalStats;
  getDraft: () => JournalEntry | null;
  getEntry: (id: string) => JournalEntry | undefined;
  saveEntry: (
    input: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'dateLabel'> & {
      id?: string;
    },
  ) => JournalEntry;
  deleteEntry: (id: string) => void;
  setAutosaveLabel: (label: string | null) => void;
}

const computeStreak = (entries: JournalEntry[]) => {
  const days = new Set(
    entries
      .filter((e) => !e.isDraft)
      .map((e) => e.createdAt.slice(0, 10)),
  );
  const sorted = [...days].sort().reverse();
  if (!sorted.length) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Date(sorted[i - 1]);
    const cur = new Date(sorted[i]);
    const diff = (prev.getTime() - cur.getTime()) / (24 * 60 * 60 * 1000);
    if (diff === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else run = 1;
  }

  let current = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const key = (d: Date) => d.toISOString().slice(0, 10);
  if (!days.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(key(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, longest: Math.max(longest, current) };
};

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: mockJournalEntries,
      templates: JOURNAL_TEMPLATES,
      autosaveLabel: null,

      getStats: () => {
        const entries = get().entries;
        const published = entries.filter((e) => !e.isDraft);
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const streak = computeStreak(entries);
        return {
          totalEntries: published.length,
          drafts: entries.filter((e) => e.isDraft).length,
          writingStreak: streak.current,
          longestStreak: streak.longest,
          thisWeek: published.filter(
            (e) => new Date(e.createdAt).getTime() >= weekAgo,
          ).length,
        };
      },

      getDraft: () => get().entries.find((e) => e.isDraft) ?? null,

      getEntry: (id) => get().entries.find((e) => e.id === id),

      saveEntry: (input) => {
        const now = new Date();
        const existing = input.id ? get().getEntry(input.id) : undefined;
        const entry: JournalEntry = {
          title: input.title,
          body: input.body,
          moodId: input.moodId,
          moodLabel: input.moodLabel,
          emotionTags: input.emotionTags,
          gratitude: input.gratitude,
          highlights: input.highlights,
          challenges: input.challenges,
          lessons: input.lessons,
          templateId: input.templateId as JournalTemplateId | null | undefined,
          isDraft: input.isDraft,
          hasVoiceNote: input.hasVoiceNote,
          hasPhoto: input.hasPhoto,
          aiReflection: input.aiReflection ?? null,
          id: existing?.id ?? `journal-${now.getTime()}`,
          createdAt: existing?.createdAt ?? now.toISOString(),
          updatedAt: now.toISOString(),
          dateLabel: now.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };
        set((state) => ({
          entries: [
            entry,
            ...state.entries.filter((e) => e.id !== entry.id),
          ],
          autosaveLabel: input.isDraft ? 'Draft saved' : 'Saved',
        }));
        return entry;
      },

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      setAutosaveLabel: (label) => set({ autosaveLabel: label }),
    }),
    {
      name: STORAGE_KEYS.journal,
      storage: asyncStorage,
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
);
