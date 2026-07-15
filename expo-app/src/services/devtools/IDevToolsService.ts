import { ApiResponse } from '../../types/api';
import {
  DevPerfMetric,
  DevToolsSnapshot,
} from '../../types/domain';
import type { AppEnvironment } from '../../config/env';

/**
 * Developer Experience facade — Real* can stream live metrics later.
 */
export interface IDevToolsService {
  getSnapshot(flagsEnabledCount: number): Promise<ApiResponse<DevToolsSnapshot>>;
  getPerfMetrics(tick?: number): Promise<ApiResponse<DevPerfMetric[]>>;
  setMockApiEnabled(enabled: boolean): Promise<ApiResponse<{ enabled: boolean }>>;
  setPreferredEnv(
    preferred: AppEnvironment,
  ): Promise<ApiResponse<{ preferred: AppEnvironment }>>;
}
