import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, Icon } from '../../components/app';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/states';
import {
  SearchChipRow,
  SearchFilterSheet,
  SearchResultCard,
  VoiceSearchPanel,
  SearchResultsSkeleton,
  SearchSuggestionsSkeleton,
  DiscoverySection,
} from '../../components/search';
import { useSearchStore } from '../../store/searchStore';
import { useNetworkStore } from '../../store/networkStore';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useDebouncedSearch } from '../../hooks/useDebouncedSearch';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import {
  SearchDomain,
  SearchResultItem,
} from '../../search/types';
import { mockSuggestedSearches as suggestedList } from '../../mocks/mockSearch';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Motion, Radius, Spacing, Typography } from '../../app/design-system';
import { buttonA11y, MIN_TOUCH_TARGET } from '../../utils/accessibility';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AppSearch'>;
};

export const AppSearchScreen: React.FC<Props> = ({ navigation }) => {
  const enabled = useFeatureFlag('enableAppSearch');
  const reduceMotion = useReducedMotion();
  const guardPress = usePreventDoublePress();
  const isConnected = useNetworkStore((s) => s.isConnected);

  const {
    query: storeQuery,
    setQuery: setStoreQuery,
    results,
    grouped,
    suggestions,
    history,
    lastQuery,
    filters,
    discovery,
    trending,
    popular,
    voicePhase,
    status,
    suggestStatus,
    discoveryStatus,
    runSearch,
    loadSuggestions,
    loadDiscovery,
    setFilters,
    resetFilters,
    setVoicePhase,
    applyVoiceTranscript,
    clearHistory,
  } = useSearchStore();

  const { query, setQuery, debouncedQuery, clear } = useDebouncedSearch({
    initialQuery: storeQuery,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeChip, setActiveChip] = useState<SearchDomain | 'all'>(
    filters.category === 'all' ? 'all' : (filters.category as SearchDomain),
  );

  useEffect(() => {
    if (discoveryStatus === 'idle') loadDiscovery();
  }, [discoveryStatus, loadDiscovery]);

  useEffect(() => {
    setStoreQuery(query);
    if (query.trim()) {
      void loadSuggestions(query);
    }
  }, [loadSuggestions, query, setStoreQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      if (!reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return;
    }
    void runSearch(debouncedQuery);
  }, [debouncedQuery, reduceMotion, runSearch]);

  const navigateToItem = useCallback(
    (item: SearchResultItem) => {
      if (!item.route) return;
      // Adapters supply typed route/params; cast keeps deep-link flexibility.
      (navigation.navigate as (r: string, p?: object) => void)(
        item.route,
        item.params,
      );
    },
    [navigation],
  );

  const openSuggestion = (label: string) => {
    setQuery(label);
    void runSearch(label);
  };

  const recentLabels = useMemo(
    () => history.filter((h) => !h.pinned).slice(0, 6).map((h) => h.query),
    [history],
  );

  if (!enabled) {
    return (
      <AppScreen includeBottomInset gradient="topRightWarm">
        <AppHeader title="Search" onBack={() => navigation.goBack()} />
        <EmptyState
          variant="searchResults"
          title="Search unavailable"
          message="App-wide search is turned off by a feature flag."
        />
      </AppScreen>
    );
  }

  const isHome = !query.trim();
  const showSuggestions =
    Boolean(query.trim()) &&
    query.trim() !== debouncedQuery.trim() &&
    suggestions.length > 0;

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Search"
        subtitle="Discover therapists, journals, moods, sessions & more"
        onBack={() => navigation.goBack()}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setFilterOpen(true)}
              {...buttonA11y('Open filters')}
              style={styles.headerBtn}
            >
              <Icon name="filter-variant" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={guardPress(() => navigation.navigate('SearchHistory'))}
              {...buttonA11y('Search history')}
              style={styles.headerBtn}
            >
              <Icon name="history" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.searchRow}>
        <View style={styles.searchFlex}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search Hey Attrangi…"
            onClear={() => {
              clear();
              setStoreQuery('');
            }}
            style={styles.searchBar}
          />
        </View>
        <VoiceSearchPanel
          phase={voicePhase}
          onStart={() => setVoicePhase('listening')}
          onCancel={() => setVoicePhase('idle')}
          onFinishMock={() => {
            setVoicePhase('processing');
            setTimeout(() => {
              applyVoiceTranscript('anxiety coping');
              setQuery('anxiety coping');
            }, 600);
          }}
        />
      </View>

      <SearchChipRow
        selected={activeChip}
        onSelect={(d) => {
          setActiveChip(d);
          setFilters({ category: d });
        }}
      />

      {showSuggestions ? (
        <Animated.View
          entering={
            reduceMotion ? undefined : FadeInDown.duration(Motion.duration.fast)
          }
        >
          {suggestStatus === 'loading' ? (
            <SearchSuggestionsSkeleton />
          ) : (
            <View style={styles.suggestBlock}>
              <Text style={styles.sectionLabel}>Suggestions</Text>
              {suggestions.slice(0, 6).map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.suggestRow}
                  onPress={() => openSuggestion(s.label)}
                  {...buttonA11y(`Suggest ${s.label}`)}
                >
                  <Icon name="magnify" size={18} color={Colors.textMuted} />
                  <Text style={styles.suggestText}>{s.label}</Text>
                  <Text style={styles.suggestKind}>{s.kind}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>
      ) : null}

      {isHome ? (
        <View>
          {lastQuery ? (
            <TouchableOpacity
              style={styles.continue}
              onPress={() => openSuggestion(lastQuery)}
              {...buttonA11y(`Continue search ${lastQuery}`)}
            >
              <Icon name="restore" size={20} color={Colors.primary} />
              <Text style={styles.continueText}>
                Continue “{lastQuery}”
              </Text>
            </TouchableOpacity>
          ) : null}

          <Text style={styles.sectionLabel}>Recent searches</Text>
          {recentLabels.length === 0 ? (
            <Text style={styles.emptyHint}>No recent searches yet</Text>
          ) : (
            <View style={styles.chipWrap}>
              {recentLabels.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={styles.pill}
                  onPress={() => openSuggestion(r)}
                  {...buttonA11y(r)}
                >
                  <Text style={styles.pillText}>{r}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={clearHistory} {...buttonA11y('Clear recent')}>
                <Text style={styles.clearLink}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.sectionLabel}>Suggested searches</Text>
          <View style={styles.chipWrap}>
            {suggestedList.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.pill}
                onPress={() => openSuggestion(s)}
                {...buttonA11y(s)}
              >
                <Text style={styles.pillText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Trending topics</Text>
          <View style={styles.chipWrap}>
            {trending.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.pill, styles.trendPill]}
                onPress={() => openSuggestion(t.label)}
                {...buttonA11y(t.label)}
              >
                <Text style={styles.pillText}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Popular categories</Text>
          <View style={styles.chipWrap}>
            {popular.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.pill}
                onPress={() => {
                  if (p.domain) {
                    setActiveChip(p.domain);
                    setFilters({ category: p.domain });
                  }
                  openSuggestion(p.label);
                }}
                {...buttonA11y(p.label)}
              >
                <Text style={styles.pillText}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {discovery.length === 0 && discoveryStatus === 'success' ? (
            <EmptyState
              variant="searchResults"
              title="No recommendations"
              message="Personalized discovery will appear when the recommendations API is ready."
            />
          ) : (
            discovery.map((block) => (
              <DiscoverySection
                key={block.id}
                block={block}
                onPressItem={navigateToItem}
              />
            ))
          )}
        </View>
      ) : (
        <View>
          {!isConnected || status === 'offline' ? (
            <EmptyState
              variant="searchResults"
              title="Search offline"
              message="Connect to the internet to search across Hey Attrangi."
              actionLabel="Retry"
              onAction={() => void runSearch(query)}
            />
          ) : status === 'loading' ? (
            <SearchResultsSkeleton />
          ) : status === 'empty' || (status === 'success' && grouped.length === 0) ? (
            <EmptyState
              variant="searchResults"
              title="No results"
              message={`Nothing matched “${query.trim()}”. Try another keyword or clear filters.`}
              actionLabel="Clear search"
              onAction={() => {
                clear();
                setStoreQuery('');
                resetFilters();
                setActiveChip('all');
              }}
            />
          ) : (
            grouped.map((group, gIdx) => (
              <Animated.View
                key={group.domain}
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.delay(gIdx * 40).duration(Motion.duration.normal)
                }
              >
                <View style={styles.groupHeader}>
                  <Text style={styles.groupTitle}>{group.label}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveChip(group.domain);
                      setFilters({ category: group.domain });
                    }}
                    {...buttonA11y(`View all ${group.label}`)}
                  >
                    <Text style={styles.viewAll}>View all</Text>
                  </TouchableOpacity>
                </View>
                {group.items.slice(0, 4).map((item) => (
                  <SearchResultCard
                    key={item.id}
                    item={item}
                    onPress={() => navigateToItem(item)}
                  />
                ))}
              </Animated.View>
            ))
          )}
          {status === 'success' ? (
            <Text style={styles.count}>
              {results.length} result{results.length === 1 ? '' : 's'}
            </Text>
          ) : null}
        </View>
      )}

      <SearchFilterSheet
        visible={filterOpen}
        filters={filters}
        onChange={setFilters}
        onReset={() => {
          resetFilters();
          setActiveChip('all');
        }}
        onClose={() => setFilterOpen(false)}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  headerActions: { flexDirection: 'row', gap: Spacing.xs },
  headerBtn: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  searchFlex: { flex: 1 },
  searchBar: { marginBottom: Spacing.sm },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
  },
  trendPill: { backgroundColor: Colors.peachMuted },
  pillText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  clearLink: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginLeft: Spacing.xs,
  },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.peachMuted,
    borderRadius: Radius.large,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  continueText: {
    ...Typography.body,
    color: Colors.primaryDark,
    fontWeight: '700',
    flex: 1,
  },
  suggestBlock: { marginBottom: Spacing.md },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
  suggestText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  suggestKind: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  groupTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  viewAll: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  count: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
