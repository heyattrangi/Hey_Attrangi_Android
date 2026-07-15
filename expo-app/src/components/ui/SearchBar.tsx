import React, { memo } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing, Icons, Motion } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
}

export const SearchBar = memo<SearchBarProps>(({
  value,
  onChangeText,
  placeholder = 'Search therapists...',
  onClear,
  style,
}) => (
  <View style={[styles.container, style]}>
    <Icon name={Icons.search} size={20} color={Colors.textMuted} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
      autoCorrect={false}
      accessibilityRole="search"
      accessibilityLabel={placeholder}
      accessibilityHint="Type to search"
    />
    {value.length > 0 ? (
      <TouchableOpacity
        onPress={() => {
          onChangeText('');
          onClear?.();
        }}
        style={styles.clearButton}
        activeOpacity={Motion.opacity.pressed}
        {...buttonA11y('Clear search', { hint: 'Clears the search field' })}
      >
        <Icon name={Icons.close} size={18} color={Colors.textMuted} />
      </TouchableOpacity>
    ) : null}
  </View>
));

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: Spacing.xs,
  },
  clearButton: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
