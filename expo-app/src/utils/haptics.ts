import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

/** Light tap — chips, toggles, selection */
export const hapticLight = async () => {
  if (!supported) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Device may not support haptics
  }
};

/** Medium tap — primary CTAs */
export const hapticMedium = async () => {
  if (!supported) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // no-op
  }
};

/** Success — OTP verified, password valid, registration done */
export const hapticSuccess = async () => {
  if (!supported) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // no-op
  }
};

/** Error — validation / OTP failure */
export const hapticError = async () => {
  if (!supported) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // no-op
  }
};

/** Soft selection change */
export const hapticSelection = async () => {
  if (!supported) return;
  try {
    await Haptics.selectionAsync();
  } catch {
    // no-op
  }
};
