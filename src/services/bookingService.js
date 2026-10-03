import api from './api';

export const bookingService = {
  /**
   * Book a single seat
   * POST /bookings
   * @param {{ sessionId: number|string, row: number, seat: number }} data
   */
  async bookSeat(data) {
    const payload = {
      sessionId: Number(data.sessionId),
      row: Number(data.row),
      seat: Number(data.seat),
    };
    const response = await api.post('/bookings', payload);
    return response.data;
  },

  /**
   * Sequential booking of multiple seats
   * Sends individual requests sequentially as required by backend.
   * Tracks succeeded and failed seats accurately without halting on single error.
   * @param {number|string} sessionId
   * @param {Array<{ row: number, seat: number }>} seats
   * @returns {Promise<{
   *   successCount: number,
   *   failedCount: number,
   *   successfulSeats: Array<{ row: number, seat: number }>,
   *   failedSeats: Array<{ row: number, seat: number, error: any }>
   * }>}
   */
  async bookMultipleSeats(sessionId, seats) {
    const results = {
      successCount: 0,
      failedCount: 0,
      successfulSeats: [],
      failedSeats: [],
    };

    for (const s of seats) {
      try {
        await this.bookSeat({
          sessionId,
          row: s.row,
          seat: s.seat,
        });
        results.successCount += 1;
        results.successfulSeats.push(s);
      } catch (err) {
        results.failedCount += 1;
        results.failedSeats.push({
          row: s.row,
          seat: s.seat,
          error: err,
        });
      }
    }

    return results;
  },

  /**
   * Get current user's bookings
   * GET /bookings/my
   */
  async getMyBookings() {
    const response = await api.get('/bookings/my');
    const resData = response.data;

    if (Array.isArray(resData)) {
      return resData;
    }
    if (Array.isArray(resData?.data)) {
      return resData.data;
    }
    if (Array.isArray(resData?.bookings)) {
      return resData.bookings;
    }
    return [];
  },

  /**
   * Cancel / delete a booking
   * DELETE /bookings/:id
   * @param {string|number} bookingId
   */
  async cancelBooking(bookingId) {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },
};

export default bookingService;
