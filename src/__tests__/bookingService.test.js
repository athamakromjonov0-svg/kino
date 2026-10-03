import { describe, it, expect, beforeEach, vi } from 'vitest';
import bookingService from '../services/bookingService';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('bookingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Scenario 10 & 13: Books a single seat via POST /bookings', async () => {
    api.post.mockResolvedValueOnce({
      data: { id: 50, sessionId: 101, row: 3, seat: 5, status: 'Tasdiqlangan' },
    });

    const result = await bookingService.bookSeat({ sessionId: 101, row: 3, seat: 5 });

    expect(api.post).toHaveBeenCalledWith('/bookings', {
      sessionId: 101,
      row: 3,
      seat: 5,
    });
    expect(result.id).toBe(50);
  });

  it('Scenario 11: Books multiple seats sequentially without halting on error', async () => {
    api.post
      .mockResolvedValueOnce({ data: { id: 1, sessionId: 101, row: 1, seat: 1 } })
      .mockRejectedValueOnce({
        response: { status: 409, data: { message: "Tanlangan joy band" } },
      })
      .mockResolvedValueOnce({ data: { id: 3, sessionId: 101, row: 1, seat: 3 } });

    const seatsToBook = [
      { row: 1, seat: 1 },
      { row: 1, seat: 2 },
      { row: 1, seat: 3 },
    ];

    const result = await bookingService.bookMultipleSeats(101, seatsToBook);

    expect(api.post).toHaveBeenCalledTimes(3);
    expect(result.successCount).toBe(2);
    expect(result.failedCount).toBe(1);
    expect(result.successfulSeats).toHaveLength(2);
    expect(result.failedSeats).toHaveLength(1);
    expect(result.failedSeats[0].seat).toBe(2);
  });

  it('Scenario 15: Fetches current user bookings via GET /bookings/my', async () => {
    const mockBookings = [
      { id: 1, sessionId: 101, row: 2, seat: 4, status: 'Tasdiqlangan' },
    ];
    api.get.mockResolvedValueOnce({ data: mockBookings });

    const bookings = await bookingService.getMyBookings();
    expect(api.get).toHaveBeenCalledWith('/bookings/my');
    expect(bookings).toHaveLength(1);
  });

  it('Scenario 16: Cancels booking via DELETE /bookings/:id', async () => {
    api.delete.mockResolvedValueOnce({
      data: { message: 'Bron muvaffaqiyatli bekor qilindi' },
    });

    const res = await bookingService.cancelBooking(1);
    expect(api.delete).toHaveBeenCalledWith('/bookings/1');
    expect(res.message).toBe('Bron muvaffaqiyatli bekor qilindi');
  });

  it('Scenario 17: Handles 403 when trying to cancel another user booking', async () => {
    api.delete.mockRejectedValueOnce({
      response: { status: 403, data: { message: "Bu bron boshqa foydalanuvchiga tegishli" } },
    });

    await expect(bookingService.cancelBooking(999)).rejects.toMatchObject({
      response: { status: 403 },
    });
  });
});
