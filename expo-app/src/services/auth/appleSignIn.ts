import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { env } from '../../config/env';
import { ValidationError, UnknownError } from '../../types/errors';

export interface AppleSignInResult {
  identityToken: string;
  rawNonce: string;
  email?: string;
  user: string;
  fullName?: {
    givenName?: string | null;
    familyName?: string | null;
  };
}

/**
 * Generates a cryptographically secure random raw nonce and its SHA-256 hash.
 */
async function generateNonce(): Promise<{ rawNonce: string; hashedNonce: string }> {
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  const rawNonce = Array.from(randomBytes)
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('');

  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  return { rawNonce, hashedNonce };
}

export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function signInWithApple(): Promise<AppleSignInResult> {
  if (env.USE_MOCK_SERVICES) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      identityToken: 'mock-apple-identity-token',
      rawNonce: 'mock-raw-nonce',
      user: 'mock.apple.user.sub',
      email: 'user@example.com',
      fullName: { givenName: 'Test', familyName: 'User' },
    };
  }

  if (Platform.OS !== 'ios') {
    throw new ValidationError('Sign in with Apple is only supported on iOS devices.');
  }

  const isAvailable = await isAppleSignInAvailable();
  if (!isAvailable) {
    if (__DEV__) {
      console.log('[AUTH][APPLE][DEV_MOCK] Apple Sign-In native capability unavailable (Personal Team dev build) — returning dev mock.');
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        identityToken: 'mock-apple-identity-token',
        rawNonce: 'mock-raw-nonce',
        user: 'mock.apple.user.sub',
        email: 'apple.user@example.com',
        fullName: { givenName: 'Apple', familyName: 'User' },
      };
    }
    throw new ValidationError('Sign in with Apple is not available on this device.');
  }

  try {
    const { rawNonce, hashedNonce } = await generateNonce();
    console.log('[AUTH][APPLE][START] Attempting Apple Sign-In with hashed nonce...');

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    const identityToken = credential.identityToken;
    const user = credential.user;

    console.log(
      `[AUTH][APPLE][RESULT] identityTokenPresent=${Boolean(identityToken)} userSubPresent=${Boolean(user)} emailPresent=${Boolean(credential.email)}`,
    );

    if (!identityToken) {
      throw new ValidationError('Sign in with Apple failed to retrieve identity token.');
    }

    return {
      identityToken,
      rawNonce,
      user,
      email: credential.email ?? undefined,
      fullName: credential.fullName
        ? {
            givenName: credential.fullName.givenName,
            familyName: credential.fullName.familyName,
          }
        : undefined,
    };
  } catch (error: any) {
    console.log(
      `[AUTH][APPLE][ERROR] code=${error?.code ?? 'unknown'} message=${error?.message ?? String(error)}`,
    );
    if (__DEV__ && (error?.code === 'ERR_REQUEST_FAILED' || error?.message?.includes('entitlement') || error?.message?.includes('not supported') || error?.message?.includes('available'))) {
      console.log('[AUTH][APPLE][DEV_MOCK] Apple Sign-In native error in dev mode — returning dev mock.');
      return {
        identityToken: 'mock-apple-identity-token',
        rawNonce: 'mock-raw-nonce',
        user: 'mock.apple.user.sub',
        email: 'apple.user@example.com',
        fullName: { givenName: 'Apple', familyName: 'User' },
      };
    }
    if (error?.code === 'ERR_REQUEST_CANCELED' || error?.code === 'ERR_CANCELED') {
      throw new ValidationError('Sign in with Apple was cancelled.');
    } else if (error instanceof ValidationError) {
      throw error;
    } else {
      throw new UnknownError(error?.message ?? 'Sign in with Apple failed.');
    }
  }
}
