import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { AppScreen } from '../../../components/app';
import { Icon } from '../../../components/app/Icon';
import { ActivityCompletionScreen } from '../../../components/activities/ActivityCompletionScreen';
import { MainStackParamList } from '../../../navigation/types';
import { Spacing, Radii } from '../../../design-system';
import { hapticLight, hapticSelection, hapticSuccess } from '../../../utils/haptics';
import { wellnessRepository } from '../../../repositories/WellnessRepository';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'GroundingExercise'>;

interface GroundingStep {
  count: number;
  senseTitle: string;
  senseLabel: string;
  instruction: string;
  placeholderPrefix: string;
  iconName: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  {
    count: 5,
    senseTitle: 'LOOK',
    senseLabel: 'THINGS YOU CAN SEE',
    instruction: 'Look around and name five things you can see.',
    placeholderPrefix: 'I see...',
    iconName: 'eye-outline',
  },
  {
    count: 4,
    senseTitle: 'TOUCH',
    senseLabel: 'THINGS YOU CAN TOUCH',
    instruction: 'Notice four things you can physically touch or feel around you.',
    placeholderPrefix: 'I feel...',
    iconName: 'hand-pointing-up',
  },
  {
    count: 3,
    senseTitle: 'HEAR',
    senseLabel: 'THINGS YOU CAN HEAR',
    instruction: 'Listen and identify three different sounds around you.',
    placeholderPrefix: 'I hear...',
    iconName: 'ear-hearing',
  },
  {
    count: 2,
    senseTitle: 'SMELL',
    senseLabel: 'THINGS YOU CAN SMELL',
    instruction: 'Notice two things you can smell right now.',
    placeholderPrefix: 'I smell...',
    iconName: 'scent',
  },
  {
    count: 1,
    senseTitle: 'TASTE',
    senseLabel: 'THING YOU CAN TASTE',
    instruction: 'Notice one thing you can taste right now.',
    placeholderPrefix: 'I taste...',
    iconName: 'silverware-fork-knife',
  },
];

interface GroundingScreenProps {
  navigation: NavigationProp;
}

type ScreenMode = 'intro' | 'runner' | 'complete';

export const GroundingScreen: React.FC<GroundingScreenProps> = ({ navigation }) => {
  const [mode, setMode] = useState<ScreenMode>('intro');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());

  // Input answers for each of the 5 steps
  const [answers, setAnswers] = useState<Record<number, string[]>>({
    0: ['', '', '', '', ''],
    1: ['', '', '', ''],
    2: ['', '', ''],
    3: ['', ''],
    4: [''],
  });

  // Array of TextInput refs for keyboard auto-advancement
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const activeStep = GROUNDING_STEPS[currentStepIdx];

  // Auto-focus first input when step changes
  useEffect(() => {
    if (mode === 'runner') {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStepIdx, mode]);

  const handleInputChange = (stepIdx: number, inputIdx: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [stepIdx]: prev[stepIdx].map((item, idx) => (idx === inputIdx ? text : item)),
    }));
  };

  const handleInputSubmit = (inputIdx: number) => {
    if (inputIdx < activeStep.count - 1) {
      // Focus next input automatically on Return/Next
      inputRefs.current[inputIdx + 1]?.focus();
    }
  };

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
    if (currentStepIdx < GROUNDING_STEPS.length - 1) {
      void hapticSelection();
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      // Completed all 5 steps -> Log activity once to backend
      void hapticSuccess();
      setMode('complete');

      const elapsedSec = Math.max(60, Math.round((Date.now() - startTime) / 1000));
      await wellnessRepository.logActivity('5-4-3-2-1-grounding', elapsedSec);
    }
  };

  // COMPLETE STATE
  if (mode === 'complete') {
    return (
      <ActivityCompletionScreen
        title="Activity completed"
        message="You took a moment for yourself today. You've grounded your mind through all five senses."
        actionLabel="Done"
        onAction={handleExitToExplore}
      />
    );
  }

  // RUNNER STATE (5 STEPS)
  if (mode === 'runner') {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        >
          {/* Header */}
          <View style={styles.runnerHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBackStep}>
              <Icon name="chevron-left" size={20} color="#4B5563" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>
                {currentStepIdx + 1} of {GROUNDING_STEPS.length}
              </Text>
            </View>

            <View style={{ width: 60 }} />
          </View>

          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.runnerContainer}
          >
            {/* Smooth Animated Step Container */}
            <Animated.View
              key={currentStepIdx}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
            >
              {/* Sensory Visual Icon Illustration */}
              <View style={styles.sensoryVisualCircle}>
                <Icon name={activeStep.iconName} size={42} color="#4A90A4" />
              </View>

              {/* Step Header Block */}
              <View style={styles.stepHeaderBlock}>
                <Text style={styles.largeNumber}>{activeStep.count}</Text>
                <Text style={styles.senseLabel}>{activeStep.senseLabel}</Text>
                <Text style={styles.instructionText}>{activeStep.instruction}</Text>
              </View>

              {/* Response Input List with Auto-Advancement */}
              <View style={styles.inputsList}>
                {Array.from({ length: activeStep.count }).map((_, inputIdx) => (
                  <TextInput
                    key={inputIdx}
                    ref={(el) => {
                      inputRefs.current[inputIdx] = el;
                    }}
                    style={styles.inputField}
                    placeholder={`${activeStep.placeholderPrefix} ${inputIdx + 1}`}
                    placeholderTextColor="#94A3B8"
                    value={answers[currentStepIdx][inputIdx] || ''}
                    onChangeText={(val) => handleInputChange(currentStepIdx, inputIdx, val)}
                    onSubmitEditing={() => handleInputSubmit(inputIdx)}
                    returnKeyType={inputIdx === activeStep.count - 1 ? 'done' : 'next'}
                    blurOnSubmit={inputIdx === activeStep.count - 1}
                  />
                ))}
              </View>
            </Animated.View>

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
                  {currentStepIdx === GROUNDING_STEPS.length - 1 ? 'Finish' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
          <View style={styles.sensoryVisualCircle}>
            <Icon name="eye" size={42} color="#4A90A4" />
          </View>

          <Text style={styles.introTitle}>5-4-3-2-1 Grounding</Text>
          <Text style={styles.introSubtitle}>
            A quick technique to calm anxiety and reconnect with the present moment.
          </Text>
          <Text style={styles.introParagraph}>
            You'll be guided through your five senses, one at a time. Go slowly, and actually look, listen, and feel as you go — there's no need to rush.
          </Text>

          <TouchableOpacity style={styles.beginCtaBtn} onPress={handleBegin} activeOpacity={0.88}>
            <Text style={styles.beginCtaText}>Begin</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          If anxiety is a frequent or intense struggle, consider talking to a therapist or counselor.
        </Text>
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
  sensoryVisualCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 144, 164, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  introTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A90A4',
    marginBottom: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  introParagraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  beginCtaBtn: {
    width: '100%',
    backgroundColor: '#4A90A4',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  beginCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginHorizontal: 16,
  },

  /* Runner Styles */
  runnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 8,
  },
  stepBadge: {
    backgroundColor: 'rgba(74, 144, 164, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4A90A4',
  },
  runnerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  stepHeaderBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  largeNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: '#4A90A4',
    lineHeight: 60,
    marginBottom: 2,
  },
  senseLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4A90A4',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 23,
  },
  inputsList: {
    gap: 10,
    marginBottom: 24,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#334155',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 8,
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
    backgroundColor: '#4A90A4',
    borderRadius: 16,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
