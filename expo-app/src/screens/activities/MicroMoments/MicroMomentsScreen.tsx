import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  ZoomIn,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { AppScreen } from '../../../components/app';
import { Icon } from '../../../components/app/Icon';
import { ActivityCompletionScreen } from '../../../components/activities/ActivityCompletionScreen';
import { MainStackParamList } from '../../../navigation/types';
import { Spacing } from '../../../design-system';
import { hapticLight, hapticSelection, hapticSuccess } from '../../../utils/haptics';
import { wellnessRepository } from '../../../repositories/WellnessRepository';
import { CLOUDINARY_ACTIVITIES_ASSETS } from '../../../data/cloudinaryExploreAssets';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'MicroMomentsExercise'>;

interface MovementStep {
  id: string;
  title: string;
  categoryTag: string;
  instruction: string;
  iconName: string;
}

const MICRO_MOVEMENT_STEPS: MovementStep[] = [
  {
    id: 'feet',
    title: 'Feet Grounding',
    categoryTag: 'STEP 1 OF 5',
    instruction:
      'Press your feet gently onto the floor. Slowly shift your weight from one foot to another, or lift one heel at a time. Just notice the small change.',
    iconName: 'shoe-print',
  },
  {
    id: 'shoulders',
    title: 'Shoulders & Neck',
    categoryTag: 'STEP 2 OF 5',
    instruction:
      'Roll your shoulders slowly forward, then back. Gently tilt your head side to side. Nothing should strain. Keep it light.',
    iconName: 'reload',
  },
  {
    id: 'hands',
    title: 'Hands & Palms',
    categoryTag: 'STEP 3 OF 5',
    instruction:
      'Open your hands wide, then slowly close them into a loose fist. Repeat a few times, noticing the sensation in your fingers and palms.',
    iconName: 'hand-pointing-up',
  },
  {
    id: 'waist',
    title: 'Waist Sway',
    categoryTag: 'STEP 4 OF 5',
    instruction:
      'Let your body sway gently side to side from the waist, like a soft pendulum. Keep the movement small and easy.',
    iconName: 'sine-wave',
  },
  {
    id: 'breath',
    title: 'Breath Awareness',
    categoryTag: 'STEP 5 OF 5',
    instruction:
      'Place one hand on your heart and one hand on your belly. Notice the rise and fall of your breath under your palm. Stay here for a few slow breaths.',
    iconName: 'heart-outline',
  },
];

interface MicroMomentsScreenProps {
  navigation: NavigationProp;
}

type ScreenMode = 'intro' | 'runner' | 'complete';

export const MicroMomentsScreen: React.FC<MicroMomentsScreenProps> = ({ navigation }) => {
  const [mode, setMode] = useState<ScreenMode>('intro');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());

  // Continuous animation shared values
  const motionVal = useSharedValue(0);

  useEffect(() => {
    if (mode === 'runner') {
      motionVal.value = 0;
      motionVal.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    }
  }, [currentStepIdx, mode, motionVal]);

  const activeStep = MICRO_MOVEMENT_STEPS[currentStepIdx];

  // Motion animation styles for visual movement cues
  const animatedVisualProps = useAnimatedStyle(() => {
    if (activeStep.id === 'feet') {
      return {
        transform: [{ translateX: (motionVal.value - 0.5) * 20 }],
      };
    }
    if (activeStep.id === 'shoulders') {
      return {
        transform: [{ rotate: `${(motionVal.value - 0.5) * 15}deg` }],
      };
    }
    if (activeStep.id === 'hands') {
      return {
        transform: [{ scale: 0.9 + motionVal.value * 0.2 }],
      };
    }
    if (activeStep.id === 'waist') {
      return {
        transform: [{ rotate: `${(motionVal.value - 0.5) * 12}deg` }],
      };
    }
    // Breath rise & fall
    return {
      transform: [{ scale: 0.95 + motionVal.value * 0.12 }],
    };
  });

  const handleBegin = () => {
    void hapticSelection();
    setMode('runner');
    setCurrentStepIdx(0);
  };

  const handleBackStep = useCallback(() => {
    if (currentStepIdx > 0) {
      void hapticLight();
      setCurrentStepIdx((prev) => prev - 1);
    } else {
      setMode('intro');
    }
  }, [currentStepIdx]);

  const handleExitToExplore = useCallback(() => {
    (navigation as any).navigate('MainTabs', { screen: 'ExploreTab' });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (mode === 'runner') {
          handleBackStep();
        } else {
          handleExitToExplore();
        }
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [mode, handleBackStep, handleExitToExplore]),
  );

  const handleNextStep = async () => {
    if (currentStepIdx < MICRO_MOVEMENT_STEPS.length - 1) {
      void hapticSelection();
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      // Completed all 5 movement steps -> log backend once
      void hapticSuccess();
      setMode('complete');

      const elapsedSec = Math.max(60, Math.round((Date.now() - startTime) / 1000));
      await wellnessRepository.logActivity('micro-movement', elapsedSec);
    }
  };

  // COMPLETE STATE
  if (mode === 'complete') {
    return (
      <ActivityCompletionScreen
        title="Activity completed"
        message="You took a moment for yourself today. You've brought quiet awareness and gentle movement back to your body."
        actionLabel="Done"
        onAction={handleExitToExplore}
      />
    );
  }

  // RUNNER STATE (5 STEPS)
  if (mode === 'runner') {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        {/* Runner Header */}
        <View style={styles.runnerHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBackStep}>
            <Icon name="chevron-left" size={20} color="#4B5563" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Micro Movement</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.runnerContainer}>
          {/* Progress Indicator (1 of 5) */}
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {currentStepIdx + 1} of {MICRO_MOVEMENT_STEPS.length}
            </Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((currentStepIdx + 1) / MICRO_MOVEMENT_STEPS.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Movement Visual Animation Card */}
          <Animated.View key={currentStepIdx} entering={FadeIn.duration(300)} style={styles.movementCard}>
            <View style={styles.animationCircleWrapper}>
              <Animated.View style={[styles.motionBubble, animatedVisualProps]}>
                <Icon name={activeStep.iconName} size={48} color="#9333EA" />
              </Animated.View>
            </View>

            <Text style={styles.stepTag}>{activeStep.categoryTag}</Text>
            <Text style={styles.movementTitle}>{activeStep.title}</Text>
            <Text style={styles.instructionText}>{activeStep.instruction}</Text>
          </Animated.View>

          {/* Safety Notice Banner */}
          <View style={styles.safetyBanner}>
            <Icon name="shield" size={16} color="#9333EA" />
            <Text style={styles.safetyBannerText}>
              Keep movements gentle and comfortable. Stop if anything feels painful.
            </Text>
          </View>

          {/* Navigation Row */}
          <View style={styles.navRow}>
            <TouchableOpacity
              style={[styles.secondaryBtn, currentStepIdx === 0 && styles.disabledBtn]}
              onPress={handleBackStep}
              disabled={currentStepIdx === 0}
            >
              <Text style={[styles.secondaryBtnText, currentStepIdx === 0 && styles.disabledBtnText]}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleNextStep}>
              <Text style={styles.primaryBtnText}>
                {currentStepIdx === MICRO_MOVEMENT_STEPS.length - 1 ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </AppScreen>
    );
  }

  // INTRO STATE
  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.introContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={handleExitToExplore}>
          <Icon name="chevron-left" size={20} color="#4B5563" />
          <Text style={styles.backText}>Activities</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.introVisualCircle}>
            <Image
              source={{ uri: CLOUDINARY_ACTIVITIES_ASSETS['micro-movement'] }}
              style={{ width: 68, height: 68 }}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.introTitle}>Micro Movement</Text>
          <Text style={styles.introSubtitle}>
            Tiny, gentle movements to reconnect with your body.
          </Text>

          <Text style={styles.introParagraph}>
            Small, easy movements you can do almost anywhere. A way to reconnect with your body through soft stretches and shifts, without strain or pressure.
          </Text>

          {/* Safety Note */}
          <View style={styles.safetyBox}>
            <Text style={styles.safetyBoxTitle}>SAFETY NOTE</Text>
            <Text style={styles.safetyBoxText}>
              Keep movements gentle and comfortable. Stop if anything feels painful or uncomfortable.
            </Text>
          </View>

          <TouchableOpacity style={styles.beginCtaBtn} onPress={handleBegin} activeOpacity={0.88}>
            <Text style={styles.beginCtaText}>Begin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  introContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  introVisualCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(147, 51, 234, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  introTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9333EA',
    marginBottom: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  introParagraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  safetyBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  safetyBoxTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9333EA',
    letterSpacing: 1,
    marginBottom: 4,
  },
  safetyBoxText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  beginCtaBtn: {
    backgroundColor: '#9333EA',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  beginCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Runner Styles */
  runnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  runnerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9333EA',
    borderRadius: 4,
  },
  movementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  animationCircleWrapper: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  motionBubble: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(147, 51, 234, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9333EA',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  movementTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 15,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 22,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(147, 51, 234, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 24,
  },
  safetyBannerText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 16,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  disabledBtn: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  disabledBtnText: {
    color: '#94A3B8',
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#9333EA',
    borderRadius: 16,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
