import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { AvailabilityRow } from '../../components/portal';
import { usePortalStore } from '../../store/portalStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'TherapistAvailability'
  >;
};

export const TherapistAvailabilityScreen: React.FC<Props> = ({
  navigation,
}) => {
  const availability = usePortalStore((s) => s.availability);
  const status = usePortalStore((s) => s.status);
  const loadAvailability = usePortalStore((s) => s.loadAvailability);
  const loadSnapshot = usePortalStore((s) => s.loadSnapshot);
  const toggleAvailability = usePortalStore((s) => s.toggleAvailability);

  useEffect(() => {
    if (!availability.length) void loadSnapshot();
    else void loadAvailability();
  }, [availability.length, loadAvailability, loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Availability"
        subtitle="Weekly windows"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.hint} maxFontSizeMultiplier={1.3}>
        Toggle days on or off. Real booking rules land with the backend.
      </Text>
      {status === 'loading' && !availability.length ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : null}
      {availability.map((window) => (
        <AvailabilityRow
          key={window.id}
          window={window}
          onToggle={(w, enabled) => void toggleAvailability(w.id, enabled)}
        />
      ))}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  loading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
