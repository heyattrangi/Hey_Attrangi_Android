export { NetworkManager } from './NetworkManager';
export { LoadingManager } from './LoadingManager';
export { ErrorManager, useErrorManagerStore } from './ErrorManager';
export type { ErrorCategory, GlobalErrorRecord } from './ErrorManager';
export {
  SessionManagerFacade,
  useSessionPlatformStore,
} from './SessionManagerFacade';
export {
  PermissionManager,
  usePermissionStore,
} from './PermissionManager';
export type {
  DevicePermissionKind,
  PermissionDecision,
} from './PermissionManager';
export { SecurityManager } from './SecurityManager';
export { OfflineCache } from './OfflineCache';
export type { OfflineCacheDomain } from './OfflineCache';
export { Performance } from './Performance';
export { API_LAYER, resolveApiMode } from './apiArchitecture';
export { STORE_REGISTRY } from './storeRegistry';
export type { RegisteredStoreName } from './storeRegistry';
