import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { Motion } from '../../app/design-system';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FadeInContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
}

/** Subtle fade-in when async content becomes ready. Respects reduce motion. */
export const FadeInContent: React.FC<FadeInContentProps> = ({
  children,
  style,
  duration = Motion.duration.normal,
}) => {
  const reduceMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [duration, opacity, reduceMotion]);

  if (reduceMotion) {
    return <View style={[styles.container, style]}>{children}</View>;
  }

  return (
    <Animated.View style={[styles.container, style, { opacity }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
