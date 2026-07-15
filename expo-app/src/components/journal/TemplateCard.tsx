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
} from '../../app/design-system';
import { JournalTemplate } from '../../types/domain';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface TemplateCardProps {
  template: JournalTemplate;
  index?: number;
  onPress: (template: JournalTemplate) => void;
}

export const TemplateCard = memo<TemplateCardProps>(({
  template,
  index = 0,
  onPress,
}) => (
  <Animated.View entering={FadeInUp.delay(index * 40).duration(Motion.duration.normal)}>
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress(template);
      }}
      style={styles.card}
      android_ripple={
        Platform.OS === 'android' ? { color: 'transparent' } : undefined
      }
      {...buttonA11y(template.title, { hint: template.description })}
    >
      <View style={styles.icon}>
        <Icon name={template.icon} size={22} color={Colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {template.title}
        </Text>
        <Text style={styles.desc} numberOfLines={2} maxFontSizeMultiplier={1.25}>
          {template.description}
        </Text>
      </View>
    </Pressable>
  </Animated.View>
));

TemplateCard.displayName = 'TemplateCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
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
});
