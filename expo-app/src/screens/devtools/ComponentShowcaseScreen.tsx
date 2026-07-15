import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import {
  ShowcaseChip,
  GallerySection,
} from '../../components/devtools';
import { EmptyState, LoadingState } from '../../components/ui/states';
import { useDevToolsStore } from '../../store/devToolsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ComponentShowcase'>;
};

export const ComponentShowcaseScreen: React.FC<Props> = ({ navigation }) => {
  const stories = useDevToolsStore((s) => s.stories);
  const selectedStoryId = useDevToolsStore((s) => s.selectedStoryId);
  const selectStory = useDevToolsStore((s) => s.selectStory);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  useEffect(() => {
    if (!selectedStoryId && stories[0]) selectStory(stories[0].id);
  }, [selectedStoryId, stories, selectStory]);

  const active = useMemo(
    () => stories.find((s) => s.id === selectedStoryId) ?? stories[0],
    [stories, selectedStoryId],
  );

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Component Showcase"
        subtitle="Storybook-style"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.chips}>
        {stories.map((story) => (
          <ShowcaseChip
            key={story.id}
            label={story.title}
            selected={story.id === active?.id}
            onPress={() => selectStory(story.id)}
          />
        ))}
      </View>
      {active ? (
        <AppCard style={styles.meta}>
          <Text style={styles.category}>{active.category}</Text>
          <Text style={styles.title}>{active.title}</Text>
          <Text style={styles.desc}>{active.description}</Text>
        </AppCard>
      ) : null}
      <GallerySection title="Canvas">
        <View style={styles.canvas}>
          {active?.id === 's-card' ? (
            <AppCard style={styles.demoCard}>
              <Text style={styles.demoTitle}>AppCard</Text>
              <Text style={styles.demoBody}>
                Single ViewStyle prop · selected states supported.
              </Text>
            </AppCard>
          ) : null}
          {active?.id === 's-header' ? (
            <AppCard style={styles.demoCard}>
              <Text style={styles.demoTitle}>AppHeader pattern</Text>
              <Text style={styles.demoBody}>
                Title · subtitle · onBack — see screen chrome above.
              </Text>
            </AppCard>
          ) : null}
          {active?.id === 's-empty' ? (
            <EmptyState variant="therapists" />
          ) : null}
          {active?.id === 's-loading' ? (
            <LoadingState domain="default" />
          ) : null}
          {active?.id === 's-chip' ? (
            <View style={styles.chips}>
              <ShowcaseChip label="Idle" onPress={() => undefined} />
              <ShowcaseChip label="Selected" selected onPress={() => undefined} />
            </View>
          ) : null}
        </View>
      </GallerySection>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  meta: { gap: 4, marginBottom: Spacing.md },
  category: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  canvas: {
    minHeight: 180,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  demoCard: { gap: 4 },
  demoTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  demoBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
