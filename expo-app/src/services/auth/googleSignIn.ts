import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { env } from '../../config/env';
import { ValidationError, UnknownError } from '../../types/errors';

let configured = false;

WebBrowser.maybeCompleteAuthSession();

export function configureGoogleSignIn(): void {
  if (configured) return;
  const webClientId = env.GOOGLE_CLIENT_ID;
  const iosClientId = env.GOOGLE_IOS_CLIENT_ID || undefined;
  const webClientIdPresent = Boolean(webClientId);
  const iosClientIdPresent = Boolean(iosClientId);
  console.log(
    `[AUTH][GOOGLE][CONFIG] googleWebClientIdPresent=${webClientIdPresent} googleIosClientIdPresent=${iosClientIdPresent} platform=${Platform.OS}`
  );
  if (webClientId || iosClientId) {
    GoogleSignin.configure({
      webClientId,
      iosClientId,
      offlineAccess: false,
    });
    configured = true;
  }
}

export function isGoogleSignInConfigured(): boolean {
  return configured;
}

export interface GoogleSignInResult {
  idToken: string;
  email?: string;
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  if (env.USE_MOCK_SERVICES) {
    configured = true;
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { idToken: 'mock-google-id-token', email: 'user@example.com' };
  }

  configureGoogleSignIn();

  try {
    if (Platform.OS === 'android') {
      console.log('[AUTH][GOOGLE][START] Attempting Google Sign-In via Native Play Services...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    } else {
      console.log('[AUTH][GOOGLE][START] Attempting Google Sign-In via Native iOS SDK...');
    }
    const response = await GoogleSignin.signIn();

    const idToken = response.data?.idToken ?? (response as any)?.idToken;
    const email = response.data?.user?.email ?? (response as any)?.user?.email;

    console.log(
      `[AUTH][GOOGLE][RESULT] idTokenPresent=${Boolean(idToken)} emailPresent=${Boolean(email)} platform=${Platform.OS}`
    );

    if (!idToken) {
      throw new ValidationError('Google Sign-In failed to retrieve ID token.');
    }
    return { idToken, email };
  } catch (error: any) {
    console.log(
      `[AUTH][GOOGLE][ERROR] code=${error?.code ?? 'unknown'} message=${error?.message ?? String(error)} platform=${Platform.OS}`
    );
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new ValidationError('Google Sign-In was cancelled.');
    } else if (error?.code === statusCodes.IN_PROGRESS) {
      throw new ValidationError('Google Sign-In is already in progress.');
    } else if (Platform.OS === 'android' && error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
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
