import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Share, Alert } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
  Icons,
} from '../../app/design-system';
import { Affirmation } from '../../types/domain';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection, hapticSuccess } from '../../utils/haptics';

export interface AffirmationCardProps {
  affirmation: Affirmation;
  favorited?: boolean;
  onFavorite?: () => void;
  onNext?: () => void;
  onSave?: () => void;
}

export const AffirmationCard = memo<AffirmationCardProps>(({
  affirmation,
  favorited = false,
  onFavorite,
  onNext,
  onSave,
}) => {
  const share = async () => {
    void hapticSelection();
    try {
      await Share.share({ message: affirmation.text });
    } catch {
      Alert.alert('Share', 'Unable to open share sheet.');
    }
  };

  return (
    <Animated.View
      key={affirmation.id}
      entering={FadeIn.duration(Motion.duration.normal)}
      style={styles.card}
    >
      <Text style={styles.category} maxFontSizeMultiplier={1.2}>
        {affirmation.category}
      </Text>
      <Animated.Text
        entering={ZoomIn.duration(Motion.duration.normal)}
        style={styles.text}
        maxFontSizeMultiplier={1.4}
        accessibilityRole="text"
      >
        “{affirmation.text}”
      </Animated.Text>
      <View style={styles.actions}>
        <Action
          icon={favorited ? Icons.heartFilled : Icons.heart}
          label="Favorite"
          onPress={() => {
            void hapticSelection();
            onFavorite?.();
          }}
          active={favorited}
        />
        <Action icon={Icons.share} label="Share" onPress={share} />
        <Action
          icon={Icons.bookmark}
          label="Save"
          onPress={() => {
            void hapticSuccess();
            onSave?.();
            Alert.alert('Saved', 'Affirmation saved for later (local).');
          }}
        />
        <Action
          icon={Icons.forward}
          label="Next"
          onPress={() => {
            void hapticSelection();
            onNext?.();
          }}
        />
      </View>
    </Animated.View>
  );
});

AffirmationCard.displayName = 'AffirmationCard';

const Action = ({
  icon,
  label,
  onPress,
  active,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  active?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    style={styles.action}
    android_ripple={
      Platform.OS === 'android' ? { color: 'transparent' } : undefined
    }
    {...buttonA11y(label)}
  >
    <Icon
      name={icon}
      size={20}
      color={active ? Colors.primary : Colors.textPrimary}
    />
    <Text style={styles.actionLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.xxlarge,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.35)',
    ...Shadows.medium,
    minHeight: 280,
    justifyContent: 'center',
  },
  category: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  text: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xl,
  },
  action: {
    alignItems: 'center',
    gap: 4,
    minWidth: 64,
    minHeight: 48,
    justifyContent: 'center',
  },
  actionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
