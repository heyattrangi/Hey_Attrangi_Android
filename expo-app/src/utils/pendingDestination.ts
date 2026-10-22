/**
 * Pending Destination Manager
 * Stores and manages the target action URL when an unauthenticated guest user
 * taps a recommendation card in Guest Chat.
 *
 * Survives all authentication paths (Login, Sign-Up, OTP, Google Sign-In)
 * and Onboarding, and is restored when MainAppNavigator mounts.
 */

let pendingDestinationUrl: string | null = null;

export const pendingDestinationManager = {
  setPendingDestination(url: string | null | undefined): void {
    if (!url) return;
    pendingDestinationUrl = url;
    console.log('[PENDING DESTINATION] Set:', pendingDestinationUrl);
  },

  getPendingDestination(): string | null {
    return pendingDestinationUrl;
  },

  clearPendingDestination(): void {
    if (pendingDestinationUrl) {
      console.log('[PENDING DESTINATION] Cleared:', pendingDestinationUrl);
    }
    pendingDestinationUrl = null;
  },
};
