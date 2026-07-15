import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
  Icons,
} from '../../app/design-system';
import { MeditationSession } from '../../types/domain';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface MeditationCardProps {
  session: MeditationSession;
  completed?: boolean;
  index?: number;
  onPlay?: (session: MeditationSession) => void;
}

export const MeditationCard = memo<MeditationCardProps>(({
  session,
  completed = false,
  index = 0,
  onPlay,
}) => (
  <Animated.View entering={FadeInUp.delay(index * 40).duration(Motion.duration.normal)}>
    <View style={styles.card}>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {session.title}
          </Text>
          {completed ? (
            <View style={styles.badge}>
              <Icon name={Icons.check} size={12} color={Colors.white} />
              <Text style={styles.badgeText}>Done</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.desc} numberOfLines={2} maxFontSizeMultiplier={1.25}>
          {session.description}
        </Text>
        <Text style={styles.meta}>
          {session.durationMin} min · {session.category}
        </Text>
      </View>
      <Pressable
        style={styles.play}
        onPress={() => {
          void hapticSelection();
          onPlay?.(session);
        }}
        android_ripple={
          Platform.OS === 'android' ? { color: 'transparent' } : undefined
        }
        {...buttonA11y(`Play ${session.title}`, {
          hint: 'Audio playback will connect later',
        })}
      >
        <Icon name={Icons.play} size={22} color={Colors.white} />
      </Pressable>
    </View>
  </Animated.View>
));

MeditationCard.displayName = 'MeditationCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    ...Shadows.low,
  },
  copy: { flex: 1, minWidth: 0 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.confirmedGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  play: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
});
