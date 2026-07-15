import React, { memo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { SessionChatMessage } from '../../types/domain';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { Icon } from '../app/Icon';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

export interface InSessionChatPanelProps {
  visible: boolean;
  messages: SessionChatMessage[];
  onClose: () => void;
  onSend: (body: string) => void;
}

export const InSessionChatPanel = memo<InSessionChatPanelProps>(({
  visible,
  messages,
  onClose,
  onSend,
}) => {
  const [draft, setDraft] = useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={styles.panel}
          accessibilityViewIsModal
          accessibilityLabel="In-session chat"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Session chat</Text>
            <TouchableOpacity onPress={onClose} {...buttonA11y('Close chat')}>
              <Icon name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>Frontend only — sync later via API</Text>
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.bubble,
                  m.sender === 'self' && styles.bubbleSelf,
                  m.sender === 'system' && styles.bubbleSystem,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    m.sender === 'self' && styles.bubbleTextSelf,
                  ]}
                >
                  {m.body}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Message your therapist…"
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel="Chat message"
            />
            <TouchableOpacity
              style={styles.send}
              onPress={() => {
                if (!draft.trim()) return;
                onSend(draft);
                setDraft('');
              }}
              activeOpacity={Motion.opacity.pressed}
              {...buttonA11y('Send message')}
            >
              <Icon name="send" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

InSessionChatPanel.displayName = 'InSessionChatPanel';

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
    maxHeight: '70%',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xlarge,
    borderTopRightRadius: Radius.xlarge,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  list: { flexGrow: 0, maxHeight: 280 },
  listContent: { gap: Spacing.sm, paddingVertical: Spacing.sm },
  bubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.calendarInactive,
    borderRadius: Radius.large,
    padding: Spacing.sm,
    maxWidth: '85%',
  },
  bubbleSelf: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  bubbleSystem: {
    alignSelf: 'center',
    backgroundColor: Colors.peachMuted,
  },
  bubbleText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  bubbleTextSelf: { color: Colors.white },
  composer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  send: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
