import { ApiResponse } from '../../types/api';
import { WellnessModule } from '../../types/domain';

export interface IWellnessService {
  listModules(): Promise<ApiResponse<WellnessModule[]>>;
  getModule(id: string): Promise<ApiResponse<WellnessModule | null>>;
}
