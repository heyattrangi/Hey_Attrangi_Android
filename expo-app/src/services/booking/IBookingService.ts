import { ApiResponse } from '../../types/api';
import {
  BookingAvailability,
  BookingRecord,
  CalendarDay,
  CreateBookingInput,
  TimeSlot,
} from '../../types/domain';

export interface IBookingService {
  getAvailability(therapistId: string): Promise<ApiResponse<BookingAvailability>>;
  getAvailableDates(therapistId: string): Promise<ApiResponse<CalendarDay[]>>;
  getAvailableTimeSlots(therapistId: string): Promise<ApiResponse<TimeSlot[]>>;
  createBooking(input: CreateBookingInput): Promise<ApiResponse<BookingRecord>>;
  listBookings(): Promise<ApiResponse<BookingRecord[]>>;
  getBooking(id: string): Promise<ApiResponse<BookingRecord | null>>;
  rescheduleBooking(
    _bookingId: string,
    _sessionDate: string,
    _sessionTime: string,
  ): Promise<ApiResponse<BookingRecord>>;
  cancelBooking(_bookingId: string): Promise<ApiResponse<BookingRecord>>;
}
