import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import {
  ConnectionBadge,
  CountdownClock,
} from '../../components/session';
import { SkeletonList } from '../../components/async';
import { EmptyState } from '../../components/ui/states';
import { WAITING_ROOM_TIPS } from '../../mocks/mockSessionExperience';
import { useSessionExperienceStore } from '../../store/sessionExperienceStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { getTherapistImage } from '../../assets';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'WaitingRoom'>;
  route: RouteProp<MainStackParamList, 'WaitingRoom'>;
};

export const WaitingRoomScreen: React.FC<Props> = ({ navigation, route }) => {
  const reduceMotion = useReducedMotion();
  const session = useSessionExperienceStore((s) => s.session);
  const devices = useSessionExperienceStore((s) => s.devices);
  const connection = useSessionExperienceStore((s) => s.connection);
  const joinStatus = useSessionExperienceStore((s) => s.joinStatus);
  const error = useSessionExperienceStore((s) => s.error);
  const loadSession = useSessionExperienceStore((s) => s.loadSession);
  const setPhase = useSessionExperienceStore((s) => s.setPhase);
  const reset = useSessionExperienceStore((s) => s.reset);

  useEffect(() => {
    reset();
    loadSession(route.params.sessionId);
  }, [loadSession, reset, route.params.sessionId]);

  if (joinStatus === 'loading' && !session) {
    return (
      <AppScreen includeBottomInset gradient="topRightWarm">
        <AppHeader title="Waiting Room" onBack={() => navigation.goBack()} />
        <SkeletonList count={3} />
      </AppScreen>
    );
  }

  if (joinStatus === 'error' || !session) {
    return (
      <AppScreen includeBottomInset gradient="topRightWarm">
        <AppHeader title="Waiting Room" onBack={() => navigation.goBack()} />
        <EmptyState
          variant="sessions"
          title="Connection failed"
          message={error?.message ?? 'We could not load this session.'}
          actionLabel="Retry"
          onAction={() => loadSession(route.params.sessionId)}
        />
      </AppScreen>
    );
  }

  const photo = getTherapistImage(session.therapistId);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Waiting Room"
        subtitle="Prepare for your therapy session"
        onBack={() => navigation.goBack()}
      />

      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(Motion.duration.normal)}
      >
        <AppCard style={styles.hero}>
          <Image source={photo} style={styles.avatar} />
          <Text style={styles.name}>{session.therapistName}</Text>
          <Text style={styles.meta}>
            {session.therapistSpecialty} · {session.type}
          </Text>
          <Text style={styles.time}>
            {session.date} · {session.time}
          </Text>
          <Text style={styles.duration}>
            Duration {session.durationMinutes ?? 60} min
          </Text>
          <View style={styles.countdown}>
            <CountdownClock startsAt={session.startsAt} />
          </View>
          <ConnectionBadge quality={connection} />
        </AppCard>

        <AppCard style={styles.statusCard}>
          <Text style={styles.section}>Device status</Text>
          <StatusRow
            icon="video-outline"
            label="Camera"
            value={devices.camera === 'granted' ? 'Ready' : 'Needs access'}
            ok={devices.camera === 'granted'}
          />
          <StatusRow
            icon="microphone"
            label="Microphone"
            value={devices.microphone === 'granted' ? 'Ready' : 'Needs access'}
            ok={devices.microphone === 'granted'}
          />
          <StatusRow
            icon="wifi"
            label="Network"
            value={devices.network === 'granted' ? 'Online' : 'Check connection'}
            ok={devices.network === 'granted'}
          />
        </AppCard>

        <Text style={styles.section}>Preparation tips</Text>
        {WAITING_ROOM_TIPS.map((tip) => (
          <View key={tip.id} style={styles.tip}>
            <Icon name="check-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}

        <PrimaryButton
          label="Continue"
          showArrow
          onPress={() => {
            setPhase('permissions');
            navigation.navigate('SessionPermissions', {
              sessionId: session.id,
              therapistName: session.therapistName,
            });
          }}
        />
      </Animated.View>
    </AppScreen>
  );
};

const StatusRow = ({
  icon,
  label,
  value,
  ok,
}: {
  icon: string;
  label: string;
  value: string;
  ok: boolean;
}) => (
  <View style={styles.statusRow}>
    <Icon name={icon} size={20} color={Colors.textPrimary} />
    <Text style={styles.statusLabel}>{label}</Text>
    <Text style={[styles.statusValue, ok && styles.statusOk]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: Spacing.sm,
  },
  name: {
    ...Typography.heading3,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  time: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
  duration: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  countdown: { marginVertical: Spacing.md },
  statusCard: { marginBottom: Spacing.md },
  section: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
  statusLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusValue: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  statusOk: { color: Colors.success },
  tip: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
  tipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
});
