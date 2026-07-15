import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/borderRadius';
import { Spacing } from '../../theme/spacing';

interface SkeletonBlockProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = '100%',
  height,
  borderRadius = BorderRadius.medium,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.card, style]}>
    <SkeletonBlock width="60%" height={18} />
    <SkeletonBlock width="90%" height={14} style={styles.gap} />
    <SkeletonBlock width="40%" height={14} />
  </View>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <View>
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} style={styles.listItem} />
    ))}
  </View>
);

export const SkeletonProfile: React.FC = () => (
  <View style={styles.profile}>
    <SkeletonBlock width={100} height={100} borderRadius={50} style={styles.center} />
    <SkeletonBlock width="70%" height={20} style={styles.center} />
    <SkeletonBlock width="50%" height={14} style={styles.center} />
    <SkeletonBlock width="100%" height={48} style={styles.gapLg} />
    <SkeletonBlock width="100%" height={48} />
  </View>
);

export const SkeletonChat: React.FC = () => (
  <View>
    <SkeletonBlock width="75%" height={56} borderRadius={BorderRadius.large} style={styles.chatBubble} />
    <SkeletonBlock width="55%" height={48} borderRadius={BorderRadius.large} style={styles.chatBubbleRight} />
    <SkeletonBlock width="65%" height={52} borderRadius={BorderRadius.large} style={styles.chatBubble} />
  </View>
);

export const SkeletonTherapistCard: React.FC = () => (
  <View style={styles.therapistCard}>
    <SkeletonBlock width={112} height={112} borderRadius={BorderRadius.large} />
    <View style={styles.therapistBody}>
      <SkeletonBlock width="70%" height={18} />
      <SkeletonBlock width="50%" height={14} style={styles.gap} />
      <SkeletonBlock width="40%" height={14} />
      <SkeletonBlock width="55%" height={14} style={styles.gap} />
      <SkeletonBlock width="100%" height={44} borderRadius={BorderRadius.medium} style={styles.gapLg} />
    </View>
  </View>
);

/** Calendar week strip placeholder */
export const SkeletonCalendar: React.FC = () => (
  <View style={styles.calendarRow}>
    {Array.from({ length: 7 }).map((_, i) => (
      <View key={i} style={styles.calendarDay}>
        <SkeletonBlock width={28} height={12} />
        <SkeletonBlock width={40} height={40} borderRadius={20} style={styles.gap} />
      </View>
    ))}
  </View>
);

/** Reviews list placeholder for therapist profile */
export const SkeletonReviews: React.FC = () => (
  <View style={styles.card}>
    <SkeletonBlock width="35%" height={18} />
    <SkeletonBlock width="90%" height={14} style={styles.gapLg} />
    <SkeletonBlock width="100%" height={14} style={styles.gap} />
    <SkeletonBlock width="80%" height={14} style={styles.gap} />
    <SkeletonBlock width="90%" height={14} style={styles.gapLg} />
    <SkeletonBlock width="100%" height={14} style={styles.gap} />
  </View>
);

/** Booking screen skeleton — therapist + calendar + slots */
export const SkeletonBooking: React.FC = () => (
  <View>
    <SkeletonTherapistCard />
    <SkeletonBlock width="40%" height={18} style={styles.gapLg} />
    <SkeletonCalendar />
    <SkeletonBlock width="45%" height={18} style={styles.gapLg} />
    <View style={styles.slotRow}>
      <SkeletonBlock width="30%" height={40} borderRadius={BorderRadius.large} />
      <SkeletonBlock width="30%" height={40} borderRadius={BorderRadius.large} />
      <SkeletonBlock width="30%" height={40} borderRadius={BorderRadius.large} />
    </View>
  </View>
);

export const SkeletonSessionCard: React.FC = () => (
  <View style={styles.sessionCard}>
    <SkeletonBlock width={56} height={56} borderRadius={BorderRadius.large} />
    <View style={styles.therapistBody}>
      <SkeletonBlock width="65%" height={18} />
      <SkeletonBlock width="45%" height={14} style={styles.gap} />
      <SkeletonBlock width="55%" height={14} />
    </View>
  </View>
);

export const SkeletonHome: React.FC = () => (
  <View>
    <SkeletonBlock width="55%" height={28} />
    <SkeletonBlock width="70%" height={16} style={styles.gap} />
    <SkeletonSessionCard />
    <SkeletonBlock width="30%" height={20} style={styles.gapLg} />
    <View style={styles.row}>
      <SkeletonBlock width="48%" height={110} borderRadius={BorderRadius.large} />
      <SkeletonBlock width="48%" height={110} borderRadius={BorderRadius.large} />
    </View>
    <View style={styles.row}>
      <SkeletonBlock width="48%" height={110} borderRadius={BorderRadius.large} />
      <SkeletonBlock width="48%" height={110} borderRadius={BorderRadius.large} />
    </View>
    <SkeletonBlock width="45%" height={20} style={styles.gapLg} />
    <SkeletonBlock width="100%" height={88} borderRadius={BorderRadius.large} style={styles.gap} />
    <SkeletonBlock width="50%" height={20} style={styles.gapLg} />
    <SkeletonBlock width="100%" height={72} borderRadius={BorderRadius.large} style={styles.gap} />
    <SkeletonBlock width="40%" height={20} style={styles.gapLg} />
    <View style={styles.row}>
      <SkeletonBlock width={72} height={88} borderRadius={BorderRadius.large} />
      <SkeletonBlock width={72} height={88} borderRadius={BorderRadius.large} />
      <SkeletonBlock width={72} height={88} borderRadius={BorderRadius.large} />
      <SkeletonBlock width={72} height={88} borderRadius={BorderRadius.large} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  block: {
    backgroundColor: Colors.calendarInactive,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  listItem: {
    marginBottom: Spacing.sm,
  },
  gap: {
    marginTop: Spacing.sm,
  },
  gapLg: {
    marginTop: Spacing.lg,
  },
  center: {
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
  profile: {
    paddingVertical: Spacing.md,
  },
  chatBubble: {
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
  },
  chatBubbleRight: {
    marginBottom: Spacing.sm,
    alignSelf: 'flex-end',
  },
  therapistCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  therapistBody: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  calendarDay: {
    alignItems: 'center',
    flex: 1,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
});
