import React, { memo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface DeleteAccountDialogProps {
  visible: boolean;
  isDeleting?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const CONFIRM_WORD = 'DELETE';

export const DeleteAccountDialog = memo<DeleteAccountDialogProps>(({
  visible,
  isDeleting = false,
  onConfirm,
  onCancel,
}) => {
  const insets = useSafeAreaInsets();
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (visible) {
      setConfirmation('');
    }
  }, [visible]);

  const canDelete = confirmation === CONFIRM_WORD && !isDeleting;

  const handleConfirm = () => {
    if (!canDelete) return;
    void onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isDeleting) onCancel();
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.modalOverlay, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            <View style={styles.dialogCard}>
              {/* TITLE */}
              <RNText style={styles.title}>Delete your account?</RNText>

              {/* DESCRIPTION */}
              <RNText style={styles.description}>
                Your profile, conversations, journal entries, Mind Matrix history, emergency contact, and preferences will be permanently deleted.
              </RNText>

              {/* WARNING SUBTEXT */}
              <RNText style={styles.warningSubtext}>This action cannot be undone.</RNText>

              {/* CONFIRMATION INPUT GROUP */}
              <View style={styles.inputGroup}>
                <RNText style={styles.inputLabel}>
                  Type <RNText style={styles.confirmWordHighlight}>DELETE</RNText> to confirm
                </RNText>
                <TextInput
                  style={[styles.textInput, canDelete && styles.textInputValid]}
                  value={confirmation}
                  onChangeText={setConfirmation}
                  placeholder="DELETE"
                  placeholderTextColor="#CBD5E1"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  editable={!isDeleting}
                />
                <RNText style={styles.hintText}>Confirmation is case-sensitive.</RNText>
              </View>

              {/* BUTTONS */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onCancel}
                  disabled={isDeleting}
                  activeOpacity={0.75}
                >
                  <RNText style={styles.cancelBtnText}>Cancel</RNText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteBtn, !canDelete && styles.deleteBtnDisabled]}
                  onPress={handleConfirm}
                  disabled={!canDelete}
                  activeOpacity={0.85}
                >
                  {isDeleting ? (
                    <View style={styles.deletingSpinnerRow}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <RNText style={styles.deletingBtnText}>Deleting...</RNText>
                    </View>
                  ) : (
                    <RNText style={styles.deleteBtnText}>Delete Account</RNText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

DeleteAccountDialog.displayName = 'DeleteAccountDialog';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardView: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  dialogCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 6,
  },
  warningSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0F172A',
    marginBottom: 6,
  },
  confirmWordHighlight: {
    fontFamily: 'Nunito_900Black',
    color: '#0F172A',
  },
  textInput: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  textInputValid: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
    color: '#64748B',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#334155',
  },
  deleteBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnDisabled: {
    opacity: 0.4,
  },
  deleteBtnText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  deletingSpinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deletingBtnText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
});
