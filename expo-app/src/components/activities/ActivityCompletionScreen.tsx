import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppScreen } from '../app';
import { Icon } from '../app/Icon';

export interface ActivityCompletionScreenProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction: () => void;
}

export const ActivityCompletionScreen: React.FC<ActivityCompletionScreenProps> = ({
  title = 'Activity completed',
  message = "You took a moment for yourself today. That's something worth appreciating.",
  actionLabel = 'Done',
  onAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <AppScreen scrollable={false} gradient="none" style={{ backgroundColor: '#FAF8F5' }}>
      <View style={styles.container}>
        <Animated.View entering={ZoomIn.duration(350)} style={styles.cardContent}>
          {/* Small Success Check Icon Circle */}
          <View style={styles.checkCircle}>
            <Icon name="check" size={28} color="#16A34A" />
          </View>

          {/* Completion Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Appreciation Subtitle */}
          <Text style={styles.message}>{message}</Text>
        </Animated.View>

        {/* Primary CTA */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onAction}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>{actionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 320,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 15,
    fontWeight: '400',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    width: '100%',
    paddingTop: 12,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#FF7D5C',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7D5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
