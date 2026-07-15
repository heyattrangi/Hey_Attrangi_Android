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
import { WellnessModule } from '../../types/domain';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface WellnessModuleCardProps {
  module: WellnessModule;
  favorited?: boolean;
  index?: number;
  onPress: (module: WellnessModule) => void;
  onToggleFavorite?: (module: WellnessModule) => void;
}

export const WellnessModuleCard = memo<WellnessModuleCardProps>(({
  module,
  favorited = false,
  index = 0,
  onPress,
  onToggleFavorite,
}) => (
  <Animated.View entering={FadeInUp.delay(index * 35).duration(Motion.duration.normal)}>
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress(module);
      }}
      style={styles.card}
      android_ripple={
        Platform.OS === 'android' ? { color: 'transparent' } : undefined
      }
      {...buttonA11y(module.title, {
        hint: `${module.durationMin} minutes, ${module.difficulty}`,
      })}
    >
      <View style={styles.icon}>
        <Icon name={module.icon} size={22} color={Colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {module.title}
        </Text>
        <Text style={styles.desc} numberOfLines={2} maxFontSizeMultiplier={1.25}>
          {module.description}
        </Text>
        <Text style={styles.meta} maxFontSizeMultiplier={1.2}>
          {module.durationMin} min · {module.difficulty} · {module.category}
        </Text>
      </View>
      {onToggleFavorite ? (
        <Pressable
          onPress={() => onToggleFavorite(module)}
          hitSlop={8}
          {...buttonA11y(favorited ? 'Remove favorite' : 'Add favorite')}
        >
          <Icon
            name={favorited ? Icons.bookmarkFilled : Icons.bookmark}
            size={22}
            color={favorited ? Colors.primary : Colors.textMuted}
          />
        </Pressable>
      ) : null}
    </Pressable>
  </Animated.View>
));

WellnessModuleCard.displayName = 'WellnessModuleCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    ...Shadows.low,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, minWidth: 0 },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
});
