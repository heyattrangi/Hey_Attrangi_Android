import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../app/design-system';
import { AppImage } from '../app/AppImage';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

export interface AvatarProps {
  source?: ImageSourcePropType;
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  shape?: 'rounded' | 'circle';
  style?: ViewStyle;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 72,
  xl: 96,
  /** Premium marketplace / profile hero */
  hero: 112,
};

const initialsFromName = (name?: string) => {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const Avatar = memo<AvatarProps>(({
  source,
  uri,
  name,
  size = 'md',
  shape = 'rounded',
  style,
}) => {
  const dim = SIZE_MAP[size];
  const radius = shape === 'circle' ? Radius.full : Radius.large;
  const useRemote =
    !!uri && (uri.startsWith('http://') || uri.startsWith('https://'));
  const imageSource = useRemote ? { uri } : source;

  return (
    <View
      style={[
        styles.base,
        {
          width: dim,
          height: dim,
          borderRadius: radius,
        },
        style,
      ]}
    >
      {imageSource ? (
        <AppImage
          source={
            typeof imageSource === 'number'
              ? imageSource
              : Array.isArray(imageSource)
                ? imageSource[0]
                : imageSource
          }
          accessibilityLabel={name ? `Photo of ${name}` : 'Profile photo'}
          contentFit="cover"
          borderRadius={radius}
          aspectRatio={1}
          showPlaceholder={false}
          containerStyle={styles.imageFill}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={[styles.initials, size === 'sm' && styles.initialsSm]}>
            {initialsFromName(name)}
          </Text>
        </View>
      )}
    </View>
  );
});

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: Colors.primaryLight,
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xs,
  },
  initials: {
    ...Typography.title,
    color: Colors.primaryDark,
  },
  initialsSm: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
