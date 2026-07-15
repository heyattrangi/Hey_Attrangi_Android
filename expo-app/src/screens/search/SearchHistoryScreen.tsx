import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, Icon } from '../../components/app';
import { EmptyState } from '../../components/ui/states';
import { useSearchStore } from '../../store/searchStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y } from '../../utils/accessibility';
import { BillingConfirmDialog } from '../../components/billing/BillingConfirmDialog';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'SearchHistory'>;
};

export const SearchHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const history = useSearchStore((s) => s.history);
  const getHistorySections = useSearchStore((s) => s.getHistorySections);
  const pinHistory = useSearchStore((s) => s.pinHistory);
  const deleteHistory = useSearchStore((s) => s.deleteHistory);
  const clearHistory = useSearchStore((s) => s.clearHistory);
  const setQuery = useSearchStore((s) => s.setQuery);
  const runSearch = useSearchStore((s) => s.runSearch);
  const [confirmClear, setConfirmClear] = React.useState(false);

  const sections = getHistorySections();

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Search history"
        subtitle="Recent and pinned searches"
        onBack={() => navigation.goBack()}
        rightAction={
          history.length > 0 ? (
            <TouchableOpacity
              onPress={() => setConfirmClear(true)}
              {...buttonA11y('Clear all history')}
            >
              <Text style={styles.clearAll}>Clear all</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {sections.length === 0 ? (
        <EmptyState
          variant="searchResults"
          title="No recent searches"
          message="Your search history will appear here as you explore Hey Attrangi."
        />
      ) : (
        sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((entry) => (
              <View key={entry.id} style={styles.row}>
                <TouchableOpacity
                  style={styles.main}
                  onPress={() => {
                    setQuery(entry.query);
                    void runSearch(entry.query);
                    navigation.navigate('AppSearch');
                  }}
                  activeOpacity={Motion.opacity.pressed}
                  {...buttonA11y(`Search ${entry.query}`)}
                >
                  <Icon
                    name={entry.pinned ? 'pin' : 'history'}
                    size={20}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.query}>{entry.query}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => pinHistory(entry.id)}
                  {...buttonA11y(entry.pinned ? 'Unpin' : 'Pin')}
                  style={styles.iconBtn}
                >
                  <Icon
                    name={entry.pinned ? 'pin-off-outline' : 'pin-outline'}
                    size={20}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteHistory(entry.id)}
                  {...buttonA11y('Delete search')}
                  style={styles.iconBtn}
                >
                  <Icon name="close" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))
      )}

      <BillingConfirmDialog
        visible={confirmClear}
        title="Clear search history?"
        message="This removes all recent and pinned searches from this device."
        primaryLabel="Clear all"
        destructive
        onPrimary={() => {
          clearHistory();
          setConfirmClear(false);
        }}
        onSecondary={() => setConfirmClear(false)}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  clearAll: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '700',
  },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.sm,
    paddingRight: Spacing.xs,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    minHeight: 48,
  },
  query: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
