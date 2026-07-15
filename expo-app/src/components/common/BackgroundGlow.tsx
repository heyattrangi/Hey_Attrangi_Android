import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

interface BackgroundGlowProps {
  position?: 'topRight' | 'center';
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({ position = 'topRight' }) => {
  if (position === 'center') {
    return (
      <View style={styles.centerContainer} pointerEvents="none">
        <View style={[styles.glowBlob, styles.largeBlob]} />
      </View>
    );
  }

  return (
    <View style={styles.topRightContainer} pointerEvents="none">
      <View style={[styles.glowBlob, styles.smallBlob]} />
    </View>
  );
};

const styles = StyleSheet.create({
  topRightContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  centerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  glowBlob: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: 999,
  },
  smallBlob: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: -width * 0.3,
    marginRight: -width * 0.2,
    opacity: 0.65,
    transform: [{ scale: 1.2 }],
  },
  largeBlob: {
    width: width * 0.9,
    height: width * 0.9,
    opacity: 0.8,
  },
});
