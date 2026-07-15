import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Motion } from '../app/design-system';
import { usePreferencesStore } from '../store/preferencesStore';

/**
 * Combines OS Reduce Motion + Appearance preference.
 * Use for animation durations / skip decorative motion.
 */
export function useReducedMotion(): boolean {
  const prefReduce = usePreferencesStore((s) => s.appearance.reduceMotion);
  const [osReduce, setOsReduce] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (mounted) setOsReduce(v);
      })
      .catch(() => undefined);

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setOsReduce,
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return prefReduce || osReduce;
}

/** Motion durations that collapse to 0 when reduce-motion is on */
export function useMotionDuration(
  key: keyof typeof Motion.duration = 'normal',
): number {
  const reduce = useReducedMotion();
  if (reduce) return 0;
  return Motion.duration[key];
}
