import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, Image } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Motion, Radius } from '../../app/design-system';
import { RadialGradientBackground } from '../../components/ui/RadialGradientBackground';
import { APP_NAME, APP_VERSION } from '../../constants/appMeta';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'>;
};

/** In-app brand splash — native Expo splash uses assets/splash-icon.png */
export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const scale = useSharedValue(0.96);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.02, {
        duration: Motion.duration.slower,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(1, { duration: Motion.duration.normal }),
    );

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigation, scale]);

  const brandStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <RadialGradientBackground preset="centerWarm" />
      <Animated.View
        entering={FadeIn.duration(Motion.duration.slow)}
        style={[styles.hero, brandStyle]}
      >
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.icon}
          accessibilityIgnoresInvertColors
          accessibilityLabel={`${APP_NAME} app icon`}
        />
        <Animated.Text
          entering={FadeIn.delay(80).duration(Motion.duration.slow)}
          style={styles.brand}
          accessibilityRole="header"
        >
          {APP_NAME}
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(140).duration(Motion.duration.slow)}
          style={styles.tagline}
        >
          Your companion for mental wellness
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(200).duration(Motion.duration.slow)}
          style={styles.version}
          accessibilityLabel={`Version ${APP_VERSION}`}
        >
          Version {APP_VERSION}
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  hero: {
    alignItems: 'center',
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: Radius.xxlarge,
    marginBottom: Spacing.lg,
  },
  brand: {
    ...Typography.display,
    color: Colors.primaryDark,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  version: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});
