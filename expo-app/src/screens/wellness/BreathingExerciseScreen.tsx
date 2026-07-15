import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { SuccessState } from '../../components/ui/states';
import { BreathingCircle } from '../../components/wellness';
import { useWellnessStore } from '../../store/wellnessStore';
import { MainStackParamList } from '../../navigation/types';
import { BreathingPatternId } from '../../types/domain';
import {
  Colors,
  Typography,
  Spacing,
  Motion,
} from '../../app/design-system';
import { hapticSuccess } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'BreathingExercise'>;
  route: RouteProp<MainStackParamList, 'BreathingExercise'>;
};

type Phase = 'idle' | 'running' | 'complete';

export const BreathingExerciseScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const breathing = useWellnessStore((s) => s.breathing);
  const recordBreathingSession = useWellnessStore((s) => s.recordBreathingSession);

  const [exerciseId, setExerciseId] = useState<BreathingPatternId>(
    route.params?.exerciseId ?? 'box',
  );
  const exercise = useMemo(
    () => breathing.find((b) => b.id === exerciseId) ?? breathing[0],
    [breathing, exerciseId],
  );

  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [phaseTotal, setPhaseTotal] = useState(1);

  const stateRef = useRef({ cycle: 0, phaseIndex: 0 });
  stateRef.current = { cycle, phaseIndex };

  const currentPhase = exercise.phases[phaseIndex];
  const expanding =
    currentPhase?.label.toLowerCase().includes('inhale') ?? true;

  const finish = useCallback(() => {
    setPhase('complete');
    recordBreathingSession();
    void hapticSuccess();
  }, [recordBreathingSession]);

  const start = useCallback(() => {
    setPhase('running');
    setCycle(0);
    setPhaseIndex(0);
    setSecondsLeft(exercise.phases[0].seconds);
    setPhaseTotal(exercise.phases[0].seconds);
  }, [exercise.phases]);

  useEffect(() => {
    if (phase !== 'running') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        const { cycle: c, phaseIndex: pi } = stateRef.current;
        const nextPhase = pi + 1;

        if (nextPhase < exercise.phases.length) {
          const secs = exercise.phases[nextPhase].seconds;
          setPhaseIndex(nextPhase);
          setPhaseTotal(secs);
          return secs;
        }

        const nextCycle = c + 1;
        if (nextCycle >= exercise.cycles) {
          finish();
          return 0;
        }

        setCycle(nextCycle);
        setPhaseIndex(0);
        const secs = exercise.phases[0].seconds;
        setPhaseTotal(secs);
        return secs;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exercise.cycles, exercise.phases, finish, phase]);

  const phaseProgress =
    phaseTotal > 0 ? (phaseTotal - secondsLeft) / phaseTotal : 0;
  const sessionProgress =
    (cycle * exercise.phases.length + phaseIndex) /
    (exercise.cycles * exercise.phases.length || 1);

  if (phase === 'complete') {
    return (
      <AppScreen scrollable={false} gradient="topRightWarm">
        <Animated.View
          entering={ZoomIn.duration(Motion.duration.normal)}
          style={styles.flex}
        >
          <SuccessState
            variant="moodSaved"
            title="Session complete"
            message={`Nice work with ${exercise.title}. Your nervous system just got a reset.`}
            actionLabel="Back to Wellness"
            onAction={() => navigation.navigate('WellnessHub')}
          />
        </Animated.View>
      </AppScreen>
    );
  }

  return (
    <AppScreen gradient="topRightWarm" includeBottomInset>
      <AppHeader
        title="Breathing"
        subtitle={exercise.title}
        onBack={() => navigation.goBack()}
      />

      {phase === 'idle' ? (
        <>
          <SegmentedControl
            options={breathing.map((b) => ({
              label: b.id === '478' ? '4-7-8' : b.title.split(' ')[0],
              value: b.id,
            }))}
            value={exerciseId}
            onChange={(v) => setExerciseId(v as BreathingPatternId)}
            style={styles.segments}
          />
          <AppCard style={styles.card}>
            <Text style={styles.title}>{exercise.title}</Text>
            <Text style={styles.body}>{exercise.description}</Text>
            <Text style={styles.meta}>
              {exercise.durationMin} min · {exercise.cycles} cycles
            </Text>
          </AppCard>
          <PrimaryButton label="Start session" onPress={start} showArrow />
        </>
      ) : (
        <Animated.View entering={FadeIn.duration(Motion.duration.fast)}>
          <Text style={styles.cycleLabel}>
            Cycle {cycle + 1} of {exercise.cycles}
          </Text>
          <BreathingCircle
            phaseLabel={currentPhase?.label ?? 'Breathe'}
            secondsLeft={Math.max(secondsLeft, 0)}
            phaseProgress={phaseProgress}
            expanding={expanding}
          />
          <View style={styles.sessionTrack}>
            <View
              style={[
                styles.sessionFill,
                { width: `${Math.min(sessionProgress * 100, 100)}%` },
              ]}
            />
          </View>
          <SecondaryButton
            label="End early"
            onPress={finish}
            size="full"
          />
        </Animated.View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  segments: { marginBottom: Spacing.md },
  card: { marginBottom: Spacing.lg },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    fontWeight: '600',
  },
  cycleLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  sessionTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.calendarInactive,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  sessionFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});
