import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  BackHandler,
} from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { AppScreen } from '../../components/app';
import { Icon } from '../../components/app/Icon';
import { ActivityCompletionScreen } from '../../components/activities/ActivityCompletionScreen';
import { MainStackParamList } from '../../navigation/types';
import { Spacing, Radii } from '../../design-system';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { wellnessRepository } from '../../repositories/WellnessRepository';
import { PremiumLimitModal } from '../../components/premium/PremiumLimitModal';
import { useProfileStore } from '../../store/profileStore';
import { useBillingStore } from '../../store/billingStore';
import {
  BREATHING_CONFIGS,
  getBreathingConfig,
  BreathingExerciseConfig,
} from '../../components/explore/breathing/breathingConfigs';
import { BreathingVisual } from '../../components/explore/breathing/BreathingVisual';
import { BreathingSelectionScreen } from '../activities/Breathing/BreathingSelectionScreen';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'BreathingExercise'>;
  route: RouteProp<MainStackParamList, 'BreathingExercise'>;
};

type StepState = 'selection' | 'intro' | 'running' | 'paused' | 'complete';

export const BreathingExerciseScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const initialSlug = route.params?.exerciseId;
  const [selectedConfig, setSelectedConfig] = useState<BreathingExerciseConfig | null>(
    initialSlug ? getBreathingConfig(initialSlug) : null,
  );

  const [stepState, setStepState] = useState<StepState>(
    initialSlug ? 'intro' : 'selection',
  );

  const config = useMemo(() => {
    return selectedConfig || getBreathingConfig('box-breathing');
  }, [selectedConfig]);

  const [selectedCycles, setSelectedCycles] = useState<number>(config.defaultCycles);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  const [currentCycle, setCurrentCycle] = useState<number>(0);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(config.phases[0].seconds);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

  const userPlan = useProfileStore((s) => s.userPlan);
  const activePlanId = useBillingStore((s) => s.activePlanId);
  const isPremiumUser =
    activePlanId === 'premium' || (userPlan && userPlan.toUpperCase() === 'PREMIUM');

  // Sync cycles when exercise changes
  useEffect(() => {
    setSelectedCycles(config.defaultCycles);
  }, [config]);

  const currentBreathPhase = config.phases[phaseIndex] || config.phases[0];

  const stateRef = useRef({ cycle: 0, phaseIndex: 0, secondsLeft: 0 });
  stateRef.current = { cycle: currentCycle, phaseIndex, secondsLeft };

  const handleFinish = useCallback(async () => {
    setStepState('complete');
    if (hapticsEnabled) void hapticSuccess();

    // Calculate duration in seconds
    const cycleSeconds = config.phases.reduce((acc, p) => acc + p.seconds, 0);
    const durationSec = Math.max(60, cycleSeconds * selectedCycles);

    // Send backend completion log (POST /api/wellness-activities/log)
    try {
      await wellnessRepository.logActivity(config.slug, durationSec);
    } catch (err: any) {
      if (!isPremiumUser) {
        setPremiumModalVisible(true);
      }
    }
  }, [config, selectedCycles, hapticsEnabled, isPremiumUser]);

  const handleStartSession = useCallback(() => {
    if (hapticsEnabled) void hapticSelection();
    setStepState('running');
    setCurrentCycle(0);
    setPhaseIndex(0);
    setSecondsLeft(config.phases[0].seconds);
  }, [config.phases, hapticsEnabled]);

  const handlePauseToggle = useCallback(() => {
    if (hapticsEnabled) void hapticLight();
    setStepState((prev) => (prev === 'running' ? 'paused' : 'running'));
  }, [hapticsEnabled]);

  const handleExitRequest = useCallback(() => {
    if (stepState === 'running' || stepState === 'paused') {
      Alert.alert(
        'Leave exercise?',
        'Your progress in this session will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              (navigation as any).navigate('MainTabs', { screen: 'ExploreTab' });
            },
          },
        ],
      );
    } else if (stepState === 'intro') {
      if (!initialSlug) {
        setStepState('selection');
      } else {
        (navigation as any).navigate('MainTabs', { screen: 'ExploreTab' });
      }
    } else {
      (navigation as any).navigate('MainTabs', { screen: 'ExploreTab' });
    }
  }, [stepState, initialSlug, navigation]);

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

  // Main Breathing Interval Timer
  useEffect(() => {
    if (stepState !== 'running') return;

    const timer = setInterval(() => {
      setSecondsLeft((prevSecs) => {
        if (prevSecs > 1) {
          return prevSecs - 1;
        }

        const { cycle: c, phaseIndex: pi } = stateRef.current;
        const nextPhaseIdx = pi + 1;

        if (nextPhaseIdx < config.phases.length) {
          const nextSecs = config.phases[nextPhaseIdx].seconds;
          setPhaseIndex(nextPhaseIdx);
          if (hapticsEnabled) void hapticLight();
          return nextSecs;
        }

        // Cycle completed
        const nextCycle = c + 1;
        if (nextCycle >= selectedCycles) {
          void handleFinish();
          return 0;
        }

        setCurrentCycle(nextCycle);
        setPhaseIndex(0);
        const resetSecs = config.phases[0].seconds;
        if (hapticsEnabled) void hapticLight();
        return resetSecs;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stepState, config.phases, selectedCycles, handleFinish, hapticsEnabled]);

  // STEP 1: BREATHING SELECTION SCREEN
  if (stepState === 'selection') {
    return (
      <BreathingSelectionScreen
        onSelectExercise={(selected) => {
          setSelectedConfig(selected);
          setStepState('intro');
        }}
        onBack={() => navigation.goBack()}
      />
    );
  }

  // STEP 4: COMPLETION VIEW
  if (stepState === 'complete') {
    return (
      <ActivityCompletionScreen
        title="Activity completed"
        message={`You took a moment for yourself today. Your ${config.title} session is complete.`}
        actionLabel="Done"
        onAction={() => (navigation as any).navigate('MainTabs', { screen: 'ExploreTab' })}
      />
    );
  }

  // STEP 3: RUNNING / PAUSED ACTIVE SESSION VIEW
  if (stepState === 'running' || stepState === 'paused') {
    return (
      <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
        {/* Session Header */}
        <View style={styles.sessionHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={handleExitRequest}>
            <Icon name="chevron-left" size={20} color="#4B5563" />
            <Text style={styles.backBtnText}>Exit</Text>
          </TouchableOpacity>
          <Text style={styles.sessionHeaderTitle}>{config.title}</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Central Session Body */}
        <View style={styles.sessionContainer}>
          <Text style={styles.phaseCategorySubtext}>CURRENT PHASE</Text>
          <Text style={styles.sessionPhaseLabel}>{currentBreathPhase.label}</Text>

          {/* Central Animated Breathing Visual */}
          <View style={styles.visualWrapper}>
            <BreathingVisual
              scaleTarget={currentBreathPhase.scale}
              durationSec={currentBreathPhase.seconds}
              secondsLeft={secondsLeft}
              isPaused={stepState === 'paused'}
            />
          </View>

          {/* Cycle Counter */}
          <Text style={styles.cycleCounterText}>
            Cycle {currentCycle + 1} of {selectedCycles}
          </Text>

          {/* Pause / Resume & End Early Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.pauseBtn} onPress={handlePauseToggle}>
              <Text style={styles.pauseBtnText}>
                {stepState === 'paused' ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endEarlyBtn} onPress={handleFinish}>
              <Text style={styles.endEarlyBtnText}>Done Early</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppScreen>
    );
  }

  // STEP 2: EXERCISE INTRO SCREEN
  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={handleExitRequest}>
          <Icon name="chevron-left" size={20} color="#4B5563" />
          <Text style={styles.backBtnText}>Breathing</Text>
        </TouchableOpacity>

        {/* Title & Description */}
        <View style={styles.titleBlock}>
          <Text style={styles.bulletTitle}>• {config.title}</Text>
          <Text style={styles.subtitleText}>{config.subtitle}</Text>
          <Text style={styles.descriptionText}>{config.description}</Text>
        </View>

        {/* Pattern Card */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.howItWorksHeader}>Pattern</Text>
          {config.howItWorks.map((stepText, idx) => (
            <Text key={idx} style={styles.stepText}>
              {stepText}
            </Text>
          ))}
        </View>

        {/* Duration Selection */}
        <View style={styles.settingBlock}>
          <Text style={styles.sectionLabel}>Duration</Text>
          <View style={styles.durationRow}>
            {config.durationOptions.map((opt) => {
              const isSelected = selectedCycles === opt.cycles;
              return (
                <TouchableOpacity
                  key={opt.cycles}
                  style={[styles.durationPill, isSelected && styles.durationPillActive]}
                  onPress={() => {
                    void hapticSelection();
                    setSelectedCycles(opt.cycles);
                  }}
                >
                  <Text style={[styles.durationText, isSelected && styles.durationTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.togglesCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Sound: {soundEnabled ? 'On' : 'Off'}</Text>
            <Switch
              value={soundEnabled}
              onValueChange={(val) => {
                void hapticLight();
                setSoundEnabled(val);
              }}
              trackColor={{ false: '#E5E7EB', true: '#9DB8E8' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Haptics: {hapticsEnabled ? 'On' : 'Off'}</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={(val) => {
                void hapticLight();
                setHapticsEnabled(val);
              }}
              trackColor={{ false: '#E5E7EB', true: '#9DB8E8' }}
            />
          </View>
        </View>

        {/* Begin CTA */}
        <TouchableOpacity style={styles.beginCtaBtn} onPress={handleStartSession} activeOpacity={0.85}>
          <Text style={styles.beginCtaText}>Begin</Text>
        </TouchableOpacity>

        <Text style={styles.stopAnytimeText}>You can stop whenever you like.</Text>
      </ScrollView>

      {/* Premium Limit Popup */}
      <PremiumLimitModal
        visible={premiumModalVisible}
        cardType="READING"
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  titleBlock: {
    marginBottom: Spacing.lg,
  },
  bulletTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0284C7',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  howItWorksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  howItWorksHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: Spacing.sm,
  },
  stepText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 4,
  },
  settingBlock: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  durationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  durationPill: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  durationPillActive: {
    backgroundColor: '#9DB8E8',
    borderColor: '#9DB8E8',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  durationTextActive: {
    color: '#1E293B',
  },
  togglesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: Spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  beginCtaBtn: {
    backgroundColor: '#9DB8E8',
    borderRadius: Radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  beginCtaText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  stopAnytimeText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },

  /* Active Session Styles */
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  sessionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  sessionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  phaseCategorySubtext: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sessionPhaseLabel: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: Spacing.lg,
  },
  visualWrapper: {
    marginVertical: Spacing.lg,
  },
  cycleCounterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pauseBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Radii.pill,
    backgroundColor: '#9DB8E8',
  },
  pauseBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  endEarlyBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Radii.pill,
    backgroundColor: '#E2E8F0',
  },
  endEarlyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
});
