import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { wellnessRepository } from '../../repositories';
import { ApiResponse } from '../../types/api';
import { WellnessModule } from '../../types/domain';
import { IWellnessService } from './IWellnessService';
import { mockWellnessService } from './MockWellnessService';

export class RealWellnessService implements IWellnessService {
  async listModules(): Promise<ApiResponse<WellnessModule[]>> {
    try {
      const remote = await wellnessRepository.listModules();
      if (remote.length) return successResponse(remote);
      return mockWellnessService.listModules();
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  getModule(id: string) {
    return mockWellnessService.getModule(id);
  }
}

export const realWellnessService = new RealWellnessService();
