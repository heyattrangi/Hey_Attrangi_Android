import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import type { PortalClient } from '../../types/domain';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

export interface ClientListItemProps {
  client: PortalClient;
  onPress?: (client: PortalClient) => void;
}

export const ClientListItem = memo<ClientListItemProps>(({ client, onPress }) => (
  <Pressable
    onPress={() => {
      void hapticSelection();
      onPress?.(client);
    }}
    style={({ pressed }) => [pressed && styles.pressed]}
    {...buttonA11y(client.name, { hint: client.status })}
  >
    <AppCard style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.name} maxFontSizeMultiplier={1.3}>
          {client.name}
        </Text>
        <View
          style={[
            styles.badge,
            client.riskFlag === 'elevated' && styles.badgeRisk,
            client.riskFlag === 'monitor' && styles.badgeMonitor,
          ]}
        >
          <Text style={styles.badgeText}>{client.status}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {client.nextSessionAt
          ? `Next ${new Date(client.nextSessionAt).toLocaleDateString()}`
          : 'No upcoming session'}
        {client.riskFlag && client.riskFlag !== 'none'
          ? ` · Risk: ${client.riskFlag}`
          : ''}
      </Text>
      <Text style={styles.tags}>{client.tags.join(' · ')}</Text>
    </AppCard>
  </Pressable>
));

ClientListItem.displayName = 'ClientListItem';

const styles = StyleSheet.create({
  pressed: { opacity: 0.92 },
  card: { marginBottom: Spacing.sm, gap: 4 },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    alignItems: 'center',
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
  badgeMonitor: { backgroundColor: Colors.peachMuted },
  badgeRisk: { backgroundColor: 'rgba(196, 64, 64, 0.15)' },
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
  tags: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
