import { authMiddleware } from '../../auth';
import { useAuthStore } from '../../store/authStore';

export type GuardResult =
  | { allowed: true }
  | { allowed: false; reason: 'unauthenticated' | 'onboarding_required' };

/**
 * Imperative route guards — use from navigation listeners or screen mounts.
 */
export async function requireAuth(): Promise<GuardResult> {
  const ok = await authMiddleware.isAuthenticated();
  if (ok) return { allowed: true };

  // Fall back to Zustand flags (mock login path)
  const { isAuthenticated } = useAuthStore.getState();
  return isAuthenticated
    ? { allowed: true }
    : { allowed: false, reason: 'unauthenticated' };
}

export async function requireOnboardingComplete(): Promise<GuardResult> {
  const auth = await requireAuth();
  if (!auth.allowed) return auth;

  const { hasCompletedOnboarding } = useAuthStore.getState();
  return hasCompletedOnboarding
    ? { allowed: true }
    : { allowed: false, reason: 'onboarding_required' };
}

export function canAccessMainApp(): boolean {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore.getState();
  return isAuthenticated && hasCompletedOnboarding;
}
