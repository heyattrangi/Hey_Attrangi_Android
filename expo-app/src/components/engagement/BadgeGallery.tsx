import React, { memo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { SectionHeader } from '../ui/SectionHeader';
import { AchievementCard } from './AchievementCard';
import { EngagementEmpty } from './EngagementEmpty';
import { Achievement } from '../../types/domain';

export interface BadgeGalleryProps {
  unlocked: Achievement[];
  locked: Achievement[];
  upcoming: Achievement[];
  recentlyEarned: Achievement[];
  rare: Achievement[];
  onPressBadge?: (a: Achievement) => void;
}

function Section({
  title,
  subtitle,
  items,
  onPress,
  horizontal,
}: {
  title: string;
  subtitle?: string;
  items: Achievement[];
  onPress?: (a: Achievement) => void;
  horizontal?: boolean;
}) {
  if (items.length === 0) return null;
  if (horizontal) {
    return (
      <View style={styles.section}>
        <SectionHeader title={title} subtitle={subtitle} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hRow}
        >
          {items.map((a, i) => (
            <AchievementCard
              key={a.id}
              achievement={a}
              index={i}
              compact
              onPress={onPress}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={styles.section}>
      <SectionHeader title={title} subtitle={subtitle} />
      <View style={styles.grid}>
        {items.map((a, i) => (
          <AchievementCard
            key={a.id}
            achievement={a}
            index={i}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
}

export const BadgeGallery = memo<BadgeGalleryProps>(({
  unlocked,
  locked,
  upcoming,
  recentlyEarned,
  rare,
  onPressBadge,
}) => {
  const empty =
    unlocked.length === 0 &&
    locked.length === 0 &&
    upcoming.length === 0;

  if (empty) {
    return <EngagementEmpty kind="achievements" />;
  }

  return (
    <View>
      <Section
        title="Recently earned"
        subtitle="Soft wins worth noticing"
        items={recentlyEarned.slice(0, 6)}
        onPress={onPressBadge}
        horizontal
      />
      <Section
        title="Unlocked"
        items={unlocked}
        onPress={onPressBadge}
      />
      <Section
        title="Upcoming"
        subtitle="Almost there — no rush"
        items={upcoming}
        onPress={onPressBadge}
      />
      <Section
        title="Rare achievements"
        subtitle="Quiet milestones"
        items={rare}
        onPress={onPressBadge}
      />
      <Section
        title="Locked"
        subtitle="Waiting gently for the right moment"
        items={locked.filter((a) => !a.isUpcoming)}
        onPress={onPressBadge}
      />
      {unlocked.length === 0 ? (
        <Text style={styles.hint} maxFontSizeMultiplier={1.25}>
          Your first badge unlocks with a single check-in.
        </Text>
      ) : null}
    </View>
  );
});

BadgeGallery.displayName = 'BadgeGallery';

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  hRow: { gap: Spacing.sm, paddingRight: Spacing.md },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
