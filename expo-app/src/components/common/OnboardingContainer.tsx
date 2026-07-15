import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { RadialGradientBackground } from '../ui/RadialGradientBackground';
import { RadialGradientPreset } from '../../theme/gradients';
import { BackButton } from './BackButton';
import { ProgressIndicator } from './ProgressIndicator';

interface OnboardingContainerProps {
  children: React.ReactNode;
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
  onBackPress?: () => void;
  glowPosition?: 'topRight' | 'center' | 'none';
}

const glowToPreset = (
  glowPosition: 'topRight' | 'center' | 'none',
): RadialGradientPreset | 'none' => {
  if (glowPosition === 'none') return 'none';
  if (glowPosition === 'center') return 'centerWarm';
  return 'topRightWarm';
};

export const OnboardingContainer = memo<OnboardingContainerProps>(({
  children,
  currentStep = 1,
  totalSteps = 4,
  showProgress = false,
  onBackPress,
  glowPosition = 'topRight',
}) => {
  const preset = glowToPreset(glowPosition);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {preset !== 'none' ? <RadialGradientBackground preset={preset} /> : null}

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <View style={styles.headerRow}>
          <View style={styles.sideSlot}>
            {onBackPress ? <BackButton onPress={onBackPress} /> : null}
          </View>

          {showProgress && (
            <View style={styles.progressSlot}>
              <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </View>
          )}

          <View style={styles.sideSlot} />
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets
            bounces={false}
          >
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

OnboardingContainer.displayName = 'OnboardingContainer';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  sideSlot: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  progressSlot: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
