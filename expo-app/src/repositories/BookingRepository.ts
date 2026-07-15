import { BookingRecord } from '../data/models';
import { BookingAvailability, CreateBookingInput } from '../types/domain';
import { BaseRepository } from './base/BaseRepository';

export class BookingRepository extends BaseRepository {
  async getAvailability(therapistId: string): Promise<BookingAvailability> {
    const { data } = await this.http.get<BookingAvailability>(
      `/booking/availability/${therapistId}`,
    );
    return data;
  }

  async create(input: CreateBookingInput): Promise<BookingRecord> {
    const { data } = await this.http.post<BookingRecord>('/booking', input);
    return data;
  }
}

export const bookingRepository = new BookingRepository();
