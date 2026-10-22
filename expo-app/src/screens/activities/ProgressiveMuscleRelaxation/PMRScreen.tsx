import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
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

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'PMRExercise'>;

interface PMRStep {
  id: string;
  label: string;
  tenseInstruction: string;
  releaseInstruction: string;
  tenseSeconds: number;
  releaseSeconds: number;
  tenseIcon: string;
  releaseIcon: string;
}

const PMR_STEPS: PMRStep[] = [
  {
    id: 'feet',
    label: 'Feet',
    tenseInstruction: 'Curl your toes tightly and tense your feet.',
    releaseInstruction: 'Let your feet go completely loose. Notice the difference.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'shoe-print',
    releaseIcon: 'human-handsdown',
  },
  {
    id: 'calves',
    label: 'Calves',
    tenseInstruction: 'Point your toes up towards you, tightening your calves.',
    releaseInstruction: 'Let your calves fully relax and soften.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'lightning-bolt',
    releaseIcon: 'leaf',
  },
  {
    id: 'thighs',
    label: 'Thighs & Glutes',
    tenseInstruction: 'Squeeze your thighs and glutes firmly for a moment.',
    releaseInstruction: 'Release and let them soften into ease.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'arm-flex',
    releaseIcon: 'feather',
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    tenseInstruction: 'Tighten your belly and core muscles.',
    releaseInstruction: 'Let your stomach loosen completely. Feel it rise and fall gently.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'atom',
    releaseIcon: 'weather-windy',
  },
  {
    id: 'hands',
    label: 'Hands & Forearms',
    tenseInstruction: 'Make soft fists and tense your forearms.',
    releaseInstruction: 'Open your fingers wide and let all tension drop.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'hand-back-right',
    releaseIcon: 'hand-pointing-up',
  },
  {
    id: 'arms',
    label: 'Upper Arms',
    tenseInstruction: 'Bend your elbows and tense your biceps.',
    releaseInstruction: 'Let your arms drop heavy and completely relaxed.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'arm-flex',
    releaseIcon: 'arm-flex-outline',
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    tenseInstruction: 'Lift your shoulders up toward your ears.',
    releaseInstruction: 'Drop them down and let all shoulder tension melt away.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'arrow-up-bold-circle',
    releaseIcon: 'arrow-down-bold-circle-outline',
  },
  {
    id: 'neck',
    label: 'Neck',
    tenseInstruction: 'Gently press your head back or tilt your chin down to feel neck tension.',
    releaseInstruction: 'Release your neck and let your head rest comfortably.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'swap-vertical-bold',
    releaseIcon: 'check-circle-outline',
  },
  {
    id: 'face',
    label: 'Face & Jaw',
    tenseInstruction: 'Scrunch your facial muscles and tighten your jaw gently.',
    releaseInstruction: 'Release your forehead, eyes, and unclench your jaw.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'emoticon-neutral-outline',
    releaseIcon: 'emoticon-happy-outline',
  },
  {
    id: 'whole',
    label: 'Whole Body Rest',
    tenseInstruction: 'Bring light awareness through your whole body from head to toe.',
    releaseInstruction: 'Feel the quiet ease flowing through your whole body.',
    tenseSeconds: 5,
    releaseSeconds: 8,
    tenseIcon: 'heart',
    releaseIcon: 'heart-outline',
  },
];

interface PMRScreenProps {
  navigation: NavigationProp;
}

type ScreenMode = 'intro' | 'running' | 'paused' | 'complete';
type PhaseSubState = 'tense' | 'release';

export const PMRScreen: React.FC<PMRScreenProps> = ({ navigation }) => {
  const [mode, setMode] = useState<ScreenMode>('intro');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [subState, setSubState] = useState<PhaseSubState>('tense');
  const [secondsLeft, setSecondsLeft] = useState<number>(PMR_STEPS[0].tenseSeconds);
  const [startTime] = useState<number>(Date.now());

  const activeStep = PMR_STEPS[currentStepIdx] || PMR_STEPS[0];
  const animatedPulse = useSharedValue(1);

  const stateRef = useRef({
    stepIdx: currentStepIdx,
    subState,
    secondsLeft,
  });
  stateRef.current = { stepIdx: currentStepIdx, subState, secondsLeft };

  const handleExitToExplore = useCallback(() => {
    (navigation as any).navigate('MainTabs', { screen: 'ExploreTab' });
  }, [navigation]);

  const handleFinish = useCallback(async () => {
    setMode('complete');
    void hapticSuccess();

    const elapsedSec = Math.max(120, Math.round((Date.now() - startTime) / 1000));
    await wellnessRepository.logActivity('progressive-muscle-relaxation', elapsedSec);
  }, [startTime]);

  const handleBegin = () => {
    void hapticSelection();
    setMode('running');
    setCurrentStepIdx(0);
    setSubState('tense');
    setSecondsLeft(PMR_STEPS[0].tenseSeconds);
  };

  const handlePauseToggle = () => {
    void hapticLight();
    setMode((prev) => (prev === 'running' ? 'paused' : 'running'));
  };

  const handleExitRequest = useCallback(() => {
    if (mode === 'running' || mode === 'paused') {
      Alert.alert(
        'Leave exercise?',
        'Your progress in this PMR session will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: handleExitToExplore,
          },
        ],
      );
    } else {
      handleExitToExplore();
    }
  }, [mode, handleExitToExplore]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleExitRequest();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [handleExitRequest]),
  );

  // Main PMR Sub-state Guided Interval Timer
  useEffect(() => {
    if (mode !== 'running') return;

    if (subState === 'tense') {
      animatedPulse.value = withTiming(1.15, {
        duration: activeStep.tenseSeconds * 1000,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      animatedPulse.value = withTiming(0.92, {
        duration: activeStep.releaseSeconds * 1000,
        easing: Easing.inOut(Easing.ease),
      });
    }

    const timer = setInterval(() => {
      setSecondsLeft((prevSecs) => {
        if (prevSecs > 1) {
          return prevSecs - 1;
        }

        const { stepIdx: sIdx, subState: sState } = stateRef.current;

        if (sState === 'tense') {
          // Transition from TENSE -> RELEASE
          setSubState('release');
          void hapticLight();
          return PMR_STEPS[sIdx].releaseSeconds;
        }

        // Transition from RELEASE -> Next Muscle Group
        const nextStepIdx = sIdx + 1;
        if (nextStepIdx < PMR_STEPS.length) {
          setCurrentStepIdx(nextStepIdx);
          setSubState('tense');
          void hapticLight();
          return PMR_STEPS[nextStepIdx].tenseSeconds;
        }

        // Completed all 10 muscle groups
        void handleFinish();
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, subState, activeStep, handleFinish, animatedPulse]);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedPulse.value }],
    borderColor: subState === 'tense' ? '#9333EA' : '#16A34A',
  }));

  // COMPLETE STATE
  if (mode === 'complete') {
    return (
      <ActivityCompletionScreen
        title="Activity completed"
        message="You took a moment for yourself today. You've gently released physical tension across all 10 muscle groups."
        actionLabel="Done"
        onAction={handleExitToExplore}
      />
    );
  }

  // RUNNER STATE (10 MUSCLE GROUPS)
  if (mode === 'running' || mode === 'paused') {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        {/* Header */}
        <View style={styles.runnerHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={handleExitRequest}>
            <Icon name="chevron-left" size={20} color="#4B5563" />
            <Text style={styles.backText}>Exit</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Muscle Relaxation</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.runnerContainer}>
          {/* Progress Indicator (Step X of 10) */}
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {currentStepIdx + 1} of {PMR_STEPS.length} • {activeStep.label}
            </Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((currentStepIdx + 1) / PMR_STEPS.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Sub-State Badge (TENSE vs RELEASE) */}
          <View style={styles.subStateBadgeRow}>
            <View
              style={[
                styles.subStateBadge,
                subState === 'tense' ? styles.subStateTense : styles.subStateRelease,
              ]}
            >
              <Text
                style={[
                  styles.subStateBadgeText,
                  subState === 'tense' ? styles.tenseText : styles.releaseText,
                ]}
              >
                {subState === 'tense' ? 'TENSE (5s)' : 'RELEASE & SOFTEN (8s)'}
              </Text>
            </View>
          </View>

          {/* Central Animated Visual Ring & Countdown */}
          <View style={styles.visualContainer}>
            <Animated.View style={[styles.visualRing, animatedRingStyle]}>
              <Icon
                name={subState === 'tense' ? activeStep.tenseIcon : activeStep.releaseIcon}
                size={42}
                color={subState === 'tense' ? '#9333EA' : '#16A34A'}
              />
              <Text style={styles.timerCountText}>{secondsLeft}s</Text>
            </Animated.View>
          </View>

          {/* Instruction Card */}
          <View style={styles.instructionCard}>
            <Text style={styles.muscleGroupTitle}>{activeStep.label}</Text>
            <Text style={styles.instructionBody}>
              {subState === 'tense'
                ? activeStep.tenseInstruction
                : activeStep.releaseInstruction}
            </Text>
          </View>

          {/* Safety Notice */}
          <View style={styles.safetyBanner}>
            <Icon name="shield-outline" size={16} color="#9333EA" />
            <Text style={styles.safetyBannerText}>
              Keep tension gentle. Never strain or hold anything painful.
            </Text>
          </View>

          {/* Controls Row */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.pauseBtn} onPress={handlePauseToggle}>
              <Text style={styles.pauseBtnText}>{mode === 'paused' ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endEarlyBtn} onPress={handleFinish}>
              <Text style={styles.endEarlyBtnText}>Done Early</Text>
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
            <Icon name="smile" size={42} color="#16A34A" />
          </View>

          <Text style={styles.introTitle}>Progressive Muscle Relaxation</Text>
          <Text style={styles.introSubtitle}>
            Tense and release 10 muscle groups to invite ease.
          </Text>

          <Text style={styles.introParagraph}>
            Gently tense and release different muscle groups from your feet up to your face. The contrast can help you notice where you are holding tension, giving those areas a chance to soften.
          </Text>

          {/* Safety Note */}
          <View style={styles.safetyBox}>
            <Text style={styles.safetyBoxTitle}>SAFETY INSTRUCTION</Text>
            <Text style={styles.safetyBoxText}>
              Keep the tension gentle. Never strain or hold anything painful. Stop if anything feels uncomfortable.
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
    alignItems: 'center',
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
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
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
    color: '#16A34A',
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
    width: '100%',
    backgroundColor: '#16A34A',
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
    marginBottom: 16,
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
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
  subStateBadgeRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subStateBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subStateTense: {
    backgroundColor: '#F3E8FF',
  },
  subStateRelease: {
    backgroundColor: '#DCFCE7',
  },
  subStateBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tenseText: {
    color: '#9333EA',
  },
  releaseText: {
    color: '#16A34A',
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  visualRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  timerCountText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  muscleGroupTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  instructionBody: {
    fontSize: 15,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 22,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
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
  controlsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  pauseBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 16,
  },
  pauseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  endEarlyBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
  },
  endEarlyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
});
