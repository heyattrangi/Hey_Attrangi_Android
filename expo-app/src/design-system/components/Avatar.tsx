import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType, ViewStyle } from 'react-native';
import { Colors } from '../tokens/colors';

export interface AvatarProps {
  source?: ImageSourcePropType | string;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 40,
  backgroundColor = Colors.brandPrimary,
  style,
  children,
}) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
  };

  return (
    <View style={[styles.avatar, containerStyle, style]}>
      {source ? (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
});
