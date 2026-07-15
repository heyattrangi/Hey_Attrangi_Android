import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { therapistRepository } from '../../repositories';
import { ApiResponse, PagedResponse } from '../../types/api';
import { Therapist } from '../../types/domain';
import { ITherapistService, TherapistFilters } from './ITherapistService';
import { mockTherapistService } from './MockTherapistService';

export class RealTherapistService implements ITherapistService {
  async getTherapists(
    query?: string,
    _filters?: TherapistFilters,
  ): Promise<ApiResponse<PagedResponse<Therapist>>> {
    try {
      const data = await therapistRepository.list(query);
      if (Array.isArray(data)) {
        return successResponse({
          items: data,
          page: 1,
          pageSize: data.length,
          total: data.length,
          hasMore: false,
        });
      }
      return successResponse(data);
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  listTherapists(query?: string, filters?: TherapistFilters) {
    return this.getTherapists(query, filters);
  }

  searchTherapists(query: string, filters?: TherapistFilters) {
    return this.getTherapists(query, filters);
  }

  async getTherapist(id: string): Promise<ApiResponse<Therapist | null>> {
    try {
      return successResponse(await therapistRepository.getById(id));
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  getFeaturedTherapists = mockTherapistService.getFeaturedTherapists.bind(mockTherapistService);
  getRecommendedTherapists = mockTherapistService.getRecommendedTherapists.bind(
    mockTherapistService,
  );
  trackRecentlyViewed = mockTherapistService.trackRecentlyViewed.bind(mockTherapistService);
  getRecentlyViewed = mockTherapistService.getRecentlyViewed.bind(mockTherapistService);
  hydrateRecentlyViewed = mockTherapistService.hydrateRecentlyViewed.bind(mockTherapistService);
}

export const realTherapistService = new RealTherapistService();
