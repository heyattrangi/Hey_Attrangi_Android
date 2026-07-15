import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionHeader } from '../ui/SectionHeader';
import { AiRecommendationCard } from './AiRecommendationCard';
import { PersonalizationEmpty } from './PersonalizationEmpty';
import { PersonalizedRecommendation } from '../../types/domain';

export interface RecommendationFeedSectionProps {
  items: PersonalizedRecommendation[];
  title?: string;
  subtitle?: string;
  onPressItem?: (item: PersonalizedRecommendation) => void;
  onDismiss?: (id: string) => void;
  onViewAll?: () => void;
  limit?: number;
}

export const RecommendationFeedSection = memo<RecommendationFeedSectionProps>(({
  items,
  title = 'For you',
  subtitle = 'AI recommendations — personalized later by backend',
  onPressItem,
  onDismiss,
  onViewAll,
  limit,
}) => {
  const list = typeof limit === 'number' ? items.slice(0, limit) : items;

  return (
    <View style={styles.wrap}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actionLabel={onViewAll ? 'Feed' : undefined}
        onAction={onViewAll}
      />
      {list.length === 0 ? (
        <PersonalizationEmpty kind="recommendations" compact />
      ) : (
        list.map((item, index) => (
          <AiRecommendationCard
            key={item.id}
            recommendation={item}
            index={index}
            onPress={onPressItem}
            onDismiss={onDismiss}
          />
        ))
      )}
    </View>
  );
});

RecommendationFeedSection.displayName = 'RecommendationFeedSection';

const styles = StyleSheet.create({
  wrap: {},
});
