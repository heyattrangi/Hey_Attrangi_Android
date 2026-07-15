import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

const SIZE = 260;

interface IllustrationGlowProps {
  headline: string;
  description?: string;
}

export const IllustrationGlow: React.FC<IllustrationGlowProps> = ({
  headline,
  description,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.04,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glowWrap, { transform: [{ scale: scaleAnim }] }]}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <RadialGradient id="illustrationGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFD4A8" stopOpacity={0.75} />
              <Stop offset="40%" stopColor="#FFE8CC" stopOpacity={0.4} />
              <Stop offset="70%" stopColor="#FFF5E6" stopOpacity={0.15} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2} fill="url(#illustrationGlow)" />
        </Svg>
      </Animated.View>
      <View style={styles.content}>
        <Text style={styles.headline}>{headline}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 240,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  glowWrap: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    zIndex: 1,
    alignItems: 'center',
    maxWidth: Dimensions.get('window').width * 0.82,
  },
  headline: {
    ...Typography.accentHeading,
    color: Colors.primaryDark,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
});
