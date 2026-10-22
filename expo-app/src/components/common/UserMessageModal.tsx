import React from 'react';
import {
  StyleSheet,
  View,
  Modal as RNModal,
  TouchableOpacity,
  Text as RNText,
} from 'react-native';
import { Icon } from '../app/Icon';
import { getUserFriendlyErrorMessage } from '../../types/errors';

export interface UserMessageModalProps {
  visible: boolean;
  title?: string;
  message?: string | null;
  error?: unknown;
  onDismiss: () => void;
  buttonText?: string;
}

export const UserMessageModal: React.FC<UserMessageModalProps> = ({
  visible,
  title = 'Something went wrong',
  message,
  error,
  onDismiss,
  buttonText = 'OK',
}) => {
  const displayMessage =
    message ||
    (error ? getUserFriendlyErrorMessage(error) : 'We couldn\'t complete that right now. Please try again.');

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          <View style={styles.iconCircle}>
            <Icon name="alert-circle-outline" size={28} color="#E8722A" />
          </View>
          <RNText style={styles.title}>{title}</RNText>
          <RNText style={styles.message}>{displayMessage}</RNText>

          <TouchableOpacity style={styles.button} onPress={onDismiss} activeOpacity={0.85}>
            <RNText style={styles.buttonText}>{buttonText}</RNText>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#004F69',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
});
