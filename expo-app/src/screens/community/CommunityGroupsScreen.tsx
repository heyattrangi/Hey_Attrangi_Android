import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useCommunityStore } from '../../store/communityStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'CommunityGroups'>;
};

export const CommunityGroupsScreen: React.FC<Props> = ({ navigation }) => {
  const groups = useCommunityStore((s) => s.groups);
  const loadSnapshot = useCommunityStore((s) => s.loadSnapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Groups"
        subtitle="Small peer pods"
        onBack={() => navigation.goBack()}
      />
      {groups.map((g) => (
        <AppCard key={g.id} style={styles.card}>
          <Text style={styles.title}>{g.name}</Text>
          <Text style={styles.body}>{g.description}</Text>
          <Text style={styles.meta}>
            {g.memberCount} members
            {g.wellnessFocus ? ` · ${g.wellnessFocus}` : ''}
            {g.isAnonymousFriendly ? ' · Anonymous friendly' : ''}
          </Text>
        </AppCard>
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm, gap: 4 },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
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
