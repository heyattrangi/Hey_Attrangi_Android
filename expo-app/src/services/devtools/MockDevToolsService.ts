import { mockDelay, successResponse } from '../../api/client';
import {
  buildDevToolsSnapshot,
  buildPerfMetrics,
} from '../../mocks/mockDevTools';
import {
  setMockServicesOverride,
  setPreferredEnvOverride,
} from '../../config/devRuntime';
import type { AppEnvironment } from '../../config/env';
import { resetHttpClient } from '../../network';
import { IDevToolsService } from './IDevToolsService';

export class MockDevToolsService implements IDevToolsService {
  async getSnapshot(flagsEnabledCount: number) {
    return mockDelay(
      successResponse(buildDevToolsSnapshot(flagsEnabledCount)),
      120,
    );
  }

  async getPerfMetrics(tick = 0) {
    return mockDelay(successResponse(buildPerfMetrics(tick)), 40);
  }

  async setMockApiEnabled(enabled: boolean) {
    setMockServicesOverride(enabled);
    resetHttpClient();
    return mockDelay(successResponse({ enabled }), 80);
  }

  async setPreferredEnv(preferred: AppEnvironment) {
    setPreferredEnvOverride(preferred);
    resetHttpClient();
    return mockDelay(successResponse({ preferred }), 80);
  }
}

export const mockDevToolsService = new MockDevToolsService();
