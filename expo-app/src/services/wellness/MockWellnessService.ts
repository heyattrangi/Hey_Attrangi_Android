import { successResponse, mockDelay } from '../../api/client';
import { WELLNESS_MODULES } from '../../mocks/mockWellness';
import { ApiResponse } from '../../types/api';
import { WellnessModule } from '../../types/domain';
import { IWellnessService } from './IWellnessService';

export const mockWellnessService: IWellnessService = {
  async listModules(): Promise<ApiResponse<WellnessModule[]>> {
    await mockDelay(null);
    return successResponse(WELLNESS_MODULES.map((m) => ({ ...m })));
  },

  async getModule(id: string): Promise<ApiResponse<WellnessModule | null>> {
    await mockDelay(null);
    return successResponse(WELLNESS_MODULES.find((m) => m.id === id) ?? null);
  },
};
