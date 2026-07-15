import { CalendarDay, TimeSlot } from '../types/domain';

export const mockCalendarDays: CalendarDay[] = [
  { dayLabel: 'Mon', date: 10, state: 'past', isoDate: '2026-03-10T00:00:00.000Z' },
  { dayLabel: 'Tue', date: 11, state: 'past', isoDate: '2026-03-11T00:00:00.000Z' },
  { dayLabel: 'Wed', date: 12, state: 'past', isoDate: '2026-03-12T00:00:00.000Z' },
  { dayLabel: 'Thu', date: 13, state: 'selected', isoDate: '2026-03-13T00:00:00.000Z' },
  { dayLabel: 'Fri', date: 14, state: 'future', isoDate: '2026-03-14T00:00:00.000Z' },
  { dayLabel: 'Sat', date: 15, state: 'unavailable', isoDate: '2026-03-15T00:00:00.000Z' },
  { dayLabel: 'Sun', date: 16, state: 'future', isoDate: '2026-03-16T00:00:00.000Z' },
];

export const mockTimeSlots: TimeSlot[] = [
  '1:30-2:15 pm',
  '2:30-3:15 pm',
  '3:30-4:15 pm',
  '4:30-5:15 pm',
  '5:30-6:15 pm',
  '6:30-7:15 pm',
];

/** Slots marked unavailable for premium chip disabled state */
export const mockUnavailableSlots: string[] = ['3:30-4:15 pm', '5:30-6:15 pm'];
