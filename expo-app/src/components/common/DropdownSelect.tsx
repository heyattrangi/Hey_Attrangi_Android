import React, { memo, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Radius } from '../../theme/radius';
import { Shadows } from '../../theme/shadows';
import { Spacing } from '../../theme/spacing';
import { buttonA11y, toggleA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

interface DropdownSelectProps {
  label?: string;
  placeholder: string;
  options: string[];
  value: string | null;
  onSelect: (value: string) => void;
}

export const DropdownSelect = memo<DropdownSelectProps>(({
  label,
  placeholder,
  options,
  value,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = useCallback((item: string) => {
    onSelect(item);
    setModalVisible(false);
  }, [onSelect]);

  const triggerLabel = value ?? placeholder;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label} maxFontSizeMultiplier={1.3}>
          {label}
        </Text>
      ) : null}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        {...buttonA11y(`${label ?? 'Select'}: ${triggerLabel}`, {
          hint: 'Opens list of options',
        })}
        accessibilityState={{ expanded: modalVisible }}
      >
        <Text style={[styles.valueText, !value && styles.placeholderText]} maxFontSizeMultiplier={1.3}>
          {triggerLabel}
        </Text>
        <View style={styles.arrowContainer}>
          <View style={styles.chevronTop} />
          <View style={styles.chevronBottom} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          accessibilityRole="button"
          accessibilityLabel="Close options"
        >
          <View style={styles.modalContent}>
            <SafeAreaView style={styles.safeArea} edges={['bottom']}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle} accessibilityRole="header">
                  {label || 'Select'}
                </Text>
              </View>
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                initialNumToRender={12}
                maxToRenderPerBatch={8}
                windowSize={5}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      value === item && styles.optionItemSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                    {...toggleA11y(item, value === item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === item && styles.optionTextSelected,
                      ]}
                      maxFontSizeMultiplier={1.3}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
              />
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

DropdownSelect.displayName = 'DropdownSelect';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    ...Shadows.low,
  },
  valueText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textMuted,
  },
  arrowContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronTop: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: Colors.textSecondary,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
    right: 4,
  },
  chevronBottom: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: Colors.textSecondary,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: 16,
  },
  safeArea: {
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.borderDefault,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDefault,
    marginBottom: 12,
  },
  modalTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionItem: {
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
  },
  optionItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
