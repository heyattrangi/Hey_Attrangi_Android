import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppScreen, AppHeader, AppCard, Icon } from '../../components/app';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'SessionComplete'>;
  route: RouteProp<MainStackParamList, 'SessionComplete'>;
};

export const SessionCompleteScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const reduceMotion = useReducedMotion();
  const { therapistName, durationMinutes, sessionId } = route.params;

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader title="Session complete" onBack={() => navigation.goBack()} />

      <Animated.View
        entering={
          reduceMotion ? undefined : ZoomIn.duration(Motion.duration.normal)
        }
        style={styles.hero}
      >
        <View style={styles.iconCircle}>
          <Icon name="check-circle" size={48} color={Colors.success} />
        </View>
        <Text style={styles.title}>Well done for showing up</Text>
        <Text style={styles.subtitle}>
          You completed a session with {therapistName}
        </Text>
      </Animated.View>

      <Animated.View
        entering={
          reduceMotion
            ? undefined
            : FadeInDown.delay(80).duration(Motion.duration.normal)
        }
      >
        <AppCard style={styles.card}>
          <Row label="Duration" value={`${durationMinutes} min`} />
          <Row label="Therapist" value={therapistName} />
          <Row label="Next session" value="Schedule when ready" />
        </AppCard>

        <AppCard style={styles.placeholder}>
          <Text style={styles.phTitle}>AI Reflection</Text>
          <Text style={styles.phBody}>
            A gentle summary from Pragya will appear here after the AI API is
            connected.
          </Text>
        </AppCard>

        <Text style={styles.section}>Continue your care</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => navigation.navigate('JournalHome')}
          {...buttonA11y('Journal reminder')}
        >
          <Icon name="notebook-outline" size={22} color={Colors.primary} />
          <Text style={styles.ctaText}>Journal reminder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cta}
          onPress={() =>
            navigation.navigate('MainTabs', { screen: 'MoodTab' })
          }
          {...buttonA11y('Mood check-in')}
        >
          <Icon name="emoticon-outline" size={22} color={Colors.primary} />
          <Text style={styles.ctaText}>Mood check-in</Text>
        </TouchableOpacity>

        <PrimaryButton
          label="Share feedback"
          showArrow
          onPress={() =>
            navigation.navigate('SessionFeedback', {
              sessionId,
              therapistName,
            })
          }
        />
        <TouchableOpacity
          style={styles.home}
          onPress={() =>
            navigation.navigate('MainTabs', { screen: 'HomeTab' })
          }
          {...buttonA11y('Back home')}
        >
          <Text style={styles.homeText}>Back Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </AppScreen>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: Spacing.lg },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(56, 161, 105, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.heading3,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  card: { marginBottom: Spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  rowValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  placeholder: {
    marginBottom: Spacing.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  phTitle: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  phBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: 52,
  },
  ctaText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  home: {
    alignItems: 'center',
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  homeText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
});
