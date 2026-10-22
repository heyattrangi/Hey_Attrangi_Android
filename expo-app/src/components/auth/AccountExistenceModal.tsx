import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Icon } from '../app/Icon';

export interface AccountExistenceModalProps {
  visible: boolean;
  type: 'account_exists' | 'account_not_found' | 'error';
  title?: string;
  message?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  onDismiss: () => void;
}

export const AccountExistenceModal: React.FC<AccountExistenceModalProps> = ({
  visible,
  type,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  onDismiss,
}) => {
  const isAccountExists = type === 'account_exists';
  const isAccountNotFound = type === 'account_not_found';

  const defaultTitle = isAccountExists
    ? 'Looks like you already have an account'
    : isAccountNotFound
    ? 'No account found'
    : 'Something went wrong';

  const defaultMessage = isAccountExists
    ? 'An account with this email already exists. Please log in to continue.'
    : isAccountNotFound
    ? "We couldn't find an account with this email. Would you like to create one?"
    : 'Please check your information and try again.';

  const defaultPrimaryText = isAccountExists
    ? 'Log in'
    : isAccountNotFound
    ? 'Create account'
    : 'OK';

  const defaultSecondaryText = isAccountExists
    ? 'Use another email'
    : isAccountNotFound
    ? 'Try another email'
    : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          <View style={[styles.iconCircle, isAccountExists && styles.iconCircleBlue]}>
            <Icon
              name={
                isAccountExists
                  ? 'account-check-outline'
                  : isAccountNotFound
                  ? 'account-search-outline'
                  : 'alert-circle-outline'
              }
              size={28}
              color={isAccountExists ? '#004F69' : '#FF7D5C'}
            />
          </View>

          <Text style={styles.title}>{title || defaultTitle}</Text>
          <Text style={styles.message}>{message || defaultMessage}</Text>

          <View style={styles.buttonColumn}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onPrimaryPress}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {primaryButtonText || defaultPrimaryText}
              </Text>
            </TouchableOpacity>

            {(secondaryButtonText || defaultSecondaryText) && onSecondaryPress ? (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSecondaryPress}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>
                  {secondaryButtonText || defaultSecondaryText}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.60)',
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
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircleBlue: {
    backgroundColor: '#E6F4F8',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  buttonColumn: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#FF7D5C',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7D5C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
