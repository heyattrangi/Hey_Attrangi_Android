import { ApiResponse, PagedResponse } from '../../types/api';
import { SessionModality, Therapist, TherapistGender } from '../../types/domain';

export interface TherapistFilters {
  specialty?: string;
  language?: string;
  gender?: TherapistGender | 'Any';
  experienceMinYears?: number;
  feeMax?: number;
  feeMin?: number;
  availability?: 'any' | 'today' | 'this_week';
  sessionType?: SessionModality;
  minRating?: number;
}

export interface ITherapistService {
  getTherapists(query?: string, filters?: TherapistFilters): Promise<ApiResponse<PagedResponse<Therapist>>>;
  listTherapists(query?: string, filters?: TherapistFilters): Promise<ApiResponse<PagedResponse<Therapist>>>;
  searchTherapists(query: string, filters?: TherapistFilters): Promise<ApiResponse<PagedResponse<Therapist>>>;
  getTherapist(id: string): Promise<ApiResponse<Therapist | null>>;
  getFeaturedTherapists(): Promise<ApiResponse<Therapist[]>>;
  getRecommendedTherapists(): Promise<ApiResponse<Therapist[]>>;
  trackRecentlyViewed(id: string): Promise<ApiResponse<string[]>>;
  getRecentlyViewed(): Promise<ApiResponse<string[]>>;
  hydrateRecentlyViewed(ids: string[]): void;
}
