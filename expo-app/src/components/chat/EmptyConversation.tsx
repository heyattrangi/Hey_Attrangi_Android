import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  Motion,
  Icons,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { getAiCompanionImage } from '../../assets';
import { CONVERSATION_STARTERS } from './constants';
import { hapticSelection } from '../../utils/haptics';
import { buttonA11y } from '../../utils/accessibility';

export { CONVERSATION_STARTERS };

export interface EmptyConversationProps {
  onSelectStarter: (text: string) => void;
  userName?: string;
}

/**
 * Empty companion state — welcome illustration, greeting, conversation starters.
 * No chat-mode picker.
 */
export const EmptyConversation = memo<EmptyConversationProps>(({
  onSelectStarter,
  userName,
}) => {
  const greeting = userName?.trim()
    ? `Hi ${userName.trim()}, I'm here with you`
    : "Hi, I'm here with you";

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(Motion.duration.normal)}
        style={styles.heroWrap}
      >
        <Image
          source={getAiCompanionImage()}
          style={styles.hero}
          accessibilityIgnoresInvertColors
          accessibilityLabel="Hey Attrangi companion"
        />
      </Animated.View>

      <Animated.Text
        entering={FadeInUp.delay(40).duration(Motion.duration.normal)}
        style={styles.greeting}
        accessibilityRole="header"
        maxFontSizeMultiplier={1.3}
      >
        {greeting}
      </Animated.Text>
      <Animated.Text
        entering={FadeInUp.delay(80).duration(Motion.duration.normal)}
        style={styles.subtitle}
        maxFontSizeMultiplier={1.3}
      >
        This is a safe space. Share whatever feels heavy — or start with one of these.
      </Animated.Text>

      <View style={styles.starters}>
        {CONVERSATION_STARTERS.map((starter, index) => (
          <Animated.View
            key={starter.id}
            entering={FadeInUp.delay(100 + index * 45).duration(Motion.duration.normal)}
          >
            <Pressable
              onPress={() => {
                void hapticSelection();
                onSelectStarter(starter.text);
              }}
              style={({ pressed }) => [
                styles.starter,
                pressed && styles.starterPressed,
              ]}
              android_ripple={
                Platform.OS === 'android' ? { color: 'transparent' } : undefined
              }
              {...buttonA11y(starter.text, {
                hint: 'Starts a conversation with this prompt',
              })}
            >
              <Text style={styles.starterText} maxFontSizeMultiplier={1.25}>
                {starter.text}
              </Text>
              <Icon name={Icons.chevronRight} size={18} color={Colors.textMuted} />
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
});

EmptyConversation.displayName = 'EmptyConversation';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  heroWrap: {
    alignSelf: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
    borderRadius: Radius.xxlarge,
    overflow: 'hidden',
  },
  hero: {
    width: 160,
    height: 160,
    borderRadius: Radius.xxlarge,
  },
  greeting: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  starters: {
    gap: Spacing.sm,
  },
  starter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 52,
    ...Shadows.low,
  },
  starterPressed: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  starterText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    paddingRight: Spacing.sm,
  },
});
