import type { AppEnvironment } from '../../config/env';
import { mockDevToolsService } from './MockDevToolsService';
import { IDevToolsService } from './IDevToolsService';

/**
 * Real* currently delegates to mock — wire telemetry / Flipper later.
 */
export class RealDevToolsService implements IDevToolsService {
  getSnapshot(flagsEnabledCount: number) {
    return mockDevToolsService.getSnapshot(flagsEnabledCount);
  }

  getPerfMetrics(tick?: number) {
    return mockDevToolsService.getPerfMetrics(tick);
  }

  setMockApiEnabled(enabled: boolean) {
    return mockDevToolsService.setMockApiEnabled(enabled);
  }

  setPreferredEnv(preferred: AppEnvironment) {
    return mockDevToolsService.setPreferredEnv(preferred);
  }
}

export const realDevToolsService = new RealDevToolsService();
