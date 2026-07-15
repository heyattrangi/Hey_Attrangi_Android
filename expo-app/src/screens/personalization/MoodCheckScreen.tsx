import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { MoodGrid } from '../../components/personalization/MoodGrid';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useOnboardingStore } from '../../store/onboardingStore';
import { OnboardingStackParamList } from '../../navigation/types';
import { Spacing, Motion } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'MoodCheck'>;
};

/** Design 8.png — How are you feeling today? → Therapy (Figma order) */
export const MoodCheckScreen: React.FC<Props> = ({ navigation }) => {
  const { selectedMood, setField } = useOnboardingStore();

  const goNext = () => navigation.navigate('TherapyExperience');

  return (
    <OnboardingContainer onBackPress={() => navigation.goBack()}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title="How are you feeling today?"
            subtitle="Choose what suits your mood currently"
            centered
          />
        </Animated.View>

        <Animated.View
          style={styles.content}
          entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        >
          <MoodGrid
            selectedMoodId={selectedMood}
            onSelectMood={(moodId) => setField('selectedMood', moodId)}
          />
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(140).duration(Motion.duration.normal)}
        >
          <PrimaryButton
            label="Continue"
            onPress={goNext}
            showArrow
            disabled={!selectedMood}
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
    justifyContent: 'center',
  },
  footer: {
    width: '100%',
  },
});
