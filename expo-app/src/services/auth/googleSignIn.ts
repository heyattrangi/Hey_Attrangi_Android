/**
 * Google Sign-In stub for Expo Go (native Google Sign-In SDK is not available).
 * Returns a mock idToken so the mock auth service can complete the flow.
 */
import { ValidationError } from '../../types/errors';

let configured = false;

export function configureGoogleSignIn(): void {
  configured = true;
}

export function isGoogleSignInConfigured(): boolean {
  return configured;
}

export async function signInWithGoogle(): Promise<string> {
  configureGoogleSignIn();
  // Simulate a short delay then return a mock token for MockAuthService.
  await new Promise((resolve) => setTimeout(resolve, 400));
  return 'mock-google-id-token';
}

export async function signOutFromGoogle(): Promise<void> {
  // No-op in mock Expo build.
}

export function cancelGoogleSignIn(): void {
  throw new ValidationError('Google Sign-In was cancelled.');
}
