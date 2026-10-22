import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../app/Icon';
import { hapticLight } from '../../utils/haptics';

interface ActivityHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  title,
  subtitle,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            void hapticLight();
            onBack();
          }}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Icon name="chevron-left" size={20} color="#4B5563" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.titleText}>{title}</Text>
      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 4,
    lineHeight: 20,
  },
});
