import React, { memo } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Shadows, Spacing } from '../../app/design-system';
import { PrimaryButton } from '../ui/PrimaryButton';

export interface HomeUpcomingEmptyProps {
  onFindTherapist: () => void;
  style?: ViewStyle;
}

/** Compact empty for upcoming sessions — not a full-screen state */
export const HomeUpcomingEmpty = memo<HomeUpcomingEmptyProps>(({
  onFindTherapist,
  style,
}) => (
  <View style={[styles.card, style]} accessibilityRole="summary">
    <Text style={styles.title}>No sessions scheduled yet</Text>
    <Text style={styles.body}>Book your first session with a therapist.</Text>
    <PrimaryButton
      label="Find a therapist"
      onPress={onFindTherapist}
      showArrow
      size="compact"
      style={styles.btn}
    />
  </View>
));

HomeUpcomingEmpty.displayName = 'HomeUpcomingEmpty';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    padding: Spacing.lg,
    ...Shadows.low,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  btn: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
