import { BackendBooking } from '../../api/types/backend';
import { BookingRecord, CalendarDay, CreateBookingInput } from '../../types/domain';

export function mapBackendBooking(raw: BackendBooking): BookingRecord {
  return {
    id: raw.id,
    therapistId: raw.therapistId,
    userId: raw.userId,
    reason: raw.reason,
    sessionDate: raw.sessionDate,
    sessionTime: raw.sessionTime,
    price: raw.price,
    status: raw.status,
    paymentStatus: raw.paymentStatus,
    paymentUrl: raw.paymentUrl ?? null,
    meetingId: raw.meetingId ?? null,
    meetUrl: raw.meetUrl ?? null,
  };
}

export function mapCreateBookingInput(input: CreateBookingInput) {
  return {
    therapistId: input.therapistId,
    reason: input.reason.trim(),
    sessionDate: input.sessionDate,
    sessionTime: input.sessionTime,
    price: input.price,
  };
}

export function mapAvailabilityCalendarDays(
  days: Array<CalendarDay & { isoDate?: string }>,
): CalendarDay[] {
  return days.map((day) => ({
    dayLabel: day.dayLabel,
    date: day.date,
    state: day.state,
    isoDate: day.isoDate,
  }));
}
