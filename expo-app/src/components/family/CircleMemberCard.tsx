import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { TrustedCircleMember } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface CircleMemberCardProps {
  member: TrustedCircleMember;
  onPress?: (member: TrustedCircleMember) => void;
  onManage?: (member: TrustedCircleMember) => void;
}

export const CircleMemberCard = memo<CircleMemberCardProps>(
  ({ member, onPress, onManage }) => (
    <Pressable
      onPress={() => {
        void hapticSelection();
        onPress?.(member);
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
      {...buttonA11y(member.name, {
        hint: `${member.relationshipLabel}, ${member.status}`,
      })}
    >
      <AppCard style={styles.card}>
        <View style={styles.top}>
          <Text style={styles.name} maxFontSizeMultiplier={1.3}>
            {member.name}
          </Text>
          <View
            style={[
              styles.badge,
              member.status === 'pending' && styles.badgePending,
              member.status === 'revoked' && styles.badgeRevoked,
            ]}
          >
            <Text style={styles.badgeText}>{member.status}</Text>
          </View>
        </View>
        <Text style={styles.meta} maxFontSizeMultiplier={1.25}>
          {member.relationshipLabel}
          {member.roles.includes('emergency') ? ' · Emergency' : ''}
          {member.roles.includes('guardian') ? ' · Guardian' : ''}
          {member.roles.includes('caregiver') ? ' · Caregiver' : ''}
        </Text>
        {member.phone ? (
          <Text style={styles.meta}>{member.phone}</Text>
        ) : member.email ? (
          <Text style={styles.meta}>{member.email}</Text>
        ) : null}
        {onManage ? (
          <Pressable
            style={styles.manage}
            onPress={() => {
              void hapticSelection();
              onManage(member);
            }}
            {...buttonA11y(`Manage ${member.name}`)}
          >
            <Text style={styles.manageText}>Manage relationship →</Text>
          </Pressable>
        ) : null}
      </AppCard>
    </Pressable>
  ),
);

CircleMemberCard.displayName = 'CircleMemberCard';

const styles = StyleSheet.create({
  pressed: { opacity: 0.92 },
  card: { marginBottom: Spacing.sm, gap: 4 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgePending: { backgroundColor: Colors.peachMuted },
  badgeRevoked: { backgroundColor: Colors.calendarInactive },
  badgeText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    textTransform: 'capitalize',
    fontSize: 11,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  manage: {
    marginTop: Spacing.xs,
    minHeight: 36,
    justifyContent: 'center',
  },
  manageText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
