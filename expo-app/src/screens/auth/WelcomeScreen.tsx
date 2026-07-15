import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { IllustrationGlow } from '../../components/common/IllustrationGlow';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Motion } from '../../theme';
import { hapticLight } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

/** Design 2.png — Welcome to Aatrangi */
export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.03, {
        duration: Motion.duration.slow * 3,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <OnboardingContainer glowPosition="center">
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title="Welcome to Aatrangi!"
            subtitle="Your companion for mental wellness"
            centered
          />
        </Animated.View>

        <Animated.View style={[styles.illustrationWrapper, glowStyle]} entering={FadeIn.delay(120).duration(Motion.duration.slow)}>
          <IllustrationGlow
            headline="Your safe space starts here."
            description="Create your account to get personalized support and access to safety features."
          />
        </Animated.View>

        <Animated.View style={styles.footer} entering={FadeInUp.delay(200).duration(Motion.duration.normal)}>
          <PrimaryButton
            label="Get Started"
            onPress={() => navigation.navigate('SignUpBasic')}
            showArrow
          />
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable
              onPress={() => {
                void hapticLight();
                navigation.navigate('SignIn');
              }}
              hitSlop={8}
              accessibilityRole="link"
              accessibilityLabel="Log In"
            >
              <Text style={styles.loginLink}>Log In</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
  },
  illustrationWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: Spacing.sm,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  loginText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  loginLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
});
