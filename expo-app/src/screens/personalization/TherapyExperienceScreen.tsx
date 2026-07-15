import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { TherapyOption } from '../../components/personalization/TherapyOption';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useOnboardingStore } from '../../store/onboardingStore';
import { OnboardingStackParamList } from '../../navigation/types';
import { Spacing, Motion } from '../../theme';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'TherapyExperience'>;
};

/** Design 9.png — 3 experience options + Skip */
const THERAPY_OPTIONS = [
  {
    id: 'beginner' as const,
    title: 'Just Getting Started',
    subtitle: 'First time trying therapy',
  },
  {
    id: 'some' as const,
    title: 'Some experience',
    subtitle: 'Been to a few sessions before',
  },
  {
    id: 'veteran' as const,
    title: 'Veteran',
    subtitle: 'Regular therapy Participant',
  },
];

export const TherapyExperienceScreen: React.FC<Props> = ({ navigation }) => {
  const { therapyExperience, setField } = useOnboardingStore();

  const goNext = () => navigation.navigate('ReasonTags');

  return (
    <OnboardingContainer onBackPress={() => navigation.goBack()}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title="What is your experience level with therapy"
            centered
          />
        </Animated.View>

        <Animated.View
          style={styles.content}
          entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        >
          {THERAPY_OPTIONS.map((option) => (
            <TherapyOption
              key={option.id}
              title={option.title}
              subtitle={option.subtitle}
              selected={therapyExperience === option.id}
              onPress={() => {
                void hapticSelection();
                setField('therapyExperience', option.id);
              }}
            />
          ))}
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(140).duration(Motion.duration.normal)}
        >
          <PrimaryButton
            label="Continue"
            onPress={goNext}
            showArrow
            disabled={!therapyExperience}
          />
          <PrimaryButton label="Skip" onPress={goNext} variant="outline" />
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
  content: {
    flex: 1,
    marginTop: Spacing.lg,
  },
  footer: {
    width: '100%',
  },
});
