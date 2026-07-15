import React, { useEffect } from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useChatStore } from '../../store/chatStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AiTimeline'>;
};

export const AiTimelineScreen: React.FC<Props> = ({ navigation }) => {
  const timeline = useChatStore((s) => s.timeline);
  const loadIntelligenceSurfaces = useChatStore((s) => s.loadIntelligenceSurfaces);

  useEffect(() => {
    void loadIntelligenceSurfaces();
  }, [loadIntelligenceSurfaces]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="AI Timeline"
        subtitle="Conversation intelligence history"
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={timeline}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Timeline will fill as you chat.</Text>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.card}>
            <Text style={styles.meta}>
              {new Date(item.at).toLocaleString()} · {item.kind}
            </Text>
            <Text style={styles.title} maxFontSizeMultiplier={1.3}>
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text style={styles.sub} maxFontSizeMultiplier={1.3}>
                {item.subtitle}
              </Text>
            ) : null}
          </AppCard>
        )}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  list: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  card: { marginBottom: Spacing.sm, gap: 4 },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
