import {
  ProgressChartSeries,
  ReportCatalogItem,
  ReportExportFormat,
  ReportExportPayload,
  ReportKind,
  ReportPeriodId,
  ReportSharePayload,
  WellnessDashboardSnapshot,
  WellnessReportSummary,
} from '../types/domain';

const iso = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MOCK_REPORT_CATALOG: ReportCatalogItem[] = [
  {
    kind: 'wellness',
    title: 'Wellness Dashboard',
    description: 'Cross-domain snapshot of mood, sleep, stress, and habits.',
    available: true,
  },
  {
    kind: 'mood',
    title: 'Mood Report',
    description: 'Trends, distribution, and emotional patterns.',
    available: true,
  },
  {
    kind: 'weekly',
    title: 'Weekly Report',
    description: 'A calm recap of the last 7 days.',
    available: true,
  },
  {
    kind: 'monthly',
    title: 'Monthly Report',
    description: 'Month-long wellness overview with insights.',
    available: true,
  },
  {
    kind: 'therapy',
    title: 'Therapy Report',
    description: 'Session cadence and themes (frontend-ready).',
    available: true,
  },
  {
    kind: 'journal',
    title: 'Journal Report',
    description: 'Reflection frequency and writing themes.',
    available: true,
  },
  {
    kind: 'habit',
    title: 'Habit Report',
    description: 'Consistency across wellness habits.',
    available: true,
  },
  {
    kind: 'sleep',
    title: 'Sleep Report',
    description: 'Sleep quality and restfulness trends.',
    available: true,
  },
  {
    kind: 'stress',
    title: 'Stress Report',
    description: 'Stress levels and recovery windows.',
    available: true,
  },
  {
    kind: 'institution',
    title: 'Institution Reports',
    description: 'Campus wellness aggregates for admins.',
    available: false,
    badge: 'Coming soon',
  },
  {
    kind: 'parent',
    title: 'Parent Reports',
    description: 'Shared progress views for guardians.',
    available: false,
    badge: 'Coming soon',
  },
];

function moodChart(period: ReportPeriodId): ProgressChartSeries {
  const n = period === '7d' ? 7 : period === '30d' ? 14 : 10;
  return {
    id: 'mood-trend',
    title: 'Mood intensity',
    unit: '/10',
    colorHint: 'primary',
    points: Array.from({ length: n }, (_, i) => ({
      label: period === '7d' ? weekLabels[i % 7] : `D${i + 1}`,
      value: 4 + ((i * 3) % 5) + (i % 2),
      mood: ['Okay', 'Good', 'Calm', 'Happy', 'Bad'][i % 5],
      date: iso(n - i),
    })),
  };
}

function sleepChart(): ProgressChartSeries {
  return {
    id: 'sleep-hours',
    title: 'Sleep hours',
    unit: 'hrs',
    colorHint: 'calm',
    points: weekLabels.map((label, i) => ({
      label,
      value: 5.5 + (i % 4) * 0.7,
      date: iso(6 - i),
    })),
  };
}

function stressChart(): ProgressChartSeries {
  return {
    id: 'stress',
    title: 'Stress level',
    unit: '/10',
    colorHint: 'alert',
    points: weekLabels.map((label, i) => ({
      label,
      value: 3 + ((i * 2) % 6),
      date: iso(6 - i),
    })),
  };
}

function habitChart(): ProgressChartSeries {
  return {
    id: 'habits',
    title: 'Habits completed',
    unit: 'done',
    colorHint: 'primary',
    points: weekLabels.map((label, i) => ({
      label,
      value: 2 + (i % 4),
      date: iso(6 - i),
    })),
  };
}

function journalChart(): ProgressChartSeries {
  return {
    id: 'journal',
    title: 'Journal entries',
    colorHint: 'muted',
    points: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: 1 + (i % 3) + (i === 2 ? 2 : 0),
    })),
  };
}

function therapyChart(): ProgressChartSeries {
  return {
    id: 'therapy',
    title: 'Sessions attended',
    colorHint: 'calm',
    points: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({
      label,
      value: i % 3 === 0 ? 2 : 1,
    })),
  };
}

const periodLabel = (period: ReportPeriodId) => {
  switch (period) {
    case '7d':
      return 'Last 7 days';
    case '30d':
      return 'Last 30 days';
    case '90d':
      return 'Last 90 days';
    case 'year':
      return 'This year';
    default:
      return 'Custom range';
  }
};

export function buildMockReport(
  kind: ReportKind,
  period: ReportPeriodId = '7d',
): WellnessReportSummary {
  const generatedAt = new Date().toISOString();
  const pLabel = periodLabel(period);

  if (kind === 'institution') {
    return {
      id: `report-institution-${period}`,
      kind,
      title: 'Institution Reports',
      subtitle: 'Campus wellness overview',
      periodLabel: pLabel,
      generatedAt,
      headline: 'Institution reporting will unlock with admin analytics.',
      stats: [],
      charts: [],
      insights: [],
      placeholder: true,
      placeholderMessage:
        'Campus-level reports (attendance, campaigns, sentiment) will appear here when institution analytics APIs ship.',
    };
  }

  if (kind === 'parent') {
    return {
      id: `report-parent-${period}`,
      kind,
      title: 'Parent Reports',
      subtitle: 'Guardian wellness sharing',
      periodLabel: pLabel,
      generatedAt,
      headline: 'Parent sharing is prepared but not enabled yet.',
      stats: [],
      charts: [],
      insights: [],
      placeholder: true,
      placeholderMessage:
        'When the parent role launches, shared mood and session summaries will appear here with consent controls.',
    };
  }

  const common = {
    periodLabel: pLabel,
    generatedAt,
  };

  switch (kind) {
    case 'mood':
      return {
        id: `report-mood-${period}`,
        kind,
        title: 'Mood Report',
        subtitle: 'Emotional patterns over time',
        ...common,
        headline: 'Most days landed in a steady, manageable range.',
        stats: [
          { id: 'avg', label: 'Average mood', value: '6.8', hint: '/10' },
          { id: 'best', label: 'Best day', value: 'Fri' },
          { id: 'checkins', label: 'Check-ins', value: '12' },
        ],
        charts: [moodChart(period)],
        insights: [
          {
            id: 'i1',
            title: 'Evening dips',
            body: 'Mood softens after 8pm — a short wind-down may help.',
            tone: 'caution',
          },
          {
            id: 'i2',
            title: 'Weekend lift',
            body: 'Weekends trend calmer than mid-week.',
            tone: 'positive',
          },
        ],
      };
    case 'weekly':
      return {
        id: `report-weekly-${period}`,
        kind,
        title: 'Weekly Report',
        subtitle: 'Your 7-day wellness recap',
        ...common,
        headline: 'A balanced week with steady check-ins.',
        stats: [
          { id: 'score', label: 'Week score', value: '74' },
          { id: 'sleep', label: 'Avg sleep', value: '6.8h' },
          { id: 'stress', label: 'Avg stress', value: '4.2' },
          { id: 'habits', label: 'Habits done', value: '18' },
        ],
        charts: [moodChart('7d'), sleepChart(), habitChart()],
        insights: [
          {
            id: 'w1',
            title: 'Consistency',
            body: 'You checked in 5 of 7 days — a strong rhythm.',
            tone: 'positive',
          },
        ],
      };
    case 'monthly':
      return {
        id: `report-monthly-${period}`,
        kind,
        title: 'Monthly Report',
        subtitle: 'Month-long overview',
        ...common,
        headline: 'Progress this month shows gentle upward momentum.',
        stats: [
          { id: 'score', label: 'Month score', value: '71' },
          { id: 'sessions', label: 'Therapy sessions', value: '3' },
          { id: 'journal', label: 'Journal entries', value: '9' },
          { id: 'mood', label: 'Mood avg', value: '6.5' },
        ],
        charts: [moodChart('30d'), journalChart(), therapyChart()],
        insights: [
          {
            id: 'm1',
            title: 'Therapy cadence',
            body: 'Three sessions kept support consistent without overload.',
            tone: 'neutral',
          },
        ],
      };
    case 'therapy':
      return {
        id: `report-therapy-${period}`,
        kind,
        title: 'Therapy Report',
        subtitle: 'Sessions and themes',
        ...common,
        headline: 'You stayed engaged with care this period.',
        stats: [
          { id: 'attended', label: 'Attended', value: '3' },
          { id: 'minutes', label: 'Minutes', value: '150' },
          { id: 'upcoming', label: 'Upcoming', value: '1' },
        ],
        charts: [therapyChart()],
        insights: [
          {
            id: 't1',
            title: 'Common themes',
            body: 'Academic stress and sleep show up often in session notes (mock).',
            tone: 'neutral',
          },
        ],
      };
    case 'journal':
      return {
        id: `report-journal-${period}`,
        kind,
        title: 'Journal Report',
        subtitle: 'Reflection activity',
        ...common,
        headline: 'Writing stayed light but meaningful.',
        stats: [
          { id: 'entries', label: 'Entries', value: '9' },
          { id: 'words', label: 'Words', value: '2.4k' },
          { id: 'streak', label: 'Streak', value: '3 days' },
        ],
        charts: [journalChart()],
        insights: [
          {
            id: 'j1',
            title: 'Theme: boundaries',
            body: 'Several entries explore saying no and protecting energy.',
            tone: 'positive',
          },
        ],
      };
    case 'habit':
      return {
        id: `report-habit-${period}`,
        kind,
        title: 'Habit Report',
        subtitle: 'Consistency across habits',
        ...common,
        headline: 'Breathing and sleep wind-down led the pack.',
        stats: [
          { id: 'rate', label: 'Completion', value: '68%' },
          { id: 'top', label: 'Top habit', value: 'Breathing' },
          { id: 'missed', label: 'Missed', value: '4' },
        ],
        charts: [habitChart()],
        insights: [
          {
            id: 'h1',
            title: 'Morning works better',
            body: 'Habits logged before noon stick more often.',
            tone: 'positive',
          },
        ],
      };
    case 'sleep':
      return {
        id: `report-sleep-${period}`,
        kind,
        title: 'Sleep Report',
        subtitle: 'Rest and recovery',
        ...common,
        headline: 'Sleep is adequate with room for a steadier bedtime.',
        stats: [
          { id: 'avg', label: 'Avg hours', value: '6.8' },
          { id: 'quality', label: 'Quality', value: 'Fair' },
          { id: 'debt', label: 'Sleep debt', value: 'low' },
        ],
        charts: [sleepChart()],
        insights: [
          {
            id: 's1',
            title: 'Late nights',
            body: 'Thursday and Sunday ran shorter — protect those evenings.',
            tone: 'caution',
          },
        ],
      };
    case 'stress':
      return {
        id: `report-stress-${period}`,
        kind,
        title: 'Stress Report',
        subtitle: 'Pressure and recovery',
        ...common,
        headline: 'Stress peaked mid-week and eased by weekend.',
        stats: [
          { id: 'avg', label: 'Avg stress', value: '4.6', hint: '/10' },
          { id: 'peak', label: 'Peak day', value: 'Wed' },
          { id: 'calm', label: 'Calm days', value: '3' },
        ],
        charts: [stressChart(), moodChart('7d')],
        insights: [
          {
            id: 'st1',
            title: 'Recovery window',
            body: 'Breathing sessions after high-stress days correlate with lower next-day ratings.',
            tone: 'positive',
          },
        ],
      };
    case 'wellness':
    default:
      return {
        id: `report-wellness-${period}`,
        kind: 'wellness',
        title: 'Wellness Summary',
        subtitle: 'Cross-domain snapshot',
        ...common,
        headline: 'Overall wellness is stable with quiet gains.',
        stats: [
          { id: 'score', label: 'Wellness score', value: '72' },
          { id: 'mood', label: 'Mood', value: '6.8' },
          { id: 'sleep', label: 'Sleep', value: '6.8h' },
          { id: 'stress', label: 'Stress', value: '4.2' },
        ],
        charts: [moodChart(period), sleepChart(), stressChart(), habitChart()],
        insights: [
          {
            id: 'we1',
            title: 'Balanced effort',
            body: 'Mood, sleep, and habits are moving together — keep the gentle pace.',
            tone: 'positive',
          },
        ],
      };
  }
}

export function buildMockDashboard(period: ReportPeriodId): WellnessDashboardSnapshot {
  const report = buildMockReport('wellness', period);
  return {
    overallScore: 72,
    overallLabel: 'Steady progress',
    periodLabel: periodLabel(period),
    stats: report.stats,
    charts: report.charts,
    recentReports: [
      { kind: 'weekly', title: 'Weekly Report', subtitle: 'Last 7 days' },
      { kind: 'mood', title: 'Mood Report', subtitle: 'Trends & insights' },
      { kind: 'sleep', title: 'Sleep Report', subtitle: 'Rest patterns' },
      { kind: 'habit', title: 'Habit Report', subtitle: 'Consistency' },
    ],
    highlights: report.insights,
  };
}

export function buildMockExport(
  kind: ReportKind,
  format: ReportExportFormat,
  report: WellnessReportSummary,
): ReportExportPayload {
  const exportedAt = new Date().toISOString();
  const baseName = `hey-attrangi-${kind}-report`;

  if (format === 'pdf') {
    return {
      reportId: report.id,
      kind,
      format,
      filename: `${baseName}.pdf`,
      content:
        '[PDF PLACEHOLDER]\n\nNative PDF generation will attach here.\n' +
        `${report.title}\n${report.headline}\nGenerated ${exportedAt}`,
      exportedAt,
      isPlaceholder: true,
    };
  }

  if (format === 'csv') {
    const rows = [
      'section,label,value',
      ...report.stats.map((s) => `stat,${s.label},${s.value}`),
      ...report.charts.flatMap((c) =>
        c.points.map((p) => `chart:${c.id},${p.label},${p.value}`),
      ),
    ];
    return {
      reportId: report.id,
      kind,
      format,
      filename: `${baseName}.csv`,
      content: rows.join('\n'),
      exportedAt,
      isPlaceholder: false,
    };
  }

  return {
    reportId: report.id,
    kind,
    format,
    filename: `${baseName}.json`,
    content: JSON.stringify(report, null, 2),
    exportedAt,
    isPlaceholder: false,
  };
}

export function buildMockShare(report: WellnessReportSummary): ReportSharePayload {
  return {
    title: report.title,
    message: `Hey Attrangi — ${report.title}\n${report.headline}\nPeriod: ${report.periodLabel}\n(Shareable link coming with backend)`,
  };
}
