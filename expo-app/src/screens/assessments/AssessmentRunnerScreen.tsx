import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/app/Icon';
import { SCREENERS, QuestionOption } from '../../data/assessmentsData';
import { assessmentRepository } from '../../repositories/AssessmentRepository';
import { scoreAssessment, getScreenerMaxScore } from '../../utils/scoreAssessment';
import { MainStackParamList } from '../../navigation/types';
import { AppScreen } from '../../components/app';
import { Spacing } from '../../design-system';
import { PremiumLimitModal } from '../../components/premium/PremiumLimitModal';
import { RateLimitError } from '../../types/errors';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RouteProps = RouteProp<MainStackParamList, 'AssessmentRunner'>;

const PROGRESSIVE_COLORS = [
  '#FDE047', // 1. Light Yellow
  '#FACC15', // 2. Golden Yellow
  '#FB923C', // 3. Warm Orange
  '#EA580C', // 4. Dark Orange
  '#DC2626', // 5. Deep Red/Orange
];

export const AssessmentRunnerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const assessmentKey = route.params?.assessmentKey || 'phq-9';
  const screener = SCREENERS[assessmentKey] || SCREENERS['phq-9'];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [premiumModalVisible, setPremiumModalVisible] = useState<boolean>(false);

  const isAdvancing = useRef<boolean>(false);

  useEffect(() => {
    const runMountedCheck = async () => {
      const userPlan = useProfileStore.getState().userPlan;
      const activePlanId = useBillingStore.getState().activePlanId;
      const isPremiumUser =
        activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

      if (isPremiumUser) return;

      try {
        await useProfileStore.getState().fetchPatientLimits();
        const limits = useProfileStore.getState().patientLimits;
        const assessmentUsage = limits?.usage?.assessments;
        if (assessmentUsage) {
          const remaining =
            typeof assessmentUsage.remaining === 'number'
              ? assessmentUsage.remaining
              : parseInt(String(assessmentUsage.remaining), 10);
          const used = assessmentUsage.used;
          const limit =
            typeof assessmentUsage.limit === 'number'
              ? assessmentUsage.limit
              : parseInt(String(assessmentUsage.limit), 10);

          if ((!Number.isNaN(remaining) && remaining <= 0) || (used >= limit && limit > 0)) {
            setPremiumModalVisible(true);
          }
        }
      } catch {
        // Infrastructure error -> allow attempt
      }
    };
    void runMountedCheck();
  }, []);

  const totalQuestions = screener.questions.length;
  const currentQuestion = screener.questions[currentIndex] || screener.questions[0];
  const progressRatio = (currentIndex + 1) / totalQuestions;

  const submitAssessmentPayload = async (finalAnswers: Record<number, number>) => {
    setLoading(true);

    const responsesPayload = Object.entries(finalAnswers).map(([idxStr, val]) => {
      const idx = parseInt(idxStr, 10);
      const q = screener.questions[idx];
      return {
        questionId: q ? q.id : `q_${idx}`,
        selectedValue: val,
      };
    });

    try {
      const res = await assessmentRepository.submitAssessment({
        assessmentKey,
        responses: responsesPayload,
      });

      void hapticSuccess();
      const calculatedMaxScore = getScreenerMaxScore(assessmentKey, screener);
      const fallbackCalculated = scoreAssessment(assessmentKey, screener, finalAnswers);

      const finalResult = res.result
        ? {
            ...res.result,
            maxScore: (res.result as any).maxScore || calculatedMaxScore,
          }
        : {
            ...fallbackCalculated,
          };

      navigation.replace('AssessmentResult', { result: finalResult });
    } catch (err: any) {
      console.error('[ASSESSMENT RUNNER] Error submitting assessment:', err);
      if (
        err instanceof RateLimitError ||
        (err?.message && (err.message.includes('429') || err.message.includes('LIMIT_EXCEEDED') || err.message.includes('limit')))
      ) {
        setPremiumModalVisible(true);
        return;
      }
      // Fallback local Web-parity scoring if offline
      const fallbackResult = scoreAssessment(assessmentKey, screener, finalAnswers);
      navigation.replace('AssessmentResult', {
        result: fallbackResult,
      });
    } finally {
      setLoading(false);
      isAdvancing.current = false;
    }
  };

  const handleSelectOption = (option: QuestionOption) => {
    if (isAdvancing.current || loading) return;
    isAdvancing.current = true;

    void hapticSelection();
    const nextAnswers = { ...answers, [currentIndex]: option.value };
    setAnswers(nextAnswers);

    // Skip & Gate Logic Evaluation matching Web implementation
    const skip = screener.skipLogic;

    // 1. PTSD Trauma Exposure Gate Question
    if (currentQuestion.isGate && option.value === 0) {
      setTimeout(() => {
        void submitAssessmentPayload(nextAnswers);
      }, 300);
      return;
    }

    // 2. C-SSRS Skip Logic
    if (
      skip?.type === 'c-ssrs' &&
      currentIndex === skip.gateQuestionIndex &&
      option.value === skip.gateNoValue
    ) {
      setTimeout(() => {
        isAdvancing.current = false;
        setCurrentIndex(skip.jumpToIndex);
      }, 300);
      return;
    }

    // 3. ASQ Gate Logic
    if (skip?.type === 'asq' && currentIndex === Math.max(...skip.gateQuestionIndices)) {
      const anyYes = skip.gateQuestionIndices.some((i: number) => (nextAnswers[i] ?? 0) > 0);
      if (!anyYes) {
        setTimeout(() => {
          void submitAssessmentPayload(nextAnswers);
        }, 300);
        return;
      }
    }

    // Standard Linear Question Progression vs Final Submission
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        isAdvancing.current = false;
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        void submitAssessmentPayload(nextAnswers);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      void hapticLight();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (answers[currentIndex] === undefined) return;
    void hapticLight();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      void submitAssessmentPayload(answers);
    }
  };

  const selectedVal = answers[currentIndex];
  const selectedIndex = currentQuestion.options.findIndex((opt) => opt.value === selectedVal);

  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <ScrollView contentContainerStyle={styles.runnerContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topHeaderRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              void hapticLight();
              navigation.goBack();
            }}
            accessibilityRole="button"
            accessibilityLabel="Go Back"
          >
            <Icon name="chevron-left" size={20} color="#1E293B" />
          </TouchableOpacity>

          <Text style={styles.screenerHeaderTitle} numberOfLines={1}>
            {screener.title}
          </Text>

          <View style={{ width: 32 }} />
        </View>

        {/* Thin Clean Top Progress Bar */}
        <View style={styles.thinProgressBarTrack}>
          <View style={[styles.thinProgressBarFill, { width: `${progressRatio * 100}%` }]} />
        </View>

        <View style={styles.verticalBreathingSpace} />

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#F97316" />
            <Text style={styles.loadingText}>Analyzing your answers...</Text>
          </View>
        ) : (
          <View style={styles.mainContentWrapper}>
            {/* Fixed Question Area (RESERVED HEIGHT so question length never moves the answer scale) */}
            <View style={styles.fixedQuestionArea}>
              <Text style={styles.questionPromptText}>{currentQuestion.text}</Text>
            </View>

            {/* Fixed Answer Scale Section */}
            <View style={styles.fixedAnswerArea}>
              {/* Horizontal Scale of Answer Boxes with Progressive Coloring */}
              <View style={styles.scaleBoxesRow}>
                {currentQuestion.options.map((opt, i) => {
                  const isColored = selectedIndex !== -1 && i <= selectedIndex;
                  const bg = isColored
                    ? PROGRESSIVE_COLORS[i % PROGRESSIVE_COLORS.length]
                    : '#E4E4E7';

                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.scaleBox, { backgroundColor: bg }]}
                      onPress={() => handleSelectOption(opt)}
                      activeOpacity={0.85}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: answers[currentIndex] === opt.value }}
                    />
                  );
                })}
              </View>

              {/* Dynamic Labels Underneath Each Box */}
              <View style={styles.scaleLabelsRow}>
                {currentQuestion.options.map((opt, i) => (
                  <Text key={i} style={styles.scaleLabelText} numberOfLines={2}>
                    {opt.text}
                  </Text>
                ))}
              </View>
            </View>

            {/* Previous & Next Navigation Controls */}
            <View style={styles.navControlsRow}>
              <TouchableOpacity
                style={styles.subtleNavBtn}
                disabled={currentIndex === 0}
                onPress={handlePrevious}
                activeOpacity={0.7}
              >
                <View style={styles.navBtnInner}>
                  <Icon name="chevron-left" size={16} color={currentIndex === 0 ? '#CBD5E1' : '#475569'} />
                  <Text
                    style={[
                      styles.subtleNavBtnText,
                      currentIndex === 0 && styles.subtleNavBtnTextDisabled,
                    ]}
                  >
                    Previous
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subtleNavBtn}
                disabled={answers[currentIndex] === undefined}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <View style={styles.navBtnInner}>
                  <Text
                    style={[
                      styles.subtleNavBtnText,
                      answers[currentIndex] === undefined && styles.subtleNavBtnTextDisabled,
                    ]}
                  >
                    Next
                  </Text>
                  <Icon name="chevron-right" size={16} color={answers[currentIndex] === undefined ? '#CBD5E1' : '#475569'} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Flexible Spacer */}
            <View style={styles.flexibleSpacer} />

            {/* Confidentiality Message Anchored at Bottom */}
            <Text style={styles.confidentialityText}>
              Responses are completely confidential
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Premium Limit Popup */}
      <PremiumLimitModal
        visible={premiumModalVisible}
        cardType="ASSESSMENT"
        onDismiss={() => setPremiumModalVisible(false)}
        onUpgrade={() => {
          setPremiumModalVisible(false);
          navigation.navigate('SubscriptionComparison');
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  runnerContainer: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 1.5,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenerHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    flex: 1,
  },
  thinProgressBarTrack: {
    height: 4,
    backgroundColor: '#E4E4E7',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  thinProgressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  verticalBreathingSpace: {
    height: 24,
  },
  mainContentWrapper: {
    flex: 1,
    paddingHorizontal: 4,
  },
  fixedQuestionArea: {
    minHeight: 140,
    justifyContent: 'center',
    marginBottom: 20,
  },
  questionPromptText: {
    fontSize: 19.5,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  fixedAnswerArea: {
    marginBottom: 24,
  },
  scaleBoxesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  scaleBox: {
    flex: 1,
    height: 50,
    borderRadius: 16,
  },
  scaleLabelsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 2,
  },
  scaleLabelText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 15,
  },
  navControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  subtleNavBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  navBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtleNavBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
  },
  subtleNavBtnTextDisabled: {
    color: '#CBD5E1',
  },
  flexibleSpacer: {
    flex: 1,
    minHeight: 32,
  },
  confidentialityText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
    textAlign: 'center',
    paddingBottom: 8,
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
});
