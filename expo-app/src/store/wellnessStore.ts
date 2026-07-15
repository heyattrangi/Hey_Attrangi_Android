import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from '../persistence/storage';
import { STORAGE_KEYS } from '../persistence/storageKeys';
import {
  AFFIRMATIONS,
  BREATHING_EXERCISES,
  MEDITATION_SESSIONS,
  WELLNESS_MODULES,
  WELLNESS_RECOMMENDATIONS,
} from '../mocks/mockWellness';
import {
  Affirmation,
  BreathingExercise,
  MeditationSession,
  WellnessModule,
  WellnessProgress,
  WellnessRecommendation,
} from '../types/domain';

interface WellnessState {
  modules: WellnessModule[];
  breathing: BreathingExercise[];
  meditations: MeditationSession[];
  affirmations: Affirmation[];
  recommendations: WellnessRecommendation[];
  favoriteModuleIds: string[];
  favoriteAffirmationIds: string[];
  recentModuleIds: string[];
  completedMeditationIds: string[];
  breathingSessions: number;
  meditationSessions: number;
  toggleFavoriteModule: (id: string) => void;
  toggleFavoriteAffirmation: (id: string) => void;
  markRecent: (id: string) => void;
  completeMeditation: (id: string) => void;
  recordBreathingSession: () => void;
  getProgress: (journalEntryCount: number) => WellnessProgress;
}

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set, get) => ({
      modules: WELLNESS_MODULES,
      breathing: BREATHING_EXERCISES,
      meditations: MEDITATION_SESSIONS,
      affirmations: AFFIRMATIONS,
      recommendations: WELLNESS_RECOMMENDATIONS,
      favoriteModuleIds: [],
      favoriteAffirmationIds: [],
      recentModuleIds: [],
      completedMeditationIds: MEDITATION_SESSIONS.filter((m) => m.completed).map(
        (m) => m.id,
      ),
      breathingSessions: 2,
      meditationSessions: 1,

      toggleFavoriteModule: (id) =>
        set((state) => ({
          favoriteModuleIds: state.favoriteModuleIds.includes(id)
            ? state.favoriteModuleIds.filter((x) => x !== id)
            : [...state.favoriteModuleIds, id],
        })),

      toggleFavoriteAffirmation: (id) =>
        set((state) => ({
          favoriteAffirmationIds: state.favoriteAffirmationIds.includes(id)
            ? state.favoriteAffirmationIds.filter((x) => x !== id)
            : [...state.favoriteAffirmationIds, id],
        })),

      markRecent: (id) =>
        set((state) => ({
          recentModuleIds: [
            id,
            ...state.recentModuleIds.filter((x) => x !== id),
          ].slice(0, 8),
        })),

      completeMeditation: (id) =>
        set((state) => ({
          completedMeditationIds: state.completedMeditationIds.includes(id)
            ? state.completedMeditationIds
            : [...state.completedMeditationIds, id],
          meditationSessions: state.meditationSessions + 1,
        })),

      recordBreathingSession: () =>
        set((state) => ({
          breathingSessions: state.breathingSessions + 1,
        })),

      getProgress: (journalEntryCount) => {
        const state = get();
        const sessionsCompleted =
          state.breathingSessions + state.meditationSessions;
        return {
          sessionsCompleted,
          journalEntries: journalEntryCount,
          breathingStreak: Math.min(state.breathingSessions, 7),
          meditationStreak: Math.min(state.meditationSessions, 7),
          reflectionStreak: Math.min(journalEntryCount, 7),
          achievements: [
            {
              id: 'a1',
              label: 'First breath',
              achieved: state.breathingSessions >= 1,
              target: 1,
            },
            {
              id: 'a2',
              label: '5 wellness sessions',
              achieved: sessionsCompleted >= 5,
              target: 5,
            },
            {
              id: 'a3',
              label: '3 journal entries',
              achieved: journalEntryCount >= 3,
              target: 3,
            },
            {
              id: 'a4',
              label: 'Meditation explorer',
              achieved: state.completedMeditationIds.length >= 2,
              target: 2,
            },
          ],
        };
      },
    }),
    {
      name: STORAGE_KEYS.wellness,
      storage: asyncStorage,
      partialize: (state) => ({
        favoriteModuleIds: state.favoriteModuleIds,
        favoriteAffirmationIds: state.favoriteAffirmationIds,
        recentModuleIds: state.recentModuleIds,
        completedMeditationIds: state.completedMeditationIds,
        breathingSessions: state.breathingSessions,
        meditationSessions: state.meditationSessions,
      }),
    },
  ),
);
