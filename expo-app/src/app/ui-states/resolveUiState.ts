import { isAsyncLoading } from '../../types/api';
import { EMPTY_KIND_TO_STATE, getUiStateDefinition, LOADING_DOMAIN_ASSET } from './catalog';
import {
  ResolveUiStateInput,
  UiStateDefinition,
  UiStateKey,
} from './types';

/**
 * Maps backend/API RequestStatus + error semantics → Design UI state.
 * Screens must not hardcode which empty/error view to show.
 */
export const resolveUiStateKey = (input: ResolveUiStateInput): UiStateKey => {
  const {
    status,
    error,
    emptyKind,
    searchActive = false,
    hasCachedData = false,
    preferSkeleton = false,
  } = input;

  if (isAsyncLoading(status)) {
    return preferSkeleton ? 'skeleton' : 'loading';
  }

  if (status === 'offline' && !hasCachedData) {
    return 'error.internet';
  }

  if (status === 'error' && !hasCachedData) {
    if (error?.code === 'NETWORK_ERROR') {
      return 'error.internet';
    }
    if (error?.code === 'UNAUTHORIZED' || error?.statusCode === 401) {
      return 'error.sessionExpired';
    }
    if (error?.statusCode && error.statusCode >= 500) {
      return 'error.server';
    }
    return 'error.generic';
  }

  if (status === 'empty') {
    if (searchActive || emptyKind === 'searchResults') {
      return 'empty.searchResults';
    }
    if (emptyKind) {
      return EMPTY_KIND_TO_STATE[emptyKind];
    }
    return 'empty.therapists';
  }

  // Offline/error with cached data → still show content
  return 'content';
};

export const resolveUiStateDefinition = (
  input: ResolveUiStateInput,
): UiStateDefinition => {
  const key = resolveUiStateKey(input);
  const def = getUiStateDefinition(key);

  if (key === 'loading') {
    const domain = input.loadingDomain ?? 'default';
    return {
      ...def,
      illustration: LOADING_DOMAIN_ASSET[domain],
    };
  }

  return def;
};

export const isBlockingUiState = (key: UiStateKey): boolean =>
  key !== 'content';
