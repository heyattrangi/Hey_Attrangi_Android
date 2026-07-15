import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { CommunityEvent } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface EventCardProps {
  event: CommunityEvent;
  onToggleAttend?: (event: CommunityEvent) => void;
}

export const EventCard = memo<EventCardProps>(({ event, onToggleAttend }) => (
  <AppCard style={styles.card}>
    <Text style={styles.format}>{event.format}</Text>
    <Text style={styles.title} maxFontSizeMultiplier={1.3}>
      {event.title}
    </Text>
    <Text style={styles.body} numberOfLines={2} maxFontSizeMultiplier={1.3}>
      {event.description}
    </Text>
    <Text style={styles.meta}>
      {new Date(event.startsAt).toLocaleString()} · {event.hostLabel}
      {event.spotsLeft != null ? ` · ${event.spotsLeft} spots` : ''}
    </Text>
    {onToggleAttend ? (
      <Pressable
        style={[styles.btn, event.attending && styles.btnOn]}
        onPress={() => {
          void hapticSelection();
          onToggleAttend(event);
        }}
        {...buttonA11y(event.attending ? 'Cancel RSVP' : 'Attend event')}
      >
        <Text style={[styles.btnText, event.attending && styles.btnTextOn]}>
          {event.attending ? 'Attending' : 'Attend'}
        </Text>
      </Pressable>
    ) : null}
  </AppCard>
));

EventCard.displayName = 'EventCard';

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm, gap: 4 },
  format: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  btn: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  btnOn: { backgroundColor: Colors.primaryLight },
  btnText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '700',
  },
  btnTextOn: { color: Colors.primaryDark },
});
