import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingContainer } from '../../components/common/OnboardingContainer';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { TagCloud } from '../../components/personalization/TagCloud';
import { OrDivider } from '../../components/common/OrDivider';
import { CustomTagInput } from '../../components/personalization/CustomTagInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useOnboardingStore } from '../../store/onboardingStore';
import { OnboardingStackParamList } from '../../navigation/types';
import { Spacing, Motion } from '../../theme';
import { hapticSelection } from '../../utils/haptics';

const DEFAULT_TAGS = [
  'Burnout',
  'Overwhelm',
  'Anxiety',
  'Stress',
  'Loneliness',
  'Feeling stuck',
  'Sleep issues',
  'Low focus',
  'Academic pressure',
  'Overthinking',
  'Depression',
  'Social fatigue',
  'Social anxiety',
  'Career uncertainty',
];

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'ReasonTags'>;
};

/** Design 10.png — What brings you here? */
export const ReasonTagsScreen: React.FC<Props> = ({ navigation }) => {
  const { selectedReasons, customTags, setField } = useOnboardingStore();
  const [allTags, setAllTags] = useState<string[]>(DEFAULT_TAGS);

  const goNext = () => navigation.navigate('OnboardingComplete');

  const handleToggleTag = (tag: string) => {
    void hapticSelection();
    const isSelected = selectedReasons.includes(tag);
    const newSelected = isSelected
      ? selectedReasons.filter((t) => t !== tag)
      : [...selectedReasons, tag];
    setField('selectedReasons', newSelected);
  };

  const handleAddCustomTag = (newTag: string) => {
    if (newTag && !allTags.includes(newTag)) {
      void hapticSelection();
      setAllTags([...allTags, newTag]);
      setField('selectedReasons', [...selectedReasons, newTag]);
      setField('customTags', [...customTags, newTag]);
    }
  };

  return (
    <OnboardingContainer onBackPress={() => navigation.goBack()}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(Motion.duration.normal)}>
          <ScreenHeader
            title="What brings you here?"
            subtitle="Select all that apply"
            centered
          />
        </Animated.View>

        <Animated.View
          style={styles.content}
          entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        >
          <TagCloud
            tags={allTags}
            selectedTags={selectedReasons}
            onToggleTag={handleToggleTag}
          />

          <OrDivider />

          <CustomTagInput onAddTag={handleAddCustomTag} />
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(140).duration(Motion.duration.normal)}
        >
          <PrimaryButton
            label="Continue"
            onPress={goNext}
            showArrow
            disabled={selectedReasons.length === 0}
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
    marginTop: Spacing.sm,
  },
  footer: {
    width: '100%',
  },
});
