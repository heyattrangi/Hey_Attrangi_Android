import React, { memo } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { AppCard } from '../app';
import { Colors, Typography, Spacing } from '../../app/design-system';
import type { CirclePermissionGrant } from '../../types/domain';

export interface PermissionScopeListProps {
  permissions: CirclePermissionGrant[];
  onToggle: (scope: CirclePermissionGrant['scope'], enabled: boolean) => void;
}

export const PermissionScopeList = memo<PermissionScopeListProps>(
  ({ permissions, onToggle }) => (
    <View style={styles.wrap}>
      {permissions.map((perm) => (
        <AppCard key={perm.scope} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.copy}>
              <Text style={styles.label} maxFontSizeMultiplier={1.3}>
                {perm.label}
              </Text>
              <Text style={styles.desc} maxFontSizeMultiplier={1.25}>
                {perm.description}
              </Text>
            </View>
            <Switch
              value={perm.enabled}
              onValueChange={(v) => onToggle(perm.scope, v)}
              trackColor={{
                false: Colors.borderDefault,
                true: Colors.primaryLight,
              }}
              thumbColor={perm.enabled ? Colors.primary : Colors.white}
              accessibilityLabel={perm.label}
            />
          </View>
        </AppCard>
      ))}
    </View>
  ),
);

PermissionScopeList.displayName = 'PermissionScopeList';

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  card: { marginBottom: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: { flex: 1, marginRight: Spacing.md },
  label: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
