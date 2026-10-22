import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android' && (UIManager as any).setLayoutAnimationEnabledExperimental) {
  (UIManager as any).setLayoutAnimationEnabledExperimental(true);
}

export interface KeyboardMetrics {
  /** Live keyboard height in px, read from the native event. 0 when hidden. */
  height: number;
  isVisible: boolean;
}

/**
 * Cross-platform keyboard height tracker.
 *
 * WHY THIS EXISTS:
 * KeyboardAvoidingView's "height" / "padding" behavior is a no-op on
 * Android unless a `behavior` prop is explicitly passed, and even when
 * passed it can be unreliable when `windowSoftInputMode` isn't set to
 * `adjustResize`/`adjustPan` correctly, or when edge-to-edge rendering is
 * enabled (both are common in current Expo/RN Android setups). Rather than
 * guessing which native mode is active, this hook reads the *real* keyboard
 * height directly from the native show/hide events and lets the screen
 * shrink its own layout above the keyboard in JS — which works
 * regardless of the native window configuration.
 *
 * iOS keeps using KeyboardAvoidingView's built-in "padding" behavior
 * (already correct per the reported bug, which is Android-only), so this
 * hook's `height` value is only consumed for Android layout math.
 */
export function useKeyboardHeight(): KeyboardMetrics {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // Android does not reliably fire "will" events (some OEM keyboards skip
    // them entirely); "did" events fire once the keyboard has finished
    // animating, which is the safest cross-device signal to resize off of.
    const showEventName = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleShow = (e: KeyboardEvent) => {
      if (Platform.OS === 'android') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setHeight(e.endCoordinates?.height ?? 0);
    };

    const handleHide = () => {
      if (Platform.OS === 'android') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setHeight(0);
    };

    const showSub = Keyboard.addListener(showEventName, handleShow);
    const hideSub = Keyboard.addListener(hideEventName, handleHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { height, isVisible: height > 0 };
}
