import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { IllustrationGlow } from '../../components/common/IllustrationGlow';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAuthStore } from '../../store/authStore';
import { OnboardingStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Motion } from '../../theme';
import { hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'PersonalWelcome'>;
};

/** Design 7.png — Personalized welcome + Continue / Skip */
export const PersonalWelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { name } = useOnboardingStore();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const displayName = name.trim() || 'there';

  const goNext = () => navigation.navigate('MoodCheck');

  const handleSkipAll = () => {
    void hapticSuccess();
    completeOnboarding();
  };

  return (
    <OnboardingContainer glowPosition="center">
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title={`Welcome ${displayName}!`}
            subtitle="Your companion for mental wellness"
            centered
          />
        </Animated.View>

        <Animated.View
          style={styles.centerGlow}
          entering={FadeIn.delay(100).duration(Motion.duration.slow)}
        >
          <IllustrationGlow headline="This is a safe and private space for you." />
          <Text style={styles.prompt}>
            To understand you better, can I ask a few quick questions?
          </Text>
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(180).duration(Motion.duration.normal)}
        >
          <PrimaryButton label="Continue" onPress={goNext} showArrow />
          <PrimaryButton label="Skip" onPress={handleSkipAll} variant="outline" />
        </Animated.View>
      </View>
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  centerGlow: {
    flex: 1,
    justifyContent: 'center',
  },
  prompt: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    lineHeight: 22,
  },
  footer: {
    width: '100%',
    paddingBottom: Spacing.md,
  },
});
