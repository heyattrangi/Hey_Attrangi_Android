/**
 * Central mapper barrel — DTO ↔ domain.
 * Prefer these imports from repositories; keep feature mappers as source of truth.
 */
export {
  mapAuthResponse,
  mapAuthUser,
  mapTherapist,
  mapMoodEntry,
  mapMoodInputToBackend,
  mapAiReply,
  mapSession,
} from '../../api/mappers';

export { mapBackendSession } from '../../services/sessions/sessionMappers';
export { mapBackendUserToPersonalInfo } from '../../services/profile/profileMappers';
