import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { Avatar } from '../ui/Avatar';
import { getAiCompanionImage } from '../../assets';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface ChatHeaderProps {
  /** Design Chat screen.png primary title */
  title?: string;
  subtitle?: string;
  name?: string;
  statusLabel?: string;
  online?: boolean;
  /** When true, matches Design: title/subtitle then centered avatar (no side chrome) */
  designLayout?: boolean;
  onOpenHistory?: () => void;
  onOpenSearch?: () => void;
  onOpenVoice?: () => void;
  onOpenSettings?: () => void;
}

/** Companion header — Design default: Just listen + centered Pragya avatar */
export const ChatHeader = memo<ChatHeaderProps>(
  ({
    title = 'Just listen',
    subtitle = "I'm here to hear you rant.",
    name = 'Hey Attrangi',
    statusLabel,
    online = true,
    designLayout = true,
    onOpenHistory,
    onOpenSearch,
    onOpenVoice,
    onOpenSettings,
  }) => {
    const resolvedStatus = statusLabel ?? (online ? 'Online' : 'Offline');

    if (designLayout) {
      return (
        <View
          style={styles.designRoot}
          accessibilityRole="header"
          accessibilityLabel={`${title}. ${subtitle}`}
        >
          <View style={styles.designTop}>
            <View style={styles.designCopy}>
              <Text style={styles.designTitle} maxFontSizeMultiplier={1.35}>
                {title}
              </Text>
              <Text style={styles.designSubtitle} maxFontSizeMultiplier={1.3}>
                {subtitle}
              </Text>
            </View>
            <View style={styles.actions}>
              {onOpenSearch ? (
                <HeaderIcon
                  label="Search conversations"
                  onPress={onOpenSearch}
                  glyph="⌕"
                />
              ) : null}
              {onOpenHistory ? (
                <HeaderIcon
                  label="Conversation history"
                  onPress={onOpenHistory}
                  glyph="☰"
                />
              ) : null}
              {onOpenSettings ? (
                <HeaderIcon
                  label="AI settings"
                  onPress={onOpenSettings}
                  glyph="⚙"
                />
              ) : null}
            </View>
          </View>
          <Avatar
            source={getAiCompanionImage()}
            name={name}
            size="hero"
            shape="circle"
            style={styles.heroAvatar}
          />
        </View>
      );
    }

    return (
      <View
        style={styles.container}
        accessibilityRole="header"
        accessibilityLabel={`${name}, ${resolvedStatus}`}
      >
        <Avatar
          source={getAiCompanionImage()}
          name={name}
          size="md"
          shape="circle"
          style={styles.avatar}
        />
        <View style={styles.copy}>
          <Text style={styles.name} maxFontSizeMultiplier={1.3}>
            {name}
          </Text>
          <View style={styles.statusRow}>
            <View
              style={[styles.dot, online ? styles.dotOnline : styles.dotOffline]}
              accessibilityElementsHidden
            />
            <Text style={styles.status} maxFontSizeMultiplier={1.2}>
              {resolvedStatus}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          {onOpenSearch ? (
            <HeaderIcon label="Search conversations" onPress={onOpenSearch} glyph="⌕" />
          ) : null}
          {onOpenHistory ? (
            <HeaderIcon label="Conversation history" onPress={onOpenHistory} glyph="☰" />
          ) : null}
          {onOpenVoice ? (
            <HeaderIcon label="Voice conversation" onPress={onOpenVoice} glyph="◉" />
          ) : null}
          {onOpenSettings ? (
            <HeaderIcon label="AI settings" onPress={onOpenSettings} glyph="⚙" />
          ) : null}
        </View>
      </View>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';

const HeaderIcon = ({
  label,
  onPress,
  glyph,
}: {
  label: string;
  onPress: () => void;
  glyph: string;
}) => (
  <Pressable
    onPress={() => {
      void hapticSelection();
      onPress();
    }}
    style={styles.iconBtn}
    {...buttonA11y(label)}
  >
    <Text style={styles.iconGlyph}>{glyph}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  designRoot: {
    marginBottom: Spacing.md,
  },
  designTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  designCopy: {
    flex: 1,
    minWidth: 0,
  },
  designTitle: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  designSubtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  heroAvatar: {
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  avatar: {},
  copy: { flex: 1, minWidth: 0 },
  name: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  status: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
  },
  dotOnline: { backgroundColor: Colors.success },
  dotOffline: { backgroundColor: Colors.textMuted },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    ...Typography.title,
    color: Colors.textSecondary,
  },
});
