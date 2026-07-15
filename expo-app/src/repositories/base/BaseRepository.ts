import { HttpClient, getHttpClient } from '../../network';
import { CachePolicy } from '../../cache';

/**
 * Shared helpers for all repositories.
 * Swap HttpClient via DI without changing repository method signatures.
 */
export abstract class BaseRepository {
  constructor(protected readonly http: HttpClient = getHttpClient()) {}

  protected cacheTtl(ms: number = CachePolicy.short) {
    return { cacheTtlMs: ms };
  }
}
