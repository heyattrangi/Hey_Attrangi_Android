import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, Shadows, Spacing, Icons, Motion } from '../../app/design-system';
import { Avatar } from './Avatar';
import { Icon } from '../app/Icon';
import { buttonA11y } from '../../utils/accessibility';

export interface ProfileCardProps {
  name: string;
  email?: string;
  phone?: string;
  subtitle?: string;
  image?: ImageSourcePropType;
  imageUrl?: string | null;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ProfileCard = memo<ProfileCardProps>(({
  name,
  email,
  phone,
  subtitle,
  image,
  imageUrl,
  onPress,
  style,
}) => {
  const content = (
    <View style={[styles.card, style]}>
      <Avatar
        source={image}
        uri={imageUrl}
        name={name}
        size="xl"
        shape="circle"
      />
      <View style={styles.info}>
        <Text style={styles.name} maxFontSizeMultiplier={1.3}>
          {name}
        </Text>
        {subtitle ? (
          <Text style={styles.meta} maxFontSizeMultiplier={1.3}>
            {subtitle}
          </Text>
        ) : null}
        {email ? (
          <Text style={styles.meta} maxFontSizeMultiplier={1.3}>
            {email}
          </Text>
        ) : null}
        {phone ? (
          <Text style={styles.meta} maxFontSizeMultiplier={1.3}>
            {phone}
          </Text>
        ) : null}
      </View>
      {onPress ? (
        <Icon name={Icons.chevronRight} size={22} color={Colors.textMuted} />
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={Motion.opacity.pressed}
      {...buttonA11y(name, { hint: 'Opens profile details' })}
    >
      {content}
    </TouchableOpacity>
  );
});

ProfileCard.displayName = 'ProfileCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    ...Shadows.low,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: 2,
  },
  name: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  meta: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
