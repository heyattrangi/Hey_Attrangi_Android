import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

interface BackButtonProps {
  onPress: () => void;
  accessibilityLabel?: string;
}

export const BackButton = memo<BackButtonProps>(({
  onPress,
  accessibilityLabel = 'Go back',
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      {...buttonA11y(accessibilityLabel, { hint: 'Returns to the previous screen' })}
    >
      <View style={styles.arrowContainer} importantForAccessibility="no-hide-descendants">
        <View style={styles.arrowMain} />
        <View style={styles.arrowTop} />
        <View style={styles.arrowBottom} />
      </View>
    </TouchableOpacity>
  );
});

BackButton.displayName = 'BackButton';

const styles = StyleSheet.create({
  button: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  arrowMain: {
    position: 'absolute',
    height: 2.5,
    width: 18,
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
    left: 1,
  },
  arrowTop: {
    position: 'absolute',
    height: 2.5,
    width: 10,
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
    top: 5.5,
    left: 0,
  },
  arrowBottom: {
    position: 'absolute',
    height: 2.5,
    width: 10,
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    bottom: 5.5,
    left: 0,
  },
});
