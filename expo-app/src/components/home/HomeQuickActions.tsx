import React, { memo } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Motion } from '../../app/design-system';
import { Icons } from '../../theme/icons';
import { ExploreCard } from '../ui/ExploreCard';

export interface HomeQuickActionsProps {
  onExploreTherapists: () => void;
  onTalkToAi: () => void;
  onBookSession?: () => void;
  onTrackMood?: () => void;
  onJournal?: () => void;
  onWellness?: () => void;
  style?: ViewStyle;
}

/**
 * Design Home.png Explore + Spec quick actions.
 * All cards navigate to real screens — never empty placeholders.
 */
export const HomeQuickActions = memo<HomeQuickActionsProps>(({
  onExploreTherapists,
  onTalkToAi,
  onBookSession,
  onTrackMood,
  onJournal,
  onWellness,
  style,
}) => (
  <Animated.View
    entering={FadeInUp.delay(40).duration(Motion.duration.normal)}
    style={style}
  >
    <Text style={styles.sectionLabel}>Explore</Text>
    <View style={styles.row}>
      <ExploreCard
        title="Explore therapists"
        subtitle="Browse professionals"
        icon={Icons.people}
        iconColor={Colors.accentPurple}
        onPress={onExploreTherapists}
      />
      <ExploreCard
        title="Talk to Pragya AI"
        subtitle="Chat with your companion"
        icon={Icons.sparkles}
        iconColor={Colors.accentYellow}
        onPress={onTalkToAi}
      />
    </View>
    {onBookSession || onTrackMood ? (
      <View style={styles.row}>
        {onBookSession ? (
          <ExploreCard
            title="Book a session"
            subtitle="Find a time that works"
            icon={Icons.book}
            iconColor={Colors.primary}
            onPress={onBookSession}
          />
        ) : (
          <View style={styles.spacer} />
        )}
        {onTrackMood ? (
          <ExploreCard
            title="Mood history"
            subtitle="See your patterns"
            icon={Icons.mood}
            iconColor={Colors.confirmedGreen}
            onPress={onTrackMood}
          />
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    ) : null}
    {onJournal || onWellness ? (
      <View style={styles.row}>
        {onJournal ? (
          <ExploreCard
            title="Journal"
            subtitle="Reflect & grow"
            icon={Icons.journal}
            iconColor={Colors.primary}
            onPress={onJournal}
          />
        ) : (
          <View style={styles.spacer} />
        )}
        {onWellness ? (
          <ExploreCard
            title="Wellness Hub"
            subtitle="Breathe & reset"
            icon={Icons.leaf}
            iconColor={Colors.confirmedGreen}
            onPress={onWellness}
          />
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    ) : null}
  </Animated.View>
));

HomeQuickActions.displayName = 'HomeQuickActions';

const styles = StyleSheet.create({
  sectionLabel: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -Spacing.xs,
    marginBottom: Spacing.sm,
  },
  spacer: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
});
