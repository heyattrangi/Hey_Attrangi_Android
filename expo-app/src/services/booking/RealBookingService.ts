import { successResponse, failureResponse, normalizeServiceError } from '../../api/client';
import { bookingRepository } from '../../repositories';
import { ApiResponse } from '../../types/api';
import { BookingAvailability, BookingRecord, CreateBookingInput } from '../../types/domain';
import { IBookingService } from './IBookingService';
import { mockBookingService } from './MockBookingService';

export class RealBookingService implements IBookingService {
  async getAvailability(therapistId: string): Promise<ApiResponse<BookingAvailability>> {
    try {
      return successResponse(await bookingRepository.getAvailability(therapistId));
    } catch (error) {
      return failureResponse(normalizeServiceError(error));
    }
  }

  getAvailableDates = mockBookingService.getAvailableDates.bind(mockBookingService);
  getAvailableTimeSlots = mockBookingService.getAvailableTimeSlots.bind(mockBookingService);

  async createBooking(input: CreateBookingInput): Promise<ApiResponse<BookingRecord>> {
    try {
      return successResponse(await bookingRepository.create(input));
    } catch {
      return mockBookingService.createBooking(input);
    }
  }

  listBookings = mockBookingService.listBookings.bind(mockBookingService);
  getBooking = mockBookingService.getBooking.bind(mockBookingService);
  rescheduleBooking = mockBookingService.rescheduleBooking.bind(mockBookingService);
  cancelBooking = mockBookingService.cancelBooking.bind(mockBookingService);
}

export const realBookingService = new RealBookingService();
