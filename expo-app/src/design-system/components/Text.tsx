import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { Typography, TypographyVariant } from '../tokens/typography';
import { Colors } from '../tokens/colors';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color = Colors.textPrimary,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const variantStyle = Typography[variant] || Typography.bodyMedium;

  return (
    <RNText
      style={[
        variantStyle,
        { color, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
