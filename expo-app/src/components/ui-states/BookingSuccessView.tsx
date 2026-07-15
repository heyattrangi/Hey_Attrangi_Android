import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { getUiStateDefinition } from '../../app/ui-states';
import { DesignStateView } from './DesignStateView';

export interface BookingSuccessDetails {
  therapistName: string;
  specialty?: string;
  dateLabel: string;
  timeLabel: string;
  durationLabel?: string;
}

export interface BookingSuccessViewProps {
  details: BookingSuccessDetails;
  onGoToSchedule: () => void;
}

/** Design: Booking Confirmed.png — checkmark + details card + CTA */
export const BookingSuccessView = memo<BookingSuccessViewProps>(({
  details,
  onGoToSchedule,
}) => {
  const definition = getUiStateDefinition('success.booking');

  return (
    <DesignStateView definition={definition} onPrimaryAction={onGoToSchedule}>
      <View style={styles.card}>
        <Text style={styles.name}>{details.therapistName}</Text>
        {details.specialty ? (
          <Text style={styles.specialty}>{details.specialty}</Text>
        ) : null}
        <View style={styles.rows}>
          <DetailRow label="Date" value={details.dateLabel} />
          <DetailRow label="Time" value={details.timeLabel} />
          <DetailRow
            label="Duration"
            value={details.durationLabel ?? '45 minutes'}
          />
        </View>
      </View>
    </DesignStateView>
  );
});

BookingSuccessView.displayName = 'BookingSuccessView';

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginTop: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.peachLight,
    padding: Spacing.lg,
    ...Shadows.low,
  },
  name: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  specialty: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  rows: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  rowValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
