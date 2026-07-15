import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ViewStyle,
  RefreshControlProps,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../app/design-system';
import { RadialGradientBackground } from '../ui/RadialGradientBackground';
import { RadialGradientPreset } from '../../app/design-system/Gradients';

interface AppScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  gradient?: RadialGradientPreset | 'none';
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  /** Include bottom safe-area inset (stack screens). Tab screens should leave false. */
  includeBottomInset?: boolean;
  /** Prepared for future pull-to-refresh integration. */
  refreshControl?: React.ReactElement<RefreshControlProps>;
  /** Enable keyboard avoidance for screens with text inputs. */
  keyboardAware?: boolean;
  /** @deprecated use gradient prop */
  glowPosition?: 'topRight' | 'center' | 'none';
}

export const AppScreen = memo<AppScreenProps>(({
  children,
  scrollable = true,
  gradient,
  glowPosition = 'topRight',
  style,
  contentStyle,
  includeBottomInset = false,
  refreshControl,
  keyboardAware = false,
}) => {
  const preset: RadialGradientPreset | 'none' =
    gradient ?? (glowPosition === 'none' ? 'none' : glowPosition === 'center' ? 'centerWarm' : 'topRightWarm');

  const edges: Edge[] = includeBottomInset
    ? ['top', 'left', 'right', 'bottom']
    : ['top', 'left', 'right'];

  const content = (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      nestedScrollEnabled
      refreshControl={refreshControl}
      automaticallyAdjustKeyboardInsets
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={edges}>
      {preset !== 'none' ? <RadialGradientBackground preset={preset} /> : null}
      {keyboardAware ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 24}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
});

AppScreen.displayName = 'AppScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
});
