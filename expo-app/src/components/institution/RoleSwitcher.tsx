import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Modal } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
} from '../../app/design-system';
import { Icon } from '../app/Icon';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { PlatformRole, PlatformRoleId } from '../../types/domain';
import { roleLabel } from '../../institution/roleConfigs';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface RoleSwitcherProps {
  roles: PlatformRole[];
  activeRoleId: PlatformRoleId;
  pendingRoleId: PlatformRoleId | null;
  onSelectRole: (roleId: PlatformRoleId) => void;
  onConfirmSwitch: () => void;
  onCancelSwitch: () => void;
  compact?: boolean;
}

export const RoleSwitcher = memo<RoleSwitcherProps>(({
  roles,
  activeRoleId,
  pendingRoleId,
  onSelectRole,
  onConfirmSwitch,
  onCancelSwitch,
  compact,
}) => (
  <View>
    {!compact ? (
      <Text style={styles.heading} maxFontSizeMultiplier={1.3}>
        Current role · {roleLabel(activeRoleId)}
      </Text>
    ) : null}
    <Text style={styles.sub} maxFontSizeMultiplier={1.25}>
      Available roles — permissions sync with backend later
    </Text>
    {roles.map((role) => {
      const active = role.id === activeRoleId;
      const locked = !role.available;
      return (
        <Pressable
          key={role.id}
          style={[
            styles.row,
            active && styles.rowActive,
            locked && styles.rowLocked,
          ]}
          disabled={locked || active}
          onPress={() => onSelectRole(role.id)}
          android_ripple={
            Platform.OS === 'android' ? { color: Colors.primaryLight } : undefined
          }
          {...buttonA11y(
            `${role.label}. ${role.description}.${active ? ' Current role.' : ''}${
              locked ? ' Coming soon.' : ''
            }`,
          )}
        >
          <View style={styles.icon}>
            <Icon
              name={locked ? 'lock-outline' : role.icon}
              size={20}
              color={locked ? Colors.textMuted : Colors.primary}
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>
              {role.label}
              {locked ? ' · Soon' : ''}
            </Text>
            <Text style={styles.desc} numberOfLines={2} maxFontSizeMultiplier={1.25}>
              {role.description}
            </Text>
          </View>
          {active ? (
            <Icon name="check-circle" size={20} color={Colors.success} />
          ) : (
            <Icon name="chevron-right" size={20} color={Colors.textMuted} />
          )}
        </Pressable>
      );
    })}

    <Modal
      visible={!!pendingRoleId}
      transparent
      animationType="fade"
      onRequestClose={onCancelSwitch}
    >
      <Pressable style={styles.backdrop} onPress={onCancelSwitch}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <Text style={styles.sheetTitle} accessibilityRole="header">
            Switch role?
          </Text>
          <Text style={styles.sheetBody}>
            You’ll view Hey Attrangi as{' '}
            {pendingRoleId ? roleLabel(pendingRoleId) : ''}. Navigation and
            dashboards will adapt. Backend will enforce permissions later.
          </Text>
          <PrimaryButton label="Switch role" onPress={onConfirmSwitch} />
          <SecondaryButton
            label="Stay as is"
            onPress={onCancelSwitch}
            style={styles.cancel}
          />
        </Pressable>
      </Pressable>
    </Modal>
  </View>
));

RoleSwitcher.displayName = 'RoleSwitcher';

const styles = StyleSheet.create({
  heading: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xlarge,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET + 20,
    ...Shadows.low,
  },
  rowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.peachMuted,
  },
  rowLocked: { opacity: 0.55 },
  icon: {
    width: MIN_TOUCH_TARGET - 8,
    height: MIN_TOUCH_TARGET - 8,
    borderRadius: Radius.large,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  desc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxlarge,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  sheetTitle: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  sheetBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: Spacing.md,
    lineHeight: 22,
  },
  cancel: { marginTop: Spacing.sm },
});
