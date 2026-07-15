import { mockDelay, successResponse } from '../../api/client';
import { ApiResponse } from '../../types/api';
import { mockCalendarDays, mockTimeSlots } from '../../mocks/mockBooking';
import {
  BookingRecord,
  CreateBookingInput,
} from '../../types/domain';
import { ValidationError } from '../../types/errors';
import { IBookingService } from './IBookingService';

let bookings: BookingRecord[] = [];

/**
 * @deprecated Retained until full backend migration completes. Use ApiBookingService via DI.
 */
export class MockBookingService implements IBookingService {
  async getAvailability(_therapistId: string) {
    return mockDelay(
      successResponse({
        calendarDays: mockCalendarDays.map((d) => ({ ...d })),
        timeSlots: [...mockTimeSlots],
      }),
    );
  }

  async getAvailableDates(therapistId: string) {
    const response = await this.getAvailability(therapistId);
    return successResponse(response.data.calendarDays);
  }

  async getAvailableTimeSlots(therapistId: string) {
    const response = await this.getAvailability(therapistId);
    return successResponse(response.data.timeSlots);
  }

  async createBooking(input: CreateBookingInput) {
    const id = `booking-${Date.now()}`;
    const booking: BookingRecord = {
      id,
      therapistId: input.therapistId,
      reason: input.reason,
      sessionDate: input.sessionDate,
      sessionTime: input.sessionTime,
      price: input.price,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentUrl: `https://pay.aatrangi.app/mock/${id}`,
      meetUrl: `https://meet.aatrangi.app/${id}`,
    };
    bookings = [booking, ...bookings];
    return mockDelay(successResponse({ ...booking }));
  }

  async listBookings() {
    return mockDelay(successResponse(bookings.map((b) => ({ ...b }))));
  }

  async getBooking(id: string) {
    const booking = bookings.find((item) => item.id === id) ?? null;
    return mockDelay(successResponse(booking ? { ...booking } : null));
  }

  async rescheduleBooking(
    _bookingId: string,
    _sessionDate: string,
    _sessionTime: string,
  ): Promise<ApiResponse<BookingRecord>> {
    throw new ValidationError('Rescheduling is not supported by the backend yet.');
  }

  async cancelBooking(_bookingId: string): Promise<ApiResponse<BookingRecord>> {
    throw new ValidationError('Cancellation is not supported by the backend yet.');
  }
}

/** @deprecated Use apiBookingService from the DI container. */
export const mockBookingService = new MockBookingService();
