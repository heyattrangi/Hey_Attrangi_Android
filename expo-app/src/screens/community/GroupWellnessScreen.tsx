import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useCommunityStore } from '../../store/communityStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'GroupWellness'>;
};

export const GroupWellnessScreen: React.FC<Props> = ({ navigation }) => {
  const groupWellness = useCommunityStore((s) => s.groupWellness);
  const loadGroupWellness = useCommunityStore((s) => s.loadGroupWellness);

  useEffect(() => {
    void loadGroupWellness();
  }, [loadGroupWellness]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Group Wellness"
        subtitle="Aggregate peer health signals"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        High-level group wellness — never individual private journals.
      </Text>
      {groupWellness.map((g) => (
        <AppCard key={g.groupId} style={styles.card}>
          <Text style={styles.title}>{g.groupName}</Text>
          <Text style={styles.stat}>{g.checkInsThisWeek} check-ins this week</Text>
          <Text style={styles.body}>{g.moodTrendLabel}</Text>
          <Text style={styles.meta}>
            Themes: {g.topThemes.join(', ')} · {g.participationLabel}
          </Text>
        </AppCard>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  lead: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  card: { marginBottom: Spacing.sm, gap: 4 },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stat: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
