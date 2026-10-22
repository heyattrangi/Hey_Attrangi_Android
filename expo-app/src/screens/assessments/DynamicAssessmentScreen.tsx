import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAiCompanionImage } from '../../assets';
import {
  triageQuestions,
  screeners,
  TriageQuestionOption,
} from '../../data/assessmentEngineData';
import { assessmentRepository } from '../../repositories/AssessmentRepository';
import { MainStackParamList } from '../../navigation/types';
import { AppScreen } from '../../components/app';
import { Icon } from '../../components/app/Icon';
import { Spacing } from '../../design-system';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { PremiumLimitModal } from '../../components/premium/PremiumLimitModal';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

type ChatMessage = {
  id: string;
  role: 'bot' | 'user';
  text: string;
};

type Phase = 'intro' | 'triage' | 'screener' | 'calculating' | 'results';

export const DynamicAssessmentScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);

  // Synchronous Guard for Rapid Taps
  const answerLockedRef = useRef<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Flow State
  const [phase, setPhase] = useState<Phase>('intro');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'intro_1', role: 'bot', text: 'Hello' },
    {
      id: 'intro_2',
      role: 'bot',
      text: "Let's understand how you're doing today. This takes about 5-10 minutes.",
    },
  ]);

  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

  const checkAssessmentEntitlement = async (): Promise<boolean> => {
    const userPlan = useProfileStore.getState().userPlan;
    const activePlanId = useBillingStore.getState().activePlanId;
    const isPremiumUser =
      activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

    if (isPremiumUser) return true;

    try {
      await useProfileStore.getState().fetchPatientLimits();
    } catch {
      return true; // Infrastructure error -> allow attempt
    }

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
        return false;
      }
    }

    return true;
  };

  // Triage State
  const [triageIndex, setTriageIndex] = useState<number>(0);
  const [triggeredScreeners, setTriggeredScreeners] = useState<Set<string>>(new Set());
  const [who5Score, setWho5Score] = useState<number>(0);

  // Screener State
  const [activeScreenerQueue, setActiveScreenerQueue] = useState<string[]>([]);
  const [currentScreenerId, setCurrentScreenerId] = useState<string | null>(null);
  const [screenerQuestionIndex, setScreenerQuestionIndex] = useState<number>(0);
  const [screenerScores, setScreenerScores] = useState<Record<string, number>>({});

  // Results State
  const [finalResults, setFinalResults] = useState<any>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, phase]);

  const addBotMessage = (text: string, delayMs = 400): Promise<void> => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { id: `${Date.now()}_${Math.random()}`, role: 'bot', text },
        ]);
        resolve();
      }, delayMs);
    });
  };

  const handleStartTriage = async () => {
    if (answerLockedRef.current) return;
    answerLockedRef.current = true;
    void hapticSelection();

    const allowed = await checkAssessmentEntitlement();
    if (!allowed) {
      answerLockedRef.current = false;
      return;
    }

    setPhase('triage');
    await addBotMessage(triageQuestions[0].text, 300);
    answerLockedRef.current = false;
  };

  const handleTriageAnswer = (option: TriageQuestionOption, index: number) => {
    if (answerLockedRef.current) {
      return;
    }
    answerLockedRef.current = true;
    setSelectedOptionIndex(index);
    void hapticSelection();

    setTimeout(async () => {
      setChatHistory((prev) => [
        ...prev,
        { id: `${Date.now()}_user`, role: 'user', text: option.label },
      ]);

      let updatedTriggered = triggeredScreeners;
      if (option.triggerScreener) {
        updatedTriggered = new Set(triggeredScreeners).add(option.triggerScreener);
        setTriggeredScreeners(updatedTriggered);
      }

      if (option.who5Value !== undefined) {
        setWho5Score((prev) => prev + option.who5Value!);
      }

      const nextIndex = triageIndex + 1;
      if (nextIndex < triageQuestions.length) {
        setTriageIndex(nextIndex);
        await addBotMessage(triageQuestions[nextIndex].text, 350);
      } else {
        // Triage complete! Validate queue against known screeners
        const queue = Array.from(updatedTriggered).filter((id) => Boolean(screeners[id]));
        if (queue.length > 0) {
          setActiveScreenerQueue(queue);
          const firstScreenerId = queue[0];
          setCurrentScreenerId(firstScreenerId);
          setScreenerQuestionIndex(0);
          setPhase('screener');

          await addBotMessage('Thanks for sharing that.', 350);
          if (screeners[firstScreenerId]) {
            await addBotMessage(screeners[firstScreenerId].intro, 450);
            await addBotMessage(screeners[firstScreenerId].questions[0].text, 450);
          }
        } else {
          await addBotMessage(
            'Thank you for sharing. Based on your answers, you seem to be doing relatively okay right now.',
            450,
          );
          void finishAssessment();
        }
      }
      setSelectedOptionIndex(null);
      answerLockedRef.current = false;
    }, 250);
  };

  const handleScreenerAnswer = (option: { label: string; value: number }, index: number) => {
    if (answerLockedRef.current || !currentScreenerId || !screeners[currentScreenerId]) {
      return;
    }
    answerLockedRef.current = true;
    setSelectedOptionIndex(index);
    void hapticSelection();

    setTimeout(async () => {
      setChatHistory((prev) => [
        ...prev,
        { id: `${Date.now()}_user`, role: 'user', text: option.label },
      ]);

      setScreenerScores((prev) => ({
        ...prev,
        [currentScreenerId]: (prev[currentScreenerId] || 0) + option.value,
      }));

      const currentScreener = screeners[currentScreenerId];
      const nextQIndex = screenerQuestionIndex + 1;

      if (nextQIndex < currentScreener.questions.length) {
        setScreenerQuestionIndex(nextQIndex);
        await addBotMessage(currentScreener.questions[nextQIndex].text, 350);
      } else {
        // Finished current screener! Advance queue
        const currentQueueIndex = activeScreenerQueue.indexOf(currentScreenerId);
        const nextQueueIndex = currentQueueIndex + 1;

        if (nextQueueIndex < activeScreenerQueue.length) {
          const nextScreenerId = activeScreenerQueue[nextQueueIndex];
          if (screeners[nextScreenerId]) {
            setCurrentScreenerId(nextScreenerId);
            setScreenerQuestionIndex(0); // Synchronously reset question index to 0
            await addBotMessage("Got it. Let's move on to the next set of questions.", 350);
            await addBotMessage(screeners[nextScreenerId].intro, 450);
            await addBotMessage(screeners[nextScreenerId].questions[0].text, 450);
          } else {
            void finishAssessment();
          }
        } else {
          void finishAssessment();
        }
      }
      setSelectedOptionIndex(null);
      answerLockedRef.current = false;
    }, 250);
  };

  const finishAssessment = async () => {
    setPhase('calculating');
    await addBotMessage(
      "Thank you for completing the assessment. I'm analyzing your responses now...",
      400,
    );

    setTimeout(() => {
      calculateFinalResults();
      setPhase('results');
    }, 1800);
  };

  const calculateFinalResults = async () => {
    const rawFindings: any[] = [];

    let who5Interpretation = 'Good Wellbeing';
    if (who5Score < 13) who5Interpretation = 'Poor Wellbeing';
    if (who5Score < 5) who5Interpretation = 'Very Poor Wellbeing';

    rawFindings.push({
      id: 'who5',
      name: 'WHO-5 Wellbeing',
      fullName: 'WHO-5 Wellbeing Index',
      score: who5Score,
      severity: who5Interpretation,
      priorityWeight: 20,
      confidenceLevel: 'High',
      recommendations: who5Interpretation.includes('Poor')
        ? ['Consider tracking your mood daily', 'Focus on sleep and nutrition']
        : [],
    });

    for (const [screenerId, score] of Object.entries(screenerScores)) {
      const screener = screeners[screenerId];
      if (!screener) continue;
      const rule = screener.scoring.find((r) => score >= r.min && score <= r.max);

      if (rule && rule.severity !== 'Minimal') {
        rawFindings.push({
          id: screenerId,
          name: screener.name.split(' ')[0],
          fullName: screener.name,
          score,
          severity: rule.severity,
          priorityWeight: screener.priorityWeight,
          confidenceLevel: screener.confidenceLevel,
          recommendations: rule.recommendations || [],
        });
      }
    }

    rawFindings.sort((a, b) => b.priorityWeight - a.priorityWeight);

    let overallAssessment =
      'Your responses indicate generally stable wellbeing with no major clinical flags.';
    const flaggedClinical = rawFindings.filter(
      (f) => f.id !== 'who5' && f.severity !== 'Minimal',
    );

    if (flaggedClinical.length > 0) {
      const topNames = flaggedClinical
        .slice(0, 2)
        .map((f) => `${f.severity.toLowerCase()} ${f.name} symptoms`);
      overallAssessment = `Your responses suggest symptoms that may be consistent with ${topNames.join(' together with ')}.`;
      if (flaggedClinical.length > 2) {
        overallAssessment += ` Some of your answers also indicate other areas that should be explored further.`;
      }
      overallAssessment +=
        ' These screening results are not a diagnosis, but they help identify which areas may benefit from further evaluation.';
    } else if (who5Score < 13) {
      overallAssessment =
        'While no specific clinical domains were strongly flagged, your overall wellbeing score suggests you are currently going through a difficult time.';
    }

    let aiInterpretation =
      'No significant clinical symptoms were detected. Continue to monitor your wellbeing.';
    if (flaggedClinical.length > 0) {
      aiInterpretation = `The combination of ${flaggedClinical.slice(0, 2).map((f) => f.name).join(' and ')} symptoms is notable. `;
      if (flaggedClinical.some((f) => f.confidenceLevel === 'Screening only')) {
        aiInterpretation += `Several screening questions also suggest additional areas of concern. Because these were identified by brief screeners, a comprehensive clinical assessment is recommended before drawing conclusions.`;
      } else {
        aiInterpretation += `Please discuss these results with a healthcare provider to determine an appropriate care plan.`;
      }
    }

    const topPriorities: any[] = [];
    const additionalFindings: any[] = [];
    const selfHelp: string[] = [];

    rawFindings.forEach((finding) => {
      if (finding.id === 'who5' && finding.severity === 'Good Wellbeing') return;

      if (topPriorities.length < 3 && finding.id !== 'who5') {
        topPriorities.push({
          condition: finding.fullName,
          status: finding.severity,
          recommendation: finding.recommendations[0] || 'Requires further evaluation.',
          screenerId: finding.id,
        });
      } else if (finding.id !== 'who5') {
        additionalFindings.push({
          condition: finding.fullName,
          status: finding.severity,
          recommendation: finding.recommendations[0] || 'Monitor symptoms.',
          screenerId: finding.id,
        });
      }

      if (finding.recommendations.length > 1) {
        selfHelp.push(...finding.recommendations.slice(1));
      }
    });

    const payload = {
      assessmentId: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      overallAssessment,
      confidenceLevels: rawFindings,
      topPriorities,
      additionalFindings,
      selfHelp: Array.from(new Set(selfHelp)),
      aiInterpretation,
    };

    setFinalResults(payload);

    try {
      await assessmentRepository.submitDynamicAssessment(payload);
      void hapticSuccess();
    } catch (err) {
      console.error('[DYNAMIC ASSESSMENT] Save error:', err);
    }
  };

  const handleReturnToExplore = () => {
    void hapticLight();
    setPhase('intro');
    navigation.navigate('MainTabs', { screen: 'ExploreTab' });
  };

  const primaryFinding = finalResults?.confidenceLevels?.[0];
  const formattedDate = finalResults?.date
    ? new Date(finalResults.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  const currentTriageQ = triageQuestions[triageIndex];
  const currentScreenerObj = currentScreenerId ? screeners[currentScreenerId] : null;
  const currentScreenerQ = currentScreenerObj
    ? currentScreenerObj.questions[screenerQuestionIndex]
    : null;

  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <View style={styles.container}>
        {/* Header with Pragya Avatar */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.pragyaAvatarOuter}>
              <Image source={getAiCompanionImage()} style={styles.pragyaAvatarImg} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Assessment Engine</Text>
              <Text style={styles.headerSubtitle}>Guided clinical screener</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              void hapticLight();
              navigation.goBack();
            }}
          >
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>

        {/* Chat History */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        >
          {chatHistory.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <View
                key={msg.id}
                style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}
              >
                {!isUser ? (
                  <View style={styles.botIconMini}>
                    <Image source={getAiCompanionImage()} style={styles.botMiniImg} />
                  </View>
                ) : null}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
                  <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextBot]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}

          {phase === 'calculating' ? (
            <View style={[styles.msgRow, styles.msgRowBot]}>
              <View style={styles.botIconMini}>
                <Image source={getAiCompanionImage()} style={styles.botMiniImg} />
              </View>
              <View style={[styles.bubble, styles.bubbleBot, { flexDirection: 'row', gap: 8 }]}>
                <ActivityIndicator size="small" color="#F97316" />
                <Text style={styles.bubbleTextBot}>Analyzing your responses...</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Bottom Options Area */}
        <View style={styles.bottomArea}>
          {phase === 'intro' ? (
            <TouchableOpacity style={styles.primaryCta} onPress={handleStartTriage}>
              <Text style={styles.primaryCtaText}>START ASSESSMENT</Text>
            </TouchableOpacity>
          ) : null}

          {phase === 'triage' && currentTriageQ ? (
            <View style={styles.optionsGrid}>
              {currentTriageQ.options.map((opt, i) => {
                const isSelected = selectedOptionIndex === i;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                    onPress={() => handleTriageAnswer(opt, i)}
                    disabled={answerLockedRef.current || selectedOptionIndex !== null}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.optionBtnText, isSelected && styles.optionBtnTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {phase === 'screener' && currentScreenerQ ? (
            <View style={styles.optionsGrid}>
              {currentScreenerQ.options.map((opt, i) => {
                const isSelected = selectedOptionIndex === i;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                    onPress={() => handleScreenerAnswer(opt, i)}
                    disabled={answerLockedRef.current || selectedOptionIndex !== null}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.optionBtnText, isSelected && styles.optionBtnTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {phase === 'results' ? (
            <TouchableOpacity style={styles.primaryCta} onPress={handleReturnToExplore}>
              <Text style={styles.primaryCtaText}>RETURN TO EXPLORE</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Full-Screen Report Overlay */}
        <Modal visible={phase === 'results' && Boolean(finalResults)} animationType="slide">
          <View style={styles.modalBg}>
            <ScrollView contentContainerStyle={styles.reportContainer} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.headerBlock}>
                <Text style={styles.headerTitleText}>Assessment Results</Text>
                <Text style={styles.headerDateText}>Completed {formattedDate}</Text>
              </View>

              {/* 1. Primary Result Card */}
              <View style={styles.primaryCard}>
                <Text style={styles.primaryTag}>PRIMARY RESULT</Text>
                <Text style={styles.primarySeverityText}>
                  {primaryFinding?.severity || 'Assessment Complete'}
                </Text>
                <Text style={styles.primaryScreenerText}>
                  {(primaryFinding?.fullName || 'WHO-5 WELLBEING INDEX').toUpperCase()}
                </Text>
                <Text style={styles.primaryDescriptionText}>
                  {finalResults?.overallAssessment}
                </Text>
                <View style={styles.confidenceRow}>
                  <View style={styles.confidenceDotOrange} />
                  <Text style={styles.confidenceLabelText}>
                    Confidence: {primaryFinding?.confidenceLevel || 'High'}
                  </Text>
                </View>
              </View>

              {/* 2. What This Means */}
              <View style={styles.sectionWhiteCard}>
                <Text style={styles.sectionCardTitle}>What this means</Text>
                <Text style={styles.overallText}>{finalResults?.overallAssessment}</Text>

                {finalResults?.aiInterpretation ? (
                  <View style={styles.aiQuoteInset}>
                    <Text style={styles.aiQuoteText}>"{finalResults.aiInterpretation}"</Text>
                  </View>
                ) : null}
              </View>

              {/* 3. Primary Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.primaryFilledBtn}
                  onPress={handleReturnToExplore}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryFilledBtnText}>Return to Assessments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryOutlinedBtn}
                  onPress={() => {
                    void hapticLight();
                    setPhase('intro');
                    navigation.navigate('MainTabs', { screen: 'ExploreTab' });
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryOutlinedBtnText}>Explore wellbeing tools</Text>
                </TouchableOpacity>
              </View>

              {/* 4. A Few Things That May Help */}
              {finalResults?.selfHelp && finalResults.selfHelp.length > 0 ? (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>A few things that may help</Text>
                  {finalResults.selfHelp.map((item: string, idx: number) => {
                    const titles = ['Wellbeing Tip', 'Professional Support', 'Sleep & Nutrition', 'Daily Practice'];
                    const tipTitle = titles[idx % titles.length];
                    const iconNames = ['lightbulb-outline', 'account-heart-outline', 'sleep', 'leaf'];
                    const iconName = iconNames[idx % iconNames.length];

                    return (
                      <View key={idx} style={styles.recommendationCard}>
                        <View style={styles.recIconBadge}>
                          <Icon name={iconName} size={20} color="#EA580C" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.recCategoryTitle}>{tipTitle}</Text>
                          <Text style={styles.recText}>{item}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {/* 5. Domain Analysis */}
              {finalResults?.confidenceLevels && finalResults.confidenceLevels.length > 0 ? (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>Domain Analysis</Text>
                  {finalResults.confidenceLevels.map((item: any, idx: number) => {
                    const isSevere =
                      item.severity.includes('Severe') || item.severity.includes('Very Poor');
                    const isModerate =
                      item.severity.includes('Moderate') ||
                      item.severity.includes('Poor') ||
                      item.severity.includes('Flagged');
                    const badgeBg = isSevere ? '#FEE2E2' : isModerate ? '#FEF3C7' : '#DCFCE7';
                    const badgeText = isSevere ? '#991B1B' : isModerate ? '#92400E' : '#166534';

                    return (
                      <View key={idx} style={styles.domainCard}>
                        <View style={styles.domainHeaderRow}>
                          <Text style={styles.domainNameText}>{item.fullName}</Text>
                          <View style={[styles.badgeContainer, { backgroundColor: badgeBg }]}>
                            <Text style={[styles.badgeText, { color: badgeText }]}>
                              {item.severity}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.domainMetaRow}>
                          {item.score !== undefined ? (
                            <Text style={styles.domainMetaText}>Score: {item.score}</Text>
                          ) : null}
                          <Text style={styles.domainMetaMuted}>
                            Confidence: {item.confidenceLevel || 'High'}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {/* 6. Priorities & Clinical Actions */}
              {finalResults?.topPriorities && finalResults.topPriorities.length > 0 ? (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>Priorities & Clinical Actions</Text>
                  <View style={styles.prioritiesWarmContainer}>
                    {finalResults.topPriorities.map((item: any, idx: number) => (
                      <View key={idx} style={styles.priorityInnerCard}>
                        <Text style={styles.priorityActionTitle}>{item.recommendation}</Text>
                        <Text style={styles.priorityScreenerDetail}>
                          Screener: {item.condition} ({item.status})
                        </Text>
                        {item.screenerId ? (
                          <TouchableOpacity
                            style={styles.dedicatedScreenerBtn}
                            onPress={() => {
                              void hapticSelection();
                              setPhase('intro');
                              navigation.replace('AssessmentRunner', {
                                assessmentKey: item.screenerId,
                              });
                            }}
                          >
                            <Text style={styles.dedicatedScreenerBtnText}>
                              Take Dedicated {item.condition}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* 7. Disclaimer */}
              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerText}>
                  These screening results are provided for informational purposes only and do not constitute a formal clinical diagnosis. If you are in distress or experiencing a mental health emergency, please consult a healthcare provider or local emergency services immediately.
                </Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pragyaAvatarOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(249, 115, 22, 0.25)',
  },
  pragyaAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    resizeMode: 'cover',
    opacity: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 14,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  msgRowBot: {
    justifyContent: 'flex-start',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  botIconMini: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  botMiniImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    resizeMode: 'cover',
    opacity: 1,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleBot: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#4F46E5',
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextBot: {
    color: '#1E293B',
    fontWeight: '600',
  },
  bubbleTextUser: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomArea: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    minHeight: 110,
    justifyContent: 'center',
  },
  primaryCta: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  primaryCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  optionsGrid: {
    gap: 10,
    width: '100%',
  },
  optionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 18,
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  optionBtnSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F97316',
    borderWidth: 2,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  optionBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  optionBtnTextSelected: {
    fontWeight: '800',
    color: '#C2410C',
  },
  modalBg: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  reportContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: 20,
  },
  headerTitleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  primaryCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  primaryTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 1,
    marginBottom: 6,
  },
  primarySeverityText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#9A3412',
    lineHeight: 28,
    marginBottom: 4,
  },
  primaryScreenerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  primaryDescriptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C2D12',
    lineHeight: 22,
    marginBottom: 16,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceDotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EA580C',
  },
  confidenceLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C2410C',
  },
  sectionWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  overallText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 22,
    marginBottom: 16,
  },
  aiQuoteInset: {
    backgroundColor: '#FAF8F5',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  aiQuoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#475569',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  primaryFilledBtn: {
    backgroundColor: '#F97316',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryFilledBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryOutlinedBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F97316',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryOutlinedBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F97316',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  recIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recCategoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
    marginBottom: 2,
  },
  recText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 20,
  },
  domainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  domainHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  domainNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 10,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  domainMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  domainMetaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  domainMetaMuted: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  prioritiesWarmContainer: {
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  priorityInnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  priorityActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  priorityScreenerDetail: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  dedicatedScreenerBtn: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  dedicatedScreenerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  disclaimerContainer: {
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
