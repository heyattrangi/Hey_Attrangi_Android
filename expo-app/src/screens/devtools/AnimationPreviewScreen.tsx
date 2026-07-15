import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Animated, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { GallerySection, ShowcaseChip } from '../../components/devtools';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius, Motion } from '../../app/design-system';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AnimationPreview'>;
};

export const AnimationPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const reduce = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [preset, setPreset] = useState<keyof typeof Motion.presets>('fade');

  useEffect(() => {
    if (reduce) {
      opacity.setValue(1);
      scale.setValue(1);
      return;
    }
    const duration = Motion.presets[preset].duration;
    opacity.setValue(0.2);
    scale.setValue(0.92);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [preset, reduce, opacity, scale]);

  const replay = () => {
    void hapticSelection();
    setPreset((p) => p);
    opacity.setValue(0.2);
    scale.setValue(0.92);
    if (reduce) {
      opacity.setValue(1);
      scale.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: Motion.presets[preset].duration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: Motion.presets[preset].duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Animation Preview"
        subtitle="Motion tokens"
        onBack={() => navigation.goBack()}
      />
      {reduce ? (
        <Text style={styles.hint}>Reduce Motion is on — demos snap.</Text>
      ) : null}
      <View style={styles.chips}>
        {(Object.keys(Motion.presets) as Array<keyof typeof Motion.presets>).map(
          (key) => (
            <ShowcaseChip
              key={key}
              label={key}
              selected={preset === key}
              onPress={() => setPreset(key)}
            />
          ),
        )}
      </View>
      <Pressable onPress={replay}>
        <Animated.View
          style={[
            styles.stage,
            { opacity, transform: [{ scale }] },
          ]}
        >
          <Text style={styles.stageText}>Tap to replay · {preset}</Text>
          <Text style={styles.stageSub}>
            {Motion.presets[preset].duration}ms · {Motion.presets[preset].easing}
          </Text>
        </Animated.View>
      </Pressable>
      <GallerySection title="Durations">
        {Object.entries(Motion.duration).map(([key, ms]) => (
          <AppCard key={key} style={styles.card}>
            <Text style={styles.label}>{key}</Text>
            <Text style={styles.sub}>{ms} ms</Text>
          </AppCard>
        ))}
      </GallerySection>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hint: {
    ...Typography.caption,
    color: Colors.warning,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  stage: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    alignItems: 'center',
  },
  stageText: {
    ...Typography.title,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  stageSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: { marginBottom: Spacing.sm },
  label: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sub: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
