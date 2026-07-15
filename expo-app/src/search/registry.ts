import { SearchAdapter, SearchDomain, SearchResultItem } from './types';
import {
  GroupedSearchResults,
  SearchFilters,
  SEARCH_DOMAIN_META,
} from './types';

const adapters = new Map<SearchDomain, SearchAdapter>();

export function registerSearchAdapter(adapter: SearchAdapter): void {
  adapters.set(adapter.domain, adapter);
}

export function getSearchAdapter(domain: SearchDomain): SearchAdapter | undefined {
  return adapters.get(domain);
}

export function listSearchAdapters(): SearchAdapter[] {
  return Array.from(adapters.values());
}

const matchesQuery = (item: SearchResultItem, q: string) => {
  const hay = `${item.title} ${item.subtitle ?? ''} ${item.meta ?? ''}`.toLowerCase();
  return hay.includes(q);
};

export async function searchAllDomains(
  query: string,
  domains?: SearchDomain[],
): Promise<SearchResultItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const list = domains
    ? (domains.map((d) => adapters.get(d)).filter(Boolean) as SearchAdapter[])
    : listSearchAdapters().filter((a) => !a.comingSoon);

  const batches = await Promise.all(
    list.map(async (adapter) => {
      try {
        return await adapter.search(q);
      } catch {
        return [];
      }
    }),
  );
  return batches.flat().filter((item) => matchesQuery(item, q));
}

export function applySearchFilters(
  items: SearchResultItem[],
  filters: SearchFilters,
): SearchResultItem[] {
  let next = [...items];

  if (filters.category !== 'all') {
    const cat = filters.category === 'aiHistory' ? 'ai' : filters.category;
    next = next.filter((i) => {
      const d = i.domain === 'aiHistory' ? 'ai' : i.domain;
      return d === cat;
    });
  }

  if (filters.therapist?.trim()) {
    const t = filters.therapist.trim().toLowerCase();
    next = next.filter(
      (i) =>
        i.domain === 'therapists' ||
        i.domain === 'sessions' ||
        i.title.toLowerCase().includes(t) ||
        (i.subtitle ?? '').toLowerCase().includes(t),
    );
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    next = next.filter((i) =>
      i.createdAt ? new Date(i.createdAt).getTime() >= from : true,
    );
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime();
    next = next.filter((i) =>
      i.createdAt ? new Date(i.createdAt).getTime() <= to : true,
    );
  }

  next.sort((a, b) => {
    switch (filters.sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'oldest': {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return ta - tb;
      }
      case 'newest': {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      }
      case 'relevant':
      default:
        return 0;
    }
  });

  return next;
}

export function groupSearchResults(
  items: SearchResultItem[],
): GroupedSearchResults[] {
  const order: SearchDomain[] = [
    'therapists',
    'ai',
    'journal',
    'mood',
    'sessions',
    'notifications',
    'wellness',
    'settings',
  ];

  const map = new Map<SearchDomain, SearchResultItem[]>();
  items.forEach((item) => {
    const domain = item.domain === 'aiHistory' ? 'ai' : item.domain;
    const list = map.get(domain) ?? [];
    list.push(item);
    map.set(domain, list);
  });

  return order
    .filter((d) => (map.get(d)?.length ?? 0) > 0)
    .map((domain) => ({
      domain,
      label: SEARCH_DOMAIN_META[domain].label,
      items: map.get(domain) ?? [],
    }));
}

export function buildLiveSuggestions(
  query: string,
  recent: string[],
  trending: { id: string; label: string }[],
  popular: { id: string; label: string }[],
): { id: string; label: string; kind: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const fromRecent = recent
    .filter((r) => r.toLowerCase().includes(q))
    .slice(0, 3)
    .map((r, i) => ({ id: `lr-${i}`, label: r, kind: 'recent' }));

  const fromTrend = trending
    .filter((t) => t.label.toLowerCase().includes(q))
    .slice(0, 3)
    .map((t) => ({ id: t.id, label: t.label, kind: 'trending' }));

  const fromPop = popular
    .filter((t) => t.label.toLowerCase().includes(q))
    .slice(0, 3)
    .map((t) => ({ id: t.id, label: t.label, kind: 'popular' }));

  const seen = new Set<string>();
  return [...fromRecent, ...fromTrend, ...fromPop].filter((s) => {
    const key = s.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
