import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENTLY_VIEWED_KEY = '@heyattrangi/therapists-recently-viewed';

export async function loadRecentlyViewedIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveRecentlyViewedIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));
}
