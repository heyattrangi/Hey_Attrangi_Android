import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { env } from '../../config/env';
import { ValidationError, UnknownError } from '../../types/errors';

let configured = false;

export function configureGoogleSignIn(): void {
  if (configured) return;
  const webClientId = env.GOOGLE_CLIENT_ID;
  if (webClientId) {
    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
    });
    configured = true;
  }
}

export function isGoogleSignInConfigured(): boolean {
  return configured;
}

export async function signInWithGoogle(): Promise<string> {
  if (env.USE_MOCK_SERVICES) {
    configured = true;
    await new Promise((resolve) => setTimeout(resolve, 400));
    return 'mock-google-id-token';
  }

  configureGoogleSignIn();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    const idToken = response.data?.idToken ?? (response as any)?.idToken;
    if (!idToken) {
      throw new ValidationError('Google Sign-In failed to retrieve ID token.');
    }
    return idToken;
  } catch (error: any) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new ValidationError('Google Sign-In was cancelled.');
    } else if (error?.code === statusCodes.IN_PROGRESS) {
      throw new ValidationError('Google Sign-In is already in progress.');
    } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new ValidationError('Google Play Services are not available or updated.');
    } else if (error instanceof ValidationError) {
      throw error;
    } else {
      throw new UnknownError(error?.message ?? 'Google Sign-In failed.');
    }
  }
}

export async function signOutFromGoogle(): Promise<void> {
  if (env.USE_MOCK_SERVICES) return;
  try {
    if (configured) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Ignore sign-out failures defensively.
  }
}

export function cancelGoogleSignIn(): void {
  throw new ValidationError('Google Sign-In was cancelled.');
}
