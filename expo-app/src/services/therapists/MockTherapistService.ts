import { mockDelay, successResponse } from '../../api/client';
import { mockTherapists } from '../../mocks/mockTherapists';
import { Therapist } from '../../types/domain';
import { ITherapistService, TherapistFilters } from './ITherapistService';
import {
  loadRecentlyViewedIds,
  saveRecentlyViewedIds,
} from './localTherapistStorage';

let recentlyViewed: string[] = [];

function filterTherapists(
  query?: string,
  filters?: TherapistFilters,
): Therapist[] {
  const q = query?.trim().toLowerCase() ?? '';
  return mockTherapists.filter((t) => {
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.specialty.toLowerCase().includes(q) ||
      t.credentials.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      (t.languages ?? []).some((lang) => lang.toLowerCase().includes(q));

    const matchesSpecialty =
      !filters?.specialty ||
      t.specialty.toLowerCase().includes(filters.specialty.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(filters.specialty!.toLowerCase()));

    const matchesLanguage =
      !filters?.language ||
      (t.languages ?? []).some((lang) =>
        lang.toLowerCase().includes(filters.language!.toLowerCase()),
      );

    const matchesGender =
      !filters?.gender ||
      filters.gender === 'Any' ||
      t.gender === filters.gender;

    const matchesExperience =
      filters?.experienceMinYears == null ||
      (t.experienceYears ?? 0) >= filters.experienceMinYears;

    const matchesFeeMax =
      filters?.feeMax == null || t.priceValue <= filters.feeMax;
    const matchesFeeMin =
      filters?.feeMin == null || t.priceValue >= filters.feeMin;

    const matchesSessionType =
      !filters?.sessionType ||
      (t.sessionTypes ?? []).includes(filters.sessionType);

    const matchesRating =
      filters?.minRating == null || (t.rating ?? 0) >= filters.minRating;

    let matchesAvailability = true;
    if (filters?.availability === 'today') {
      matchesAvailability = Boolean(t.availableNow);
    } else if (filters?.availability === 'this_week') {
      if (!t.nextAvailableSlot) matchesAvailability = false;
      else {
        const diff = new Date(t.nextAvailableSlot).getTime() - Date.now();
        matchesAvailability = diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
      }
    }

    return (
      matchesQuery &&
      matchesSpecialty &&
      matchesLanguage &&
      matchesGender &&
      matchesExperience &&
      matchesFeeMax &&
      matchesFeeMin &&
      matchesSessionType &&
      matchesRating &&
      matchesAvailability
    );
  });
}

export class MockTherapistService implements ITherapistService {
  async getTherapists(query?: string, filters?: TherapistFilters) {
    return this.listTherapists(query, filters);
  }

  async listTherapists(query?: string, filters?: TherapistFilters) {
    const items = filterTherapists(query, filters).map((t) => ({ ...t }));
    return mockDelay(
      successResponse({
        items,
        page: 1,
        pageSize: items.length,
        total: items.length,
        hasMore: false,
      }),
    );
  }

  async searchTherapists(query: string, filters?: TherapistFilters) {
    return this.listTherapists(query, filters);
  }

  async getTherapist(id: string) {
    const therapist = mockTherapists.find((t) => t.id === id) ?? null;
    return mockDelay(successResponse(therapist ? { ...therapist } : null));
  }

  async getFeaturedTherapists() {
    return mockDelay(
      successResponse(mockTherapists.slice(0, 2).map((t) => ({ ...t }))),
    );
  }

  async getRecommendedTherapists() {
    return mockDelay(successResponse(mockTherapists.map((t) => ({ ...t }))));
  }

  async trackRecentlyViewed(id: string) {
    recentlyViewed = [id, ...recentlyViewed.filter((x) => x !== id)].slice(0, 10);
    await saveRecentlyViewedIds(recentlyViewed);
    return mockDelay(successResponse([...recentlyViewed]));
  }

  async getRecentlyViewed() {
    if (recentlyViewed.length === 0) {
      recentlyViewed = await loadRecentlyViewedIds();
    }
    return mockDelay(successResponse([...recentlyViewed]));
  }

  hydrateRecentlyViewed(ids: string[]) {
    recentlyViewed = [...ids];
  }
}

export const mockTherapistService = new MockTherapistService();
