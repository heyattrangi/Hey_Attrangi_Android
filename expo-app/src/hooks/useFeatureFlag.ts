import { FeatureFlagKey } from '../config/featureFlags';
import { useAppConfigStore } from '../store/appConfigStore';

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  return useAppConfigStore((s) => s.flags[key]);
}

export function useFeatureFlags() {
  return useAppConfigStore((s) => s.flags);
}
