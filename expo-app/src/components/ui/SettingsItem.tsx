import React, { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { Icons } from '../../theme/icons';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

interface SettingsItemProps {
  label: string;
  onPress: () => void;
  showDivider?: boolean;
  /** Design Profile.png has no trailing chevron */
  showChevron?: boolean;
  accessibilityHint?: string;
}

export const SettingsItem = memo<SettingsItemProps>(({
  label,
  onPress,
  showDivider = true,
  showChevron = true,
  accessibilityHint,
}) => (
  <>
    {showDivider ? <View style={styles.divider} /> : null}
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.7}
      {...buttonA11y(label, { hint: accessibilityHint ?? `Opens ${label}` })}
    >
      <Text style={styles.itemText} maxFontSizeMultiplier={1.4}>
        {label}
      </Text>
      {showChevron ? (
        <Icon name={Icons.chevronRight} size={20} color={Colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  </>
));

SettingsItem.displayName = 'SettingsItem';

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderDefault,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: Spacing.md,
  },
  itemText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
