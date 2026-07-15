import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppScreen } from '../../components/app';
import { TherapistCard } from '../../components/ui/TherapistCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { TherapistFilterSheet } from '../../components/therapists';
import { AsyncStateRenderer, SkeletonTherapistCard } from '../../components/async';
import { emptyKinds } from '../../config/emptyStates';
import { useTherapistStore } from '../../store/therapistStore';
import { TherapistFilters } from '../../services/therapists/ITherapistService';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius, Icons } from '../../theme';
import { Icon } from '../../components/app/Icon';
import { getTherapistImageSource } from '../../utils/therapistImage';
import { usePreventDoublePress } from '../../hooks/usePreventDoublePress';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { STORAGE_KEYS } from '../../persistence/storageKeys';
import { hapticLight } from '../../utils/haptics';
import { Therapist } from '../../types/domain';
import { LIST_PERF, keyExtractorId } from '../../utils/listPerformance';
import { useScreenLifecycle } from '../../hooks/useScreenLifecycle';
import { useDebouncedSearch } from '../../hooks/useDebouncedSearch';

const SUGGESTIONS = [
  'Anxiety',
  'Depression',
  'Burnout',
  'Relationships',
  'Hindi',
  'Video',
];

const formatNext = (iso?: string | null) => {
  if (!iso) return undefined;
  return new Date(iso).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const activeFilterCount = (f: TherapistFilters) =>
  Object.values(f).filter((v) => v !== undefined && v !== null && v !== '').length;

export const TherapistListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const therapists = useTherapistStore((s) => s.therapists);
  const status = useTherapistStore((s) => s.status);
  const error = useTherapistStore((s) => s.error);
  const fetchTherapists = useTherapistStore((s) => s.fetchTherapists);
  const guardPress = usePreventDoublePress();

  const { query, setQuery, debouncedQuery } = useDebouncedSearch();
  const [filters, setFilters] = useState<TherapistFilters>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useScreenLifecycle({
    screenName: 'Therapists',
    onRefresh: () => {
      void fetchTherapists(debouncedQuery, filters);
    },
  });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.recentTherapistSearches).then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) setRecent(parsed.slice(0, 6));
      } catch {
        // ignore
      }
    });
  }, []);

  const persistRecent = useCallback(async (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    await AsyncStorage.setItem(
      STORAGE_KEYS.recentTherapistSearches,
      JSON.stringify(next),
    );
  }, [recent]);

  useEffect(() => {
    if (status === 'idle') fetchTherapists(undefined, filters);
  }, [fetchTherapists, filters, status]);

  useEffect(() => {
    void fetchTherapists(debouncedQuery || undefined, filters);
    if (debouncedQuery.length >= 2) {
      void persistRecent(debouncedQuery);
    }
  }, [debouncedQuery, filters, fetchTherapists, persistRecent]);

  const searchActive =
    Boolean(query.trim()) || activeFilterCount(filters) > 0;

  const displayStatus = useMemo(() => {
    if (status === 'success' && therapists.length === 0) return 'empty';
    return status;
  }, [status, therapists.length]);

  const refreshTherapists = useCallback(async () => {
    await fetchTherapists(debouncedQuery || undefined, filters);
  }, [fetchTherapists, filters, debouncedQuery]);

  const { refreshing, onRefresh } = usePullToRefresh(refreshTherapists);

  const openProfile = useCallback(
    (therapist: Therapist) => {
      navigation.navigate('TherapistProfile', {
        therapistId: therapist.id,
        name: therapist.name,
      });
    },
    [navigation],
  );

  const showSuggestions = !query.trim() && recent.length + SUGGESTIONS.length > 0;

  return (
    <AppScreen
      gradient="topRightWarm"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
      }
    >
      <Text style={styles.title}>Schedule</Text>
      <Text style={styles.subtitle}>
        Curated for you- verified professionals on Aatrangi
      </Text>

      <View style={styles.searchRow}>
        <View style={styles.searchFlex}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search therapists by name or specialty..."
            onClear={() => setQuery('')}
            style={styles.searchBar}
          />
        </View>
        <Pressable
          style={[styles.filterBtn, activeFilterCount(filters) > 0 && styles.filterBtnActive]}
          onPress={() => {
            void hapticLight();
            setFilterOpen(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <Icon name={Icons.filter} size={22} color={Colors.textPrimary} />
          {activeFilterCount(filters) > 0 ? (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount(filters)}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {showSuggestions ? (
        <View style={styles.suggestBlock}>
          {recent.length > 0 ? (
            <>
              <Text style={styles.suggestLabel}>Recent searches</Text>
              <View style={styles.suggestRow}>
                {recent.map((term) => (
                  <Pressable
                    key={term}
                    style={styles.suggestChip}
                    onPress={() => setQuery(term)}
                  >
                    <Text style={styles.suggestChipText}>{term}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
          <Text style={styles.suggestLabel}>Suggestions</Text>
          <View style={styles.suggestRow}>
            {SUGGESTIONS.map((term) => (
              <Pressable
                key={term}
                style={styles.suggestChip}
                onPress={() => setQuery(term)}
              >
                <Text style={styles.suggestChipText}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <AsyncStateRenderer
        screenId="therapistList"
        status={displayStatus}
        error={error}
        onRetry={() => fetchTherapists(query, filters)}
        hasCachedData={therapists.length > 0}
        loading={
          <>
            <SkeletonTherapistCard />
            <SkeletonTherapistCard />
            <SkeletonTherapistCard />
          </>
        }
        emptyKind={searchActive ? emptyKinds.therapistsSearch : emptyKinds.therapists}
        loadingDomain="therapist"
        searchActive={Boolean(query.trim())}
        preferSkeleton
        onEmptyAction={
          searchActive
            ? () => {
                setQuery('');
                setFilters({});
              }
            : undefined
        }
      >
        <FlatList
          data={therapists}
          keyExtractor={keyExtractorId}
          scrollEnabled={false}
          {...LIST_PERF.cards}
          renderItem={({ item, index }) => (
            <TherapistCard
              index={index}
              therapist={{
                ...item,
                imageUrl: item.profileImageUrl,
                image: getTherapistImageSource(item),
                nextAvailable: formatNext(item.nextAvailableSlot),
              }}
              showViewProfileButton
              onPress={guardPress(() => openProfile(item))}
              onViewProfile={guardPress(() => openProfile(item))}
            />
          )}
        />
      </AsyncStateRenderer>

      <TherapistFilterSheet
        visible={filterOpen}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setFilters(next);
          void fetchTherapists(query, next);
        }}
        onReset={() => {
          setFilters({});
          void fetchTherapists(query, {});
        }}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  searchFlex: {
    flex: 1,
  },
  searchBar: {
    marginBottom: Spacing.sm,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  filterBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  suggestBlock: {
    marginBottom: Spacing.md,
  },
  suggestLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  suggestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  suggestChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
    backgroundColor: Colors.calendarInactive,
  },
  suggestChipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
});
