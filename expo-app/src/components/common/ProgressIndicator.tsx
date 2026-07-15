import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/radius';

interface ProgressIndicatorProps {
  totalSteps?: number;
  currentStep: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps = 4,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum <= currentStep;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              isActive ? styles.segmentActive : styles.segmentInactive,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    flex: 1,
    height: 5,
    borderRadius: Radius.small,
    marginHorizontal: 3,
  },
  segmentActive: {
    backgroundColor: Colors.primary,
  },
  segmentInactive: {
    backgroundColor: Colors.secondaryLight,
  },
});
