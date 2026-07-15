import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'heyattrangi.accessToken';
const REFRESH_KEY = 'heyattrangi.refreshToken';

export async function saveAuthTokenSecure(token: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, token);
}

export async function getAuthTokenSecure(): Promise<string | null> {
  try {
    return (await SecureStore.getItemAsync(ACCESS_KEY)) ?? null;
  } catch {
    return null;
  }
}

export async function clearAuthTokenSecure(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
  } catch {
    // No-op when nothing was stored.
  }
}

export async function saveRefreshTokenSecure(token: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_KEY, token);
}

export async function getRefreshTokenSecure(): Promise<string | null> {
  try {
    return (await SecureStore.getItemAsync(REFRESH_KEY)) ?? null;
  } catch {
    return null;
  }
}

export async function clearRefreshTokenSecure(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } catch {
    // No-op
  }
}

export async function clearAllTokensSecure(): Promise<void> {
  await Promise.all([clearAuthTokenSecure(), clearRefreshTokenSecure()]);
}
