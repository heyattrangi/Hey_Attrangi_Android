import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { useCommunityStore } from '../../store/communityStore';
import { useUiStore } from '../../store/uiStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { hapticSelection } from '../../utils/haptics';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ModerationQueue'>;
};

export const ModerationQueueScreen: React.FC<Props> = ({ navigation }) => {
  const moderationQueue = useCommunityStore((s) => s.moderationQueue);
  const loadModerationQueue = useCommunityStore((s) => s.loadModerationQueue);
  const resolveModerationItem = useCommunityStore((s) => s.resolveModerationItem);
  const showToast = useUiStore((s) => s.showToast);

  useEffect(() => {
    void loadModerationQueue();
  }, [loadModerationQueue]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Moderation"
        subtitle="Queue UI (frontend-ready)"
        onBack={() => navigation.goBack()}
      />
      <Text style={styles.lead} maxFontSizeMultiplier={1.3}>
        Moderators review reported content here. Actions stay local until the
        moderation API ships.
      </Text>
      {moderationQueue.map((item) => (
        <AppCard key={item.id} style={styles.card}>
          <Text style={styles.priority}>
            {item.priority} · {item.report.status}
          </Text>
          <Text style={styles.title}>{item.report.targetPreview}</Text>
          <Text style={styles.meta}>
            Reason: {item.report.reason.replace('_', ' ')} ·{' '}
            {item.assignedLabel ?? 'Unassigned'}
          </Text>
          {item.report.status === 'open' || item.report.status === 'reviewing' ? (
            <View style={styles.actions}>
              <Pressable
                style={styles.btn}
                onPress={() => {
                  void hapticSelection();
                  void resolveModerationItem(item.id, 'resolved').then(() =>
                    showToast('Marked resolved', 'success'),
                  );
                }}
                {...buttonA11y('Resolve report')}
              >
                <Text style={styles.btnText}>Resolve</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.dismiss]}
                onPress={() => {
                  void hapticSelection();
                  void resolveModerationItem(item.id, 'dismissed').then(() =>
                    showToast('Dismissed', 'info'),
                  );
                }}
                {...buttonA11y('Dismiss report')}
              >
                <Text style={styles.dismissText}>Dismiss</Text>
              </Pressable>
            </View>
          ) : null}
        </AppCard>
      ))}
      {!moderationQueue.length ? (
        <Text style={styles.empty}>Queue is clear.</Text>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  lead: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  card: { marginBottom: Spacing.sm, gap: 4 },
  priority: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  btnText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '700',
  },
  dismiss: {
    backgroundColor: Colors.calendarInactive,
  },
  dismissText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
