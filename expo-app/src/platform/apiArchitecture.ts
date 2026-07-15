/**
 * API layer architecture map (frontend-only).
 *
 * Layers (bottom → top):
 * 1. HttpClient (`network/createHttpClient`) — Fetch or MockAdapter
 * 2. Interceptors — auth, logging, error normalize, refresh
 * 3. Repositories — DTO ↔ domain mappers
 * 4. Services (I*Service) — Mock* | Real* via `services/container`
 * 5. Zustand stores — UI state + orchestration
 * 6. Screens — no direct HTTP
 *
 * DTOs live near repositories / `api/types`.
 * Domain models live in `types/domain`.
 * Mappers: `services/*\/\*Mappers.ts` and repository helpers.
 *
 * Newer modules (search, personalization, engagement, institution) are
 * service-first; repositories can be added when OpenAPI lands.
 */

export const API_LAYER = {
  client: 'src/network/createHttpClient.ts',
  mockAdapter: 'src/network/MockHttpAdapter.ts',
  repositories: 'src/repositories/',
  services: 'src/services/container.ts',
  errors: 'src/types/errors/',
  dtos: 'src/api/types/',
} as const;

export type ApiEnvironmentMode = 'mock' | 'real';

export function resolveApiMode(useMock: boolean): ApiEnvironmentMode {
  return useMock ? 'mock' : 'real';
}
