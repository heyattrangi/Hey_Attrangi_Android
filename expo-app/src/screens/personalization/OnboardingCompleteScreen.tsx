import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAuthStore } from '../../store/authStore';
import { OnboardingStackParamList } from '../../navigation/types';
import { Spacing, Motion } from '../../theme';
import { hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'OnboardingComplete'>;
};

/** Design 11.png — Thanks for sharing / Welcome to Aatrangi → Home */
export const OnboardingCompleteScreen: React.FC<Props> = ({ navigation }) => {
  const { name } = useOnboardingStore();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const displayName = name.trim() || 'there';

  const handleFinish = () => {
    void hapticSuccess();
    completeOnboarding();
  };

  return (
    <OnboardingContainer
      onBackPress={() => navigation.goBack()}
      glowPosition="center"
    >
      <View style={styles.container}>
        <Animated.View
          style={styles.centerContent}
          entering={FadeIn.duration(Motion.duration.slow)}
        >
          <ScreenHeader
            title={`Thanks for sharing ${displayName}!`}
            subtitle="We're here with you"
            centered
          />
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(160).duration(Motion.duration.normal)}
        >
          <PrimaryButton label="Welcome to Aatrangi" onPress={handleFinish} />
        </Animated.View>
      </View>
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    width: '100%',
    paddingBottom: Spacing.lg,
  },
});
